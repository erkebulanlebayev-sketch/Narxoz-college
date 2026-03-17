'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Users, Search } from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject?: string;
  created_at: string;
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTeachers();
    const channel = supabase
      .channel('admin-teachers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teachers' }, loadTeachers)
      .subscribe();
    const interval = setInterval(loadTeachers, 10000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, []);

  async function loadTeachers() {
    try {
      const { data } = await supabase.from('teachers').select('*').order('name');
      setTeachers(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    (t.subject || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DarkLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Преподаватели <span className="text-red-600">Колледжа</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">Всего: {teachers.length}</p>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input type="text" placeholder="Поиск по имени, email или предмету..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold uppercase text-sm tracking-widest">Преподаватели не найдены</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((teacher, i) => (
              <motion.div key={teacher.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center font-black text-red-500 text-sm flex-shrink-0">
                  {teacher.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black italic uppercase text-sm tracking-tight truncate">{teacher.name}</p>
                  <p className="text-gray-500 text-xs font-mono truncate">{teacher.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {teacher.subject && (
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {teacher.subject}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-gray-600 hidden sm:block">
                    {new Date(teacher.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DarkLayout>
  );
}
