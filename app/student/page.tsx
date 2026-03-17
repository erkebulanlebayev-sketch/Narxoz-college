'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { BarChart2, BookOpen, Newspaper, ShoppingBag, Calendar, ArrowUpRight, Library, ArrowLeftRight, QrCode, Clock } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

// Progress Ring SVG
function ProgressRing({ value, max, label, color = '#dc2626' }: { value: number; max: number; label: string; color?: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <motion.circle
            cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black italic tracking-tighter">{value}</span>
        </div>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
    </div>
  );
}

// Digital ID Card
function DigitalIDCard({ name, group, email, id }: { name: string; group: string; email: string; id: string }) {
  return (
    <div className="relative rounded-[24px] overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl p-6">
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-red-500 mb-1">Narxoz College</p>
          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600">Student ID</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center">
          <QrCode size={16} className="text-red-500" />
        </div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black italic text-white/30">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-base font-black italic uppercase tracking-tighter leading-tight">{name}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">{group || 'Без группы'}</p>
        </div>
      </div>
      <div className="pt-4 border-t border-white/5">
        <p className="text-[9px] font-mono text-gray-700 truncate">{email}</p>
        <p className="text-[9px] font-mono text-gray-800 mt-1">ID: {id.slice(0, 8).toUpperCase()}</p>
      </div>
    </div>
  );
}

// Schedule Timeline
function ScheduleTimeline({ classes }: { classes: any[] }) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  function timeToMin(t: string) {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  function isActive(start: string, end: string) {
    const s = timeToMin(start), e = timeToMin(end);
    return currentTime >= s && currentTime <= e;
  }

  return (
    <div className="space-y-2">
      {classes.length === 0 && <p className="text-gray-700 text-sm text-center py-6">Занятий нет</p>}
      {classes.map((c, i) => {
        const active = isActive(c.start_time, c.end_time);
        return (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative flex gap-4 p-4 rounded-xl border transition-all ${
              active ? 'bg-red-600/10 border-red-600/30 shadow-[0_0_20px_rgba(220,38,38,0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
            }`}
          >
            {active && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-600 rounded-full" />}
            <div className="flex flex-col items-center min-w-[48px]">
              <span className={`text-[10px] font-mono font-bold ${active ? 'text-red-400' : 'text-gray-600'}`}>{c.start_time}</span>
              <div className="flex-1 w-px bg-white/5 my-1" />
              <span className="text-[9px] font-mono text-gray-700">{c.end_time}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {active && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                <p className={`text-sm font-black italic uppercase tracking-tighter truncate ${active ? 'text-white' : 'text-white/80'}`}>{c.subject}</p>
              </div>
              <p className="text-[10px] text-gray-600">{c.teacher_name || 'Преподаватель'}</p>
            </div>
            <span className={`text-[9px] font-mono px-2 py-1 rounded-lg border self-start ${active ? 'text-red-400 border-red-600/30 bg-red-600/10' : 'text-gray-600 border-white/5'}`}>
              {c.room}
            </span>
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
      const name = u?.user_metadata?.name || 'Студент';
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
    { label: 'Расписание', href: '/student/schedule', icon: Calendar, desc: 'Мои занятия' },
    { label: 'Оценки', href: '/student/grades', icon: BarChart2, desc: 'Успеваемость' },
    { label: 'Новости', href: '/student/news', icon: Newspaper, desc: 'Объявления' },
    { label: 'Магазин', href: '/student/shop', icon: ShoppingBag, desc: 'Бонусы' },
    { label: 'Библиотека', href: '/student/library', icon: Library, desc: 'Книги' },
    { label: 'Материалы', href: '/student/exchange', icon: ArrowLeftRight, desc: 'Файлы' },
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
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-8">

        {/* Header */}
        <motion.div variants={stagger.item} className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Student Portal</p>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            Привет, <span className="text-white/20">{user?.user_metadata?.name || 'Студент'}</span>
          </h1>
        </motion.div>

        {/* ID Card + Progress */}
        <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DigitalIDCard
              name={user?.user_metadata?.name || 'Студент'}
              group={user?.user_metadata?.group || ''}
              email={user?.email || ''}
              id={user?.id || ''}
            />
          </div>
          <div className="lg:col-span-2 rounded-[24px] bg-white/[0.02] border border-white/5 p-6 flex flex-col justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-6">Успеваемость</p>
            <div className="flex items-center justify-around flex-1">
              <ProgressRing value={stats.gpa} max={4} label="GPA" color="#dc2626" />
              <ProgressRing value={stats.attendance} max={100} label="Посещ. %" color="#22c55e" />
              <ProgressRing value={stats.courses} max={10} label="Курсов" color="#3b82f6" />
              <ProgressRing value={stats.materials} max={50} label="Материалов" color="#a855f7" />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={stagger.item}>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-4">Быстрый доступ</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button key={a.href} onClick={() => router.push(a.href)}
                  className="group p-4 rounded-[20px] bg-white/[0.02] border border-white/5 hover:border-red-600/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.08)] transition-all text-left">
                  <Icon size={18} className="text-gray-600 group-hover:text-red-500 transition-colors mb-2" />
                  <p className="text-[10px] font-black italic uppercase tracking-tighter">{a.label}</p>
                  <p className="text-[9px] text-gray-700 mt-0.5">{a.desc}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Timeline + News */}
        <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-red-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Сегодня</p>
              </div>
              <button onClick={() => router.push('/student/schedule')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Все <ArrowUpRight size={10} />
              </button>
            </div>
            <ScheduleTimeline classes={todayClasses} />
          </div>

          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Новости</p>
              <button onClick={() => router.push('/student/news')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Все <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="space-y-3">
              {recentNews.length > 0 ? recentNews.map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <p className="text-sm font-bold text-white mb-1 line-clamp-1">{n.title}</p>
                  <p className="text-[11px] text-gray-600 line-clamp-2">{n.content}</p>
                  <p className="text-[9px] text-gray-700 mt-2 font-mono">{new Date(n.created_at).toLocaleDateString('ru-RU')}</p>
                </div>
              )) : <p className="text-gray-700 text-sm text-center py-6">Новостей пока нет</p>}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </DarkLayout>
  );
}
