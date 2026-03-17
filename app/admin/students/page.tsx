'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Search, User, X } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

interface Student {
  id: string;
  name: string;
  email: string;
  group_name?: string;
  course?: number;
  created_at: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Student | null>(null);

  useEffect(() => { loadStudents(); }, []);

  async function loadStudents() {
    const { data } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    setStudents(data || []);
    setLoading(false);
  }

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.group_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DarkLayout role="admin">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-10">
        <motion.div variants={stagger.item} className="relative border-b border-white/5 pb-8 overflow-hidden">
          <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
          <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
            Admin Portal · Students
          </p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            Студенты<br /><span className="text-white/10">Управление</span>
          </h1>
        </motion.div>

        <motion.div variants={stagger.item} className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени, email, группе..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors" />
        </motion.div>

        <motion.div variants={stagger.item} className="flex gap-4">
          <div className="px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Всего</p>
            <p className="text-2xl font-black">{students.length}</p>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Найдено</p>
            <p className="text-2xl font-black">{filtered.length}</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div variants={stagger.item} className="text-center py-24">
            <p className="text-gray-700 font-bold uppercase tracking-widest text-sm font-mono">// студенты не найдены</p>
          </motion.div>
        ) : (
          <motion.div variants={stagger.container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(s => (
              <motion.div key={s.id} variants={stagger.item} whileHover={{ scale: 1.02 }} onClick={() => setSelected(s)}
                className="group p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-red-600/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.08)] transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 group-hover:border-red-600/20 flex items-center justify-center mb-4 transition-all">
                  <User size={20} className="text-gray-500 group-hover:text-red-500 transition-colors" />
                </div>
                <h3 className="font-black italic uppercase tracking-tighter text-lg leading-tight mb-1">{s.name || 'Без имени'}</h3>
                <p className="text-gray-600 text-xs font-mono mb-3">{s.email}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {s.group_name && (
                    <span className="px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase tracking-widest">{s.group_name}</span>
                  )}
                  {s.course && (
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest">{s.course} курс</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)} className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md" />
            <motion.div key="md" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[201] flex items-center justify-center p-6 pointer-events-none">
              <div className="pointer-events-auto w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 relative">
                <button onClick={() => setSelected(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                  <X size={18} />
                </button>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <User size={28} className="text-gray-400" />
                </div>
                <p className="text-red-600 font-mono text-xs tracking-widest mb-2">Student</p>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">{selected.name}</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Email', value: selected.email },
                    { label: 'Группа', value: selected.group_name || '—' },
                    { label: 'Курс', value: selected.course ? selected.course + ' курс' : '—' },
                    { label: 'Добавлен', value: new Date(selected.created_at).toLocaleDateString('ru-RU') },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{row.label}</span>
                      <span className="text-sm font-mono text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DarkLayout>
  );
}