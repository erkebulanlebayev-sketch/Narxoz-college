'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { BarChart2, BookOpen, Newspaper, ShoppingBag, Calendar, ArrowUpRight, Library, ArrowLeftRight } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

export default function StudentDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({ gpa: 0, courses: 0, news: 0, materials: 0 });
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const user = await getCurrentUser();
      const name = user?.user_metadata?.name || 'Студент';
      const group = user?.user_metadata?.group || '';
      setUserName(name);

      const [newsData, materialsData, gradesData, scheduleData] = await Promise.all([
        supabase.from('news').select('*', { count: 'exact' }).eq('published', true),
        supabase.from('materials').select('*', { count: 'exact' }),
        supabase.from('grades').select('grade').eq('student_name', name),
        supabase.from('schedule').select('*').eq('group_name', group).limit(3),
      ]);

      const grades = gradesData.data || [];
      const avg = grades.length > 0 ? grades.reduce((s, g) => s + g.grade, 0) / grades.length : 0;
      setStats({ gpa: parseFloat((avg / 100 * 4).toFixed(2)), courses: scheduleData.data?.length || 0, news: newsData.count || 0, materials: materialsData.count || 0 });

      const { data: news } = await supabase.from('news').select('*').eq('published', true).order('created_at', { ascending: false }).limit(3);
      setRecentNews(news || []);
      setUpcomingClasses(scheduleData.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const statCards = [
    { label: 'GPA', value: stats.gpa, icon: BarChart2, id: '01' },
    { label: 'Курсов', value: stats.courses, icon: BookOpen, id: '02' },
    { label: 'Новостей', value: stats.news, icon: Newspaper, id: '03' },
    { label: 'Материалов', value: stats.materials, icon: Library, id: '04' },
  ];

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
            Привет, <span className="text-white/20">{userName}</span>
          </h1>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger.item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="p-6 rounded-[20px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <Icon size={18} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                  <span className="text-[9px] font-mono text-gray-700">{s.id}</span>
                </div>
                <div className="text-3xl font-black italic tracking-tighter">{s.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-1">{s.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={stagger.item}>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-4">Быстрый доступ</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button key={a.href} onClick={() => router.push(a.href)}
                  className="group p-5 rounded-[20px] bg-white/[0.02] border border-white/5 hover:border-red-600/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.08)] transition-all text-left">
                  <Icon size={20} className="text-gray-600 group-hover:text-red-500 transition-colors mb-3" />
                  <p className="text-xs font-black italic uppercase tracking-tighter">{a.label}</p>
                  <p className="text-[9px] text-gray-600 mt-0.5">{a.desc}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* News + Schedule */}
        <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* News */}
          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Последние новости</p>
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

          {/* Schedule */}
          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Ближайшие занятия</p>
              <button onClick={() => router.push('/student/schedule')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Все <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="space-y-3">
              {upcomingClasses.length > 0 ? upcomingClasses.map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-white">{c.subject}</p>
                    <span className="text-[9px] font-mono text-red-500 border border-red-600/20 px-2 py-0.5 rounded-full">{c.room}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1 font-mono">{c.start_time} — {c.end_time}</p>
                </div>
              )) : <p className="text-gray-700 text-sm text-center py-6">Занятий пока нет</p>}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </DarkLayout>
  );
}
