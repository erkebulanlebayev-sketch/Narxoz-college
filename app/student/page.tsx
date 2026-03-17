'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { BarChart2, BookOpen, Newspaper, ShoppingBag, Calendar, ArrowUpRight, Library, ArrowLeftRight, QrCode, Clock } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

function ProgressRing({ value, max, label, color = '#dc2626' }: { value: number; max: number; label: string; color?: string }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
          <motion.circle
            cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeLinecap="round" strokeDasharray={circ}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct) }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black italic tracking-tighter">{value}</span>
        </div>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">{label}</span>
    </div>
  );
}

function DigitalIDCard({ name, group, email, id }: { name: string; group: string; email: string; id: string }) {
  return (
    <div className="relative rounded-[24px] overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-6 h-full">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-red-500 mb-1">Narxoz College</p>
          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600">Digital Student ID</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center shadow-[0_0_12px_rgba(220,38,38,0.2)]">
          <QrCode size={16} className="text-red-500" />
        </div>
      </div>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black italic text-white/40 shadow-inner">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-base font-black italic uppercase tracking-tighter leading-tight">{name}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{group || 'Без группы'}</p>
        </div>
      </div>
      <div className="pt-4 border-t border-white/5 space-y-1">
        <p className="text-[9px] font-mono text-gray-700 truncate">{email}</p>
        <p className="text-[9px] font-mono text-gray-800">ID · {id.slice(0, 8).toUpperCase()}</p>
      </div>
    </div>
  );
}

