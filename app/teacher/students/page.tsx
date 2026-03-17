'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Search, QrCode } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
};

const GROUPS = ['all', 'ИС-21-1', 'ИС-21-2', 'ИС-22-1', 'ИС-22-2', 'ИС-23-1', 'ИС-23-2'];

function StudentCard({ s }: { s: any }) {
  const gpa = s.gpa || 0;
  const gpaColor = gpa >= 3.5 ? 'text-green-400' : gpa >= 2.5 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="group relative rounded-[20px] bg-white/[0.02] border border-white/5 hover:border-red-600/20 hover:shadow-[0_0_20px_rgba(220,38,38,0.06)] transition-all p-5 overflow-hidden">
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-600/10 transition-all" />
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black italic text-white/30 shrink-0">
          {s.name?.charAt(0) || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black italic uppercase tracking-tighter text-white truncate">{s.name}</p>
          <p className="text-[10px] text-gray-600 mt-0.5 font-mono">{s.group_name}</p>
          {s.email && <p className="text-[9px] text-gray-700 mt-1 truncate">{s.email}</p>}
        </div>
        <div className="text-right shrink-0">
          <span className={`text-xl font-black italic ${gpaColor}`}>{gpa.toFixed(1)}</span>
          <p className="text-[9px] text-gray-700 font-mono">GPA</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex gap-2">
          {['Лекции', 'СРСП', 'СРС'].map(t => (
            <span key={t} className="text-[8px] font-bold uppercase tracking-widest text-gray-700 border border-white/5 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
        <QrCode size={14} className="text-gray-700 group-hover:text-red-500 transition-colors" />
      </div>
    </div>
  );
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');

  useEffect(() => { loadStudents(); }, []);

  async function loadStudents() {
    const { data } = await supabase.from('students').select('*').order('name');
    setStudents(data || []);
    setLoading(false);
  }

  const filtered = students.filter(s =>
    (group === 'all' || s.group_name === group) &&
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const groups = ['all', ...Array.from(new Set(students.map((s: any) => s.group_name).filter(Boolean)))];

  return (
    <DarkLayout role="teacher">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-8">

        <motion.div variants={stagger.item} className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Teacher Portal</p>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            Студенты <span className="text-white/20">/ группы</span>
          </h1>
        </motion.div>

        {/* Filters */}
        <motion.div variants={stagger.item} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск студента..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors" />
          </div>
          <select value={group} onChange={e => setGroup(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-red-600/50 transition-colors">
            {groups.map(g => <option key={g} value={g} className="bg-[#111]">{g === 'all' ? 'Все группы' : g}</option>)}
          </select>
        </motion.div>

        {/* Count */}
        <motion.div variants={stagger.item}>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-4">
            {filtered.length} студент{filtered.length === 1 ? '' : filtered.length < 5 ? 'а' : 'ов'}
          </p>

          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <motion.div variants={stagger.container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(s => (
                <motion.div key={s.id} variants={stagger.item}>
                  <StudentCard s={s} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20"><p className="text-gray-700 font-bold uppercase tracking-widest text-sm">Студентов не найдено</p></div>
          )}
        </motion.div>

      </motion.div>
    </DarkLayout>
  );
}
