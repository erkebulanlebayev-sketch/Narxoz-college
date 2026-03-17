'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

const TYPE_LABELS: Record<string, string> = { lecture: 'Лекция', srsp: 'СРСП', srs: 'СРС', midterm: 'Рубежный', final: 'Экзамен' };

function gradeColor(g: number) {
  if (g >= 90) return 'text-green-400';
  if (g >= 75) return 'text-blue-400';
  if (g >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

function GradeBar({ value }: { value: number }) {
  return (
    <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-2">
      <motion.div className={`h-full rounded-full ${value >= 75 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
        initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
    </div>
  );
}

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrades();
    const ch = supabase.channel('student-grades').on('postgres_changes', { event: '*', schema: 'public', table: 'grades' }, loadGrades).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function loadGrades() {
    const user = await getCurrentUser();
    const { data: student } = await supabase.from('students').select('id').eq('email', user?.email).single();
    if (!student) { setLoading(false); return; }
    const { data } = await supabase.from('grades').select('*, teachers(name)').eq('student_id', student.id).order('created_at', { ascending: false });
    setGrades(data || []);
    setLoading(false);
  }

  // Group by subject
  const bySubject: Record<string, any[]> = {};
  grades.forEach(g => { if (!bySubject[g.subject]) bySubject[g.subject] = []; bySubject[g.subject].push(g); });

  const gpa = grades.length > 0 ? (grades.reduce((s, g) => s + g.grade, 0) / grades.length).toFixed(1) : '0.0';

  return (
    <DarkLayout role="student">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-8">

        <motion.div variants={stagger.item} className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Student Portal</p>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            Мои <span className="text-white/20">оценки</span>
          </h1>
        </motion.div>

        {/* GPA summary */}
        <motion.div variants={stagger.item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Средний балл', value: gpa },
            { label: 'Всего оценок', value: grades.length },
            { label: 'Отлично (90+)', value: grades.filter(g => g.grade >= 90).length },
            { label: 'Предметов', value: Object.keys(bySubject).length },
          ].map((s, i) => (
            <div key={i} className="p-5 rounded-[20px] bg-white/[0.02] border border-white/5">
              <div className="text-3xl font-black italic tracking-tighter text-white">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : Object.keys(bySubject).length === 0 ? (
          <div className="text-center py-20"><p className="text-gray-700 font-bold uppercase tracking-widest text-sm">Оценок пока нет</p></div>
        ) : (
          <motion.div variants={stagger.container} className="space-y-4">
            {Object.entries(bySubject).map(([subject, items]) => {
              const avg = items.reduce((s, g) => s + g.grade, 0) / items.length;
              const teacher = items[0]?.teachers?.name;
              return (
                <motion.div key={subject} variants={stagger.item}
                  className="rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-black italic uppercase tracking-tighter text-white">{subject}</h3>
                      {teacher && <p className="text-[10px] text-gray-600 mt-0.5">{teacher}</p>}
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-black italic ${gradeColor(avg)}`}>{avg.toFixed(1)}</span>
                      <p className="text-[9px] text-gray-700 font-mono">avg</p>
                    </div>
                  </div>

                  <GradeBar value={avg} />

                  {/* Grades by type */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
                    {Object.entries(TYPE_LABELS).map(([type, label]) => {
                      const typeGrades = items.filter(g => g.grade_type === type);
                      return (
                        <div key={type} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-2">{label}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {typeGrades.length > 0 ? typeGrades.map((g, i) => (
                              <span key={i} className={`text-sm font-black italic ${gradeColor(g.grade)}`}>{g.grade}</span>
                            )) : <span className="text-[10px] text-gray-700">—</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

      </motion.div>
    </DarkLayout>
  );
}
