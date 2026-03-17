'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

export default function StudentSchedulePage() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [group, setGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  useEffect(() => {
    loadSchedule();
    const ch = supabase.channel('student-schedule').on('postgres_changes', { event: '*', schema: 'public', table: 'schedule' }, loadSchedule).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function loadSchedule() {
    const user = await getCurrentUser();
    const g = user?.user_metadata?.group || '';
    setGroup(g);
    const { data } = await supabase.from('schedule').select('*').eq('group_name', g).order('day').order('start_time');
    setSchedule(data || []);
    setLoading(false);
  }

  function timeToMin(t: string) {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const todayIdx = now.getDay() === 0 ? 6 : now.getDay() - 1;

  const daysWithClasses = DAYS.map((d, i) => ({ day: d, idx: i, classes: schedule.filter(s => s.day === i) })).filter(d => d.classes.length > 0);

  return (
    <DarkLayout role="student">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-8">

        <motion.div variants={stagger.item} className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Student Portal</p>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            Расписание <span className="text-white/20">{group}</span>
          </h1>
        </motion.div>

        {/* Day tabs */}
        <motion.div variants={stagger.item} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {daysWithClasses.map(d => (
            <button key={d.idx} onClick={() => setActiveDay(d.idx)}
              className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black italic uppercase tracking-tighter transition-all ${
                activeDay === d.idx
                  ? 'bg-red-600 text-white'
                  : 'bg-white/[0.03] border border-white/5 text-gray-500 hover:text-white hover:border-white/10'
              }`}>
              {d.idx === todayIdx && <span className="w-1.5 h-1.5 rounded-full bg-current inline-block mr-1.5 animate-pulse" />}
              {d.day}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <motion.div variants={stagger.container} className="space-y-3">
            {schedule.filter(s => s.day === activeDay).length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-700 font-bold uppercase tracking-widest text-sm">Занятий нет</p>
              </div>
            ) : schedule.filter(s => s.day === activeDay).map((item, i) => {
              const isNow = activeDay === todayIdx && currentMin >= timeToMin(item.start_time) && currentMin <= timeToMin(item.end_time);
              const isPast = activeDay === todayIdx && currentMin > timeToMin(item.end_time);
              return (
                <motion.div key={item.id} variants={stagger.item}
                  className={`relative flex gap-4 p-5 rounded-[20px] border transition-all ${
                    isNow ? 'bg-red-600/10 border-red-600/30 shadow-[0_0_30px_rgba(220,38,38,0.1)]'
                    : isPast ? 'bg-white/[0.01] border-white/[0.03] opacity-50'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}>
                  {isNow && <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-red-600 rounded-full" />}

                  {/* Time */}
                  <div className="flex flex-col items-center min-w-[52px] shrink-0">
                    <span className={`text-[11px] font-mono font-bold ${isNow ? 'text-red-400' : 'text-gray-500'}`}>{item.start_time}</span>
                    <div className="flex-1 w-px bg-white/5 my-1" />
                    <span className="text-[9px] font-mono text-gray-700">{item.end_time}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isNow && (
                        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-red-500 border border-red-600/30 px-2 py-0.5 rounded-full">
                          <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />Live
                        </span>
                      )}
                      <h3 className={`text-sm font-black italic uppercase tracking-tighter truncate ${isNow ? 'text-white' : 'text-white/80'}`}>{item.subject}</h3>
                    </div>
                    {item.teacher_name && <p className="text-[10px] text-gray-600">{item.teacher_name}</p>}
                  </div>

                  {/* Room */}
                  <div className={`shrink-0 self-center px-3 py-1.5 rounded-xl border text-[10px] font-mono ${isNow ? 'text-red-400 border-red-600/30 bg-red-600/10' : 'text-gray-600 border-white/5'}`}>
                    {item.room}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!loading && schedule.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-700 font-bold uppercase tracking-widest text-sm">Расписание не добавлено</p>
          </div>
        )}

      </motion.div>
    </DarkLayout>
  );
}
