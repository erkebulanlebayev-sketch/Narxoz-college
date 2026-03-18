'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Search, Users, QrCode } from 'lucide-react';

function StudentCard({ s }: { s: any }) {
  const gpa = s.gpa || 0;
  const gpaColor = gpa >= 3.5 ? 'text-green-400' : gpa >= 2.5 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="group relative rounded-[20px] bg-white/[0.02] border border-white/5 hover:border-red-600/20 transition-all p-5 overflow-hidden">
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-600/10 transition-all" />
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-black italic text-white/30 shrink-0">
          {s.name?.charAt(0) || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black italic uppercase tracking-tighter text-white truncate">{s.name}</p>
          {s.email && <p className="text-[9px] text-gray-700 mt-0.5 truncate font-mono">{s.email}</p>}
        </div>
        <div className="text-right shrink-0">
          <span className={`text-lg font-black italic ${gpaColor}`}>{gpa.toFixed(1)}</span>
          <p className="text-[9px] text-gray-700 font-mono">GPA</p>
        </div>
      </div>
    </div>
  );
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');

  useEffect(() => {
    loadStudents();
    const interval = setInterval(loadStudents, 15000);
    return () => clearInterval(interval);
  }, []);

  async function loadStudents() {
    const { data } = await supabase.from('students').select('*').order('name');
    setStudents(data || []);
    setLoading(false);
  }

  const groups = Array.from(new Set(students.map((s: any) => s.group_name).filter(Boolean))).sort();

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) &&
    (activeGroup === 'all' || s.group_name === activeGroup)
  );

  // Group students by group_name
  const grouped: Record<string, any[]> = {};
  filtered.forEach(s => {
    const g = s.group_name || 'Без группы';
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(s);
  });
  const groupKeys = Object.keys(grouped).sort();

  return (
    <DarkLayout role="teacher">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

        {/* HEADER */}
        <div className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-3">Teacher Portal</p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Студенты
          </h1>
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-600">
            <span>{students.length} студентов</span>
            <span>{groups.length} групп</span>
          </div>
        </div>

        {/* SEARCH + GROUP FILTER */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск студента..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/40 transition-all" />
          </div>
        </div>

        {/* GROUP TABS */}
        {groups.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setActiveGroup('all')}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                activeGroup === 'all' ? 'bg-red-600 border-red-600 text-white' : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-white'
              }`}>
              Все группы
            </button>
            {groups.map(g => (
              <button key={g} onClick={() => setActiveGroup(g)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  activeGroup === g ? 'bg-red-600 border-red-600 text-white' : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-white'
                }`}>
                {g}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : groupKeys.length === 0 ? (
          <div className="text-center py-32 text-gray-700">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-black italic uppercase text-xl tracking-tighter">Студентов не найдено</p>
          </div>
        ) : (
          <div className="space-y-12">
            {groupKeys.map((groupName, gi) => (
              <motion.div key={groupName}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.08 }}>

                {/* Group header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                      <Users size={14} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">{groupName}</h2>
                  </div>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    {grouped[groupName].length} чел.
                  </span>
                </div>

                {/* Students grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {grouped[groupName].map((s, i) => (
                    <motion.div key={s.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: gi * 0.08 + i * 0.04 }}>
                      <StudentCard s={s} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </motion.div>
    </DarkLayout>
  );
}