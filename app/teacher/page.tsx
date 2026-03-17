'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Calendar, BarChart2, Users, FileText, Newspaper, User, ArrowUpRight, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

const GROUPS = ['ИС-21-1', 'ИС-21-2', 'ИС-22-1', 'ИС-22-2', 'ИС-23-1', 'ИС-23-2'];

function GradeStatus({ grade }: { grade: number }) {
  if (grade >= 70) return <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold"><CheckCircle size={10} />Зачёт</span>;
  if (grade >= 50) return <span className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold"><Clock size={10} />Пересдача</span>;
  return <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold"><XCircle size={10} />Незачёт</span>;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({ classes: 0, groups: 0, materials: 0, grades: 0 });
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [recentGrades, setRecentGrades] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState(GROUPS[0]);
  const [groupStudents, setGroupStudents] = useState<any[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);
  useEffect(() => { loadGroupStudents(); }, [selectedGroup]);

  async function loadDashboard() {
    try {
      const user = await getCurrentUser();
      const name = user?.user_metadata?.name || 'Преподаватель';
      setUserName(name);

      const { data: teacherData } = await supabase.from('teachers').select('id').eq('email', user?.email).single();
      const today = new Date().getDay();
      const dayMap: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };

      if (teacherData) {
        const [scheduleData, gradesData, materialsData] = await Promise.all([
          supabase.from('schedule').select('*', { count: 'exact' }).eq('teacher_id', teacherData.id),
          supabase.from('grades').select('*', { count: 'exact' }),
          supabase.from('materials').select('*', { count: 'exact' }),
        ]);
        const { data: todaySchedule } = await supabase.from('schedule').select('*').eq('teacher_id', teacherData.id).eq('day', dayMap[today] ?? 0).order('start_time');
        const { data: grades } = await supabase.from('grades').select('*').order('created_at', { ascending: false }).limit(8);
        setStats({ classes: scheduleData.count || 0, groups: new Set(scheduleData.data?.map((s: any) => s.group_name)).size, materials: materialsData.count || 0, grades: gradesData.count || 0 });
        setTodayClasses(todaySchedule || []);
        setRecentGrades(grades || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function loadGroupStudents() {
    const { data } = await supabase.from('students').select('*').eq('group_name', selectedGroup).limit(10);
    setGroupStudents(data || []);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
  }

  const statCards = [
    { label: 'Занятий', value: stats.classes, icon: Calendar, id: '01' },
    { label: 'Групп', value: stats.groups, icon: Users, id: '02' },
    { label: 'Материалов', value: stats.materials, icon: FileText, id: '03' },
    { label: 'Оценок', value: stats.grades, icon: BarChart2, id: '04' },
  ];

  if (loading) return (
    <DarkLayout role="teacher">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </DarkLayout>
  );

  return (
    <DarkLayout role="teacher">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-8">

        <motion.div variants={stagger.item} className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Teacher Portal</p>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            Добро пожаловать, <span className="text-white/20">{userName}</span>
          </h1>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger.item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="p-6 rounded-[20px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <Icon size={18} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                  <span className="text-[9px] font-mono text-gray-700">{s.id}</span>
                </div>
                <div className="text-3xl font-black italic tracking-tighter">{s.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-1">{s.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Journal + Schedule */}
        <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Electronic Journal */}
          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Журнал оценок</p>
              {/* Group selector */}
              <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}
                className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 focus:outline-none focus:border-red-600/50">
                {GROUPS.map(g => <option key={g} value={g} className="bg-[#111]">{g}</option>)}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-2 pr-4 font-bold uppercase tracking-widest text-gray-600">Студент</th>
                    <th className="text-center py-2 px-2 font-bold uppercase tracking-widest text-gray-600">Оценка</th>
                    <th className="text-center py-2 pl-2 font-bold uppercase tracking-widest text-gray-600">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {groupStudents.length > 0 ? groupStudents.map((s, i) => (
                    <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 pr-4 font-bold text-white/80 truncate max-w-[120px]">{s.name}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="font-black italic text-white">{s.gpa ? (s.gpa * 25).toFixed(0) : '—'}</span>
                      </td>
                      <td className="py-2.5 pl-2 text-center">
                        <GradeStatus grade={s.gpa ? s.gpa * 25 : 0} />
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="py-6 text-center text-gray-700">Студентов нет</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <button onClick={() => router.push('/teacher/grades')}
              className="mt-4 w-full py-2 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 hover:border-red-600/20 transition-all">
              Открыть полный журнал →
            </button>
          </div>

          {/* Today's schedule */}
          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-red-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Сегодня</p>
              </div>
              <button onClick={() => router.push('/teacher/schedule')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Все <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="space-y-3">
              {todayClasses.length > 0 ? todayClasses.map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-white">{c.subject}</p>
                    <span className="text-[9px] font-mono text-red-500 border border-red-600/20 px-2 py-0.5 rounded-full">{c.room}</span>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1">Группа: <span className="text-white/60">{c.group_name}</span></p>
                  <p className="text-[10px] text-gray-600 font-mono">{c.start_time} — {c.end_time}</p>
                </div>
              )) : <p className="text-gray-700 text-sm text-center py-6">Сегодня занятий нет</p>}
            </div>
          </div>
        </motion.div>

        {/* Upload area + Recent grades */}
        <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Drag & Drop Upload */}
          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-4">Репозиторий материалов</p>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                dragOver ? 'border-red-600/50 bg-red-600/5' : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input id="file-input" type="file" multiple className="hidden"
                onChange={e => { const files = Array.from(e.target.files || []); setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]); }} />
              <Upload size={24} className={`mx-auto mb-3 ${dragOver ? 'text-red-500' : 'text-gray-600'}`} />
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Перетащите PDF/PPT</p>
              <p className="text-[9px] text-gray-700 mt-1">или нажмите для выбора</p>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <FileText size={14} className="text-red-500 shrink-0" />
                    <span className="text-[11px] text-gray-400 truncate">{f}</span>
                    <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))} className="ml-auto text-gray-700 hover:text-red-500 transition-colors">
                      <XCircle size={14} />
                    </button>
                  </div>
                ))}
                <button onClick={() => router.push('/teacher/materials')}
                  className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-black italic uppercase tracking-tighter transition-colors">
                  Загрузить в систему →
                </button>
              </div>
            )}
          </div>

          {/* Recent grades */}
          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Последние оценки</p>
              <button onClick={() => router.push('/teacher/grades')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Все <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="space-y-2">
              {recentGrades.length > 0 ? recentGrades.map((g) => (
                <div key={g.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">{g.student_name}</p>
                    <p className="text-[9px] text-gray-600 truncate">{g.subject}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    <GradeStatus grade={g.grade} />
                    <span className={`text-base font-black italic ${g.grade >= 70 ? 'text-green-500' : g.grade >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{g.grade}</span>
                  </div>
                </div>
              )) : <p className="text-gray-700 text-sm text-center py-6">Оценок пока нет</p>}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </DarkLayout>
  );
}
