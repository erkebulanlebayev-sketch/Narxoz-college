'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Search, Trash2, GraduationCap, BookOpen } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
};

export default function AdminUsersPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'students' | 'teachers'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
    const s = supabase.channel('users-students').on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, loadData).subscribe();
    const t = supabase.channel('users-teachers').on('postgres_changes', { event: '*', schema: 'public', table: 'teachers' }, loadData).subscribe();
    return () => { supabase.removeChannel(s); supabase.removeChannel(t); };
  }, []);

  async function loadData() {
    const [s, t] = await Promise.all([
      supabase.from('students').select('*').order('created_at', { ascending: false }),
      supabase.from('teachers').select('*').order('created_at', { ascending: false }),
    ]);
    setStudents(s.data || []);
    setTeachers(t.data || []);
    setLoading(false);
  }

  async function deleteUser(table: string, id: number) {
    if (!confirm('Удалить пользователя?')) return;
    await supabase.from(table).delete().eq('id', id);
    loadData();
  }

  const allUsers = [
    ...students.map(s => ({ ...s, role: 'student' })),
    ...teachers.map(t => ({ ...t, role: 'teacher' })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const displayed = (tab === 'all' ? allUsers : tab === 'students' ? students.map(s => ({ ...s, role: 'student' })) : teachers.map(t => ({ ...t, role: 'teacher' })))
    .filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <DarkLayout role="admin">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-8">

        <motion.div variants={stagger.item} className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Admin Portal</p>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            Пользователи <span className="text-white/20">/ контроль</span>
          </h1>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger.item} className="grid grid-cols-3 gap-4">
          {[
            { label: 'Всего', value: students.length + teachers.length },
            { label: 'Студентов', value: students.length },
            { label: 'Преподавателей', value: teachers.length },
          ].map((s, i) => (
            <div key={i} className="p-5 rounded-[20px] bg-white/[0.02] border border-white/5">
              <div className="text-3xl font-black italic tracking-tighter">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs + Search */}
        <motion.div variants={stagger.item} className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            {(['all', 'students', 'teachers'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black italic uppercase tracking-tighter transition-all ${
                  tab === t ? 'bg-red-600 text-white' : 'bg-white/[0.03] border border-white/5 text-gray-500 hover:text-white'
                }`}>
                {t === 'all' ? 'Все' : t === 'students' ? 'Студенты' : 'Преподаватели'}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени или email..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors" />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={stagger.item} className="rounded-[24px] bg-white/[0.02] border border-white/5 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Роль', 'Имя', 'Email', 'Доп. инфо', 'Дата', ''].map(h => (
                      <th key={h} className="text-left px-5 py-4 font-bold uppercase tracking-widest text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-700">Пользователей не найдено</td></tr>
                  ) : displayed.map((u, i) => (
                    <motion.tr key={`${u.role}-${u.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3">
                        <span className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border w-fit ${
                          u.role === 'student' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'
                        }`}>
                          {u.role === 'student' ? <GraduationCap size={9} /> : <BookOpen size={9} />}
                          {u.role === 'student' ? 'Студент' : 'Преподаватель'}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-bold text-white/80">{u.name}</td>
                      <td className="px-5 py-3 text-gray-600 font-mono text-[10px]">{u.email}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {u.role === 'student'
                          ? <span className="font-mono text-[10px]">{u.group_name} · GPA {u.gpa?.toFixed(1)}</span>
                          : <span className="text-[10px]">{u.subject || '—'}</span>}
                      </td>
                      <td className="px-5 py-3 text-gray-700 font-mono text-[10px]">{new Date(u.created_at).toLocaleDateString('ru-RU')}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => deleteUser(u.role === 'student' ? 'students' : 'teachers', u.id)}
                          className="p-1.5 rounded-lg border border-white/5 text-gray-600 hover:text-red-500 hover:border-red-600/20 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </motion.div>
    </DarkLayout>
  );
}
