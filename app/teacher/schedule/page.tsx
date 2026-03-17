'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

interface Schedule {
  id: number;
  day: number;
  start_time: string;
  end_time: string;
  subject: string;
  group_name: string;
  room: string;
}

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

function isCurrentLesson(startTime: string, endTime: string) {
  const now = new Date();
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= sh * 60 + sm && cur <= eh * 60 + em;
}

export default function TeacherSchedulePage() {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  useEffect(() => {
    loadSchedule();
    const channel = supabase
      .channel('teacher-schedule-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule' }, loadSchedule)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function loadSchedule() {
    try {
      const user = await getCurrentUser();
      const { data: teacherData } = await supabase
        .from('teachers').select('id').eq('email', user?.email).single();
      if (!teacherData) { setLoading(false); return; }
      const { data } = await supabase
        .from('schedule').select('*')
        .eq('teacher_id', teacherData.id)
        .order('day').order('start_time');
      setSchedule(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const daySchedule = schedule.filter(s => s.day === activeDay);
  const activeDays = days.map((_, i) => schedule.some(s => s.day === i));

  return (
    <DarkLayout role="teacher">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Моё <span className="text-red-600">Расписание</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">{schedule.length} занятий на неделе</p>
        </div>

        {/* Day tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                activeDay === i
                  ? 'bg-red-600/10 border-red-600/30 text-red-500'
                  : activeDays[i]
                  ? 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                  : 'border-white/5 text-gray-700 cursor-default'
              }`}
            >
              {day.slice(0, 2)}
              {i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) && (
                <span className="ml-1 text-red-500">•</span>
              )}
            </button>
          ))}
        </div>

        {/* Schedule list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : daySchedule.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold uppercase text-sm tracking-widest">Нет занятий</p>
          </div>
        ) : (
          <div className="space-y-3">
            {daySchedule.map((item, i) => {
              const live = isCurrentLesson(item.start_time, item.end_time);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`p-5 rounded-2xl border transition-all ${
                    live
                      ? 'bg-red-600/10 border-red-600/30'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm font-bold text-white">
                          {item.start_time}
                        </span>
                        <span className="text-gray-600 text-xs">→</span>
                        <span className="font-mono text-sm text-gray-400">{item.end_time}</span>
                        {live && (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Live
                          </span>
                        )}
                      </div>
                      <h3 className="font-black italic uppercase text-lg tracking-tight">{item.subject}</h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-mono">
                        <span className="flex items-center gap-1"><Users size={11} />{item.group_name}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} />Ауд. {item.room}</span>
                      </div>
                    </div>
                    <div className={`w-1 h-16 rounded-full ${live ? 'bg-red-600' : 'bg-white/5'}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </DarkLayout>
  );
}
