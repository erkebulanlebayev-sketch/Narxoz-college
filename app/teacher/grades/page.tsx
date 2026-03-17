'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { Plus, X, CheckCircle, XCircle } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.05 } } },
  item: { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
};

const TYPE_LABELS: Record<string, string> = { lecture: 'Лекция', srsp: 'СРСП', srs: 'СРС', midterm: 'Рубежный', final: 'Экзамен' };

export default function TeacherGradesPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [form, setForm] = useState({ student_id: '', subject: '', grade_type: 'lecture', grade: 75, comment: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
    checkSettings();
    const ch = supabase.channel('teacher-grades').on('postgres_changes', { event: '*', schema: 'public', table: 'grades' }, loadGrades).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function checkSettings() {
    const { data } = await supabase.from('settings').select('value').eq('key', 'grade_submission_window').single();
    setCanSubmit(data?.value?.enabled ?? true);
  }

  async function loadData() {
    await Promise.all([loadStudents(), loadGrades()]);
    setLoading(false);
  }

  async function loadStudents() {
    const { data } = await supabase.from('students').select('id, name, group_name').order('name');
    setStudents(data || []);
  }

  async function loadGrades() {
    const { data } = await supabase.from('grades').select('*, students(name, group_name)').order('created_at', { ascending: false }).limit(50);
    setGrades(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    const user = await getCurrentUser();
    const { data: teacher } = await supabase.from('teachers').select('id').eq('email', user?.email).single();
    if (!teacher) { setSaving(false); return; }
    await supabase.from('grades').insert([{ student_id: Number(form.student_id), teacher_id: teacher.id, subject: form.subject, grade_type: form.grade_type, grade: Number(form.grade), comment: form.comment || null }]);
    setModal(false);
    setForm({ student_id: '', subject: '', grade_type: 'lecture', grade: 75, comment: '' });
    setSaving(false);
    loadGrades();
  }

  return (
    <DarkLayout role="teacher">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-8">

        <motion.div variants={stagger.item} className="border-b border-white/5 pb-8 flex items-end justify-between">
          <div>
            <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Teacher Portal</p>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
              Журнал <span className="text-white/20">оценок</span>
            </h1>
          </div>
          <button onClick={() => setModal(true)} disabled={!canSubmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-30 text-white rounded-xl text-[11px] font-black italic uppercase tracking-tighter transition-colors">
            <Plus size={14} />Выставить
          </button>
        </motion.div>

        {!canSubmit && (
          <motion.div variants={stagger.item} className="p-4 rounded-xl border border-red-600/20 bg-red-600/5 text-red-400 text-[11px] font-bold uppercase tracking-widest">
            Выставление оценок закрыто администратором
          </motion.div>
        )}

        {/* Grades table */}
        <motion.div variants={stagger.item} className="rounded-[24px] bg-white/[0.02] border border-white/5 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Студент', 'Группа', 'Предмет', 'Тип', 'Оценка', 'Статус', 'Дата'].map(h => (
                      <th key={h} className="text-left px-5 py-4 font-bold uppercase tracking-widest text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grades.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-700">Оценок пока нет</td></tr>
                  ) : grades.map((g, i) => (
                    <motion.tr key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-bold text-white/80">{g.students?.name || '—'}</td>
                      <td className="px-5 py-3 text-gray-600 font-mono">{g.students?.group_name || '—'}</td>
                      <td className="px-5 py-3 text-gray-400">{g.subject}</td>
                      <td className="px-5 py-3 text-gray-600">{TYPE_LABELS[g.grade_type] || g.grade_type}</td>
                      <td className="px-5 py-3">
                        <span className={`text-base font-black italic ${g.grade >= 75 ? 'text-green-400' : g.grade >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{g.grade}</span>
                      </td>
                      <td className="px-5 py-3">
                        {g.grade >= 60
                          ? <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold"><CheckCircle size={10} />Зачёт</span>
                          : <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold"><XCircle size={10} />Незачёт</span>}
                      </td>
                      <td className="px-5 py-3 text-gray-700 font-mono text-[10px]">{new Date(g.created_at).toLocaleDateString('ru-RU')}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {modal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
              <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
                className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[24px] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black italic uppercase tracking-tighter">Выставить оценку</h2>
                  <button onClick={() => setModal(false)} className="text-gray-600 hover:text-white transition-colors"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Студент</label>
                    <select value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600/50 transition-colors">
                      <option value="" className="bg-[#111]">Выберите студента</option>
                      {students.map(s => <option key={s.id} value={s.id} className="bg-[#111]">{s.name} ({s.group_name})</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Предмет</label>
                      <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required placeholder="Математика"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Тип</label>
                      <select value={form.grade_type} onChange={e => setForm({ ...form, grade_type: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600/50 transition-colors">
                        {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v} className="bg-[#111]">{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Оценка: <span className="text-white">{form.grade}</span></label>
                    <input type="range" min={0} max={100} value={form.grade} onChange={e => setForm({ ...form, grade: Number(e.target.value) })}
                      className="w-full accent-red-600" />
                    <div className="flex justify-between text-[9px] text-gray-700 font-mono mt-1"><span>0</span><span>50</span><span>100</span></div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Комментарий</label>
                    <input value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} placeholder="Опционально"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors" />
                  </div>
                  <button type="submit" disabled={saving}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black italic uppercase tracking-tighter text-sm py-3.5 rounded-xl transition-colors">
                    {saving ? 'Сохраняем...' : 'Выставить оценку'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </DarkLayout>
  );
}