function ScheduleTimeline({ classes }: { classes: any[] }) {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const toMin = (t: string) => { const [h, m] = (t || '0:0').split(':').map(Number); return h * 60 + m; };

  return (
    <div className="space-y-2">
      {classes.length === 0 && <p className="text-gray-700 text-sm text-center py-8 font-mono">// no classes today</p>}
      {classes.map((c, i) => {
        const active = cur >= toMin(c.start_time) && cur <= toMin(c.end_time);
        return (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`relative flex gap-4 p-4 rounded-xl border transition-all ${
              active
                ? 'bg-red-600/10 border-red-600/30 shadow-[0_0_20px_rgba(220,38,38,0.12)]'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
            }`}
          >
            {active && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />}
            <div className="flex flex-col items-center min-w-[44px]">
              <span className={`text-[10px] font-mono font-bold ${active ? 'text-red-400' : 'text-gray-600'}`}>{c.start_time}</span>
              <div className="flex-1 w-px bg-white/5 my-1" />
              <span className="text-[9px] font-mono text-gray-700">{c.end_time}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {active && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_4px_rgba(220,38,38,0.8)]" />}
                <p className={`text-sm font-black italic uppercase tracking-tighter truncate ${active ? 'text-white' : 'text-white/70'}`}>{c.subject}</p>
              </div>
              <p className="text-[10px] text-gray-600 font-mono">{c.teacher_name || '—'}</p>
            </div>
            <span className={`text-[9px] font-mono px-2 py-1 rounded-lg border self-start flex-shrink-0 ${
              active ? 'text-red-400 border-red-600/30 bg-red-600/10' : 'text-gray-600 border-white/5'
            }`}>{c.room}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ gpa: 0, attendance: 85, courses: 0, materials: 0 });
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const u = await getCurrentUser();
      setUser(u);
      const name = u?.user_metadata?.name || '';
      const group = u?.user_metadata?.group || '';
      const today = new Date().getDay();
      const dayMap: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };

      const [newsData, materialsData, gradesData, scheduleData] = await Promise.all([
        supabase.from('news').select('*').eq('published', true).order('created_at', { ascending: false }).limit(3),
        supabase.from('materials').select('*', { count: 'exact' }),
        supabase.from('grades').select('grade').eq('student_name', name),
        supabase.from('schedule').select('*').eq('group_name', group).eq('day', dayMap[today] ?? 0).order('start_time'),
      ]);

      const grades = gradesData.data || [];
      const avg = grades.length > 0 ? grades.reduce((s: number, g: any) => s + g.grade, 0) / grades.length : 0;
      setStats({ gpa: parseFloat((avg / 25).toFixed(1)), attendance: 85, courses: scheduleData.data?.length || 0, materials: materialsData.count || 0 });
      setRecentNews(newsData.data || []);
      setTodayClasses(scheduleData.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const quickActions = [
    { label: 'Расписание', href: '/student/schedule', icon: Calendar },
    { label: 'Оценки', href: '/student/grades', icon: BarChart2 },
    { label: 'Новости', href: '/student/news', icon: Newspaper },
    { label: 'Магазин', href: '/student/shop', icon: ShoppingBag },
    { label: 'Библиотека', href: '/student/library', icon: Library },
    { label: 'Материалы', href: '/student/exchange', icon: ArrowLeftRight },
  ];

  if (loading) return (
    <DarkLayout role="student">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </DarkLayout>
  );

  return (
    <DarkLayout role="student">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-10">

        {/* Header */}
        <motion.div variants={stagger.item} className="relative border-b border-white/5 pb-8 overflow-hidden">
          <div className="absolute -bottom-16 -right-10 w-56 h-56 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
          <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
            Student Portal
          </p>
          <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
            Привет,<br /><span className="text-white/10">{user?.user_metadata?.name || 'Студент'}</span>
          </h1>
        </motion.div>

        {/* ID Card + Progress rings */}
        <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1">
            <DigitalIDCard
              name={user?.user_metadata?.name || 'Студент'}
              group={user?.user_metadata?.group || ''}
              email={user?.email || ''}
              id={user?.id || ''}
            />
          </div>
          <motion.div
            whileHover={{ borderColor: 'rgba(220,38,38,0.2)' }}
            className="lg:col-span-2 rounded-[24px] bg-white/[0.02] border border-white/5 p-6 flex flex-col"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-6">Успеваемость</p>
            <div className="flex items-center justify-around flex-1 py-2">
              <ProgressRing value={stats.gpa} max={4} label="GPA" color="#dc2626" />
              <ProgressRing value={stats.attendance} max={100} label="Посещ. %" color="#22c55e" />
              <ProgressRing value={stats.courses} max={10} label="Курсов" color="#3b82f6" />
              <ProgressRing value={stats.materials} max={50} label="Файлов" color="#a855f7" />
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={stagger.item}>
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-4">Быстрый доступ</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <motion.button key={a.href}
                  whileHover={{ scale: 1.04, borderColor: 'rgba(220,38,38,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(a.href)}
                  className="group p-4 rounded-[18px] bg-white/[0.02] border border-white/5 hover:shadow-[0_0_20px_rgba(220,38,38,0.08)] transition-shadow text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.03] group-hover:bg-red-600/10 group-hover:border-red-600/20 group-hover:shadow-[0_0_10px_rgba(220,38,38,0.2)] border border-white/5 flex items-center justify-center mb-2.5 transition-all">
                    <Icon size={14} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                  </div>
                  <p className="text-[9px] font-black italic uppercase tracking-tighter text-gray-400 group-hover:text-white transition-colors">{a.label}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Schedule + News */}
        <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div whileHover={{ borderColor: 'rgba(220,38,38,0.15)' }} className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center shadow-[0_0_8px_rgba(220,38,38,0.2)]">
                  <Clock size={12} className="text-red-500" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Сегодня</p>
              </div>
              <button onClick={() => router.push('/student/schedule')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Все <ArrowUpRight size={10} />
              </button>
            </div>
            <ScheduleTimeline classes={todayClasses} />
          </motion.div>

          <motion.div whileHover={{ borderColor: 'rgba(255,255,255,0.08)' }} className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center">
                  <Newspaper size={12} className="text-gray-500" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Новости</p>
              </div>
              <button onClick={() => router.push('/student/news')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Все <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="space-y-3">
              {recentNews.length > 0 ? recentNews.map((n, i) => (
                <motion.div key={n.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                  onClick={() => router.push('/student/news')}
                >
                  <p className="text-[11px] font-black italic uppercase tracking-tight text-white mb-1 line-clamp-1">{n.title}</p>
                  <p className="text-[10px] text-gray-600 line-clamp-2 font-mono">{n.content}</p>
                  <p className="text-[9px] text-gray-700 mt-2 font-mono">{new Date(n.created_at).toLocaleDateString('ru-RU')}</p>
                </motion.div>
              )) : <p className="text-gray-700 text-sm text-center py-8 font-mono">// no news yet</p>}
            </div>
          </motion.div>
        </motion.div>

      </motion.div>
    </DarkLayout>
  );
}
