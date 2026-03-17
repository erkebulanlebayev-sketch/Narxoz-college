'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { GraduationCap, Users, Newspaper, Calendar, ShoppingBag, Settings, ShieldCheck, ArrowUpRight } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ students: 0, teachers: 0, news: 0, schedule: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const [s, t, n, sc] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact' }),
        supabase.from('teachers').select('*', { count: 'exact' }),
        supabase.from('news').select('*', { count: 'exact' }),
        supabase.from('schedule').select('*', { count: 'exact' }),
      ]);
      setStats({ students: s.count || 0, teachers: t.count || 0, news: n.count || 0, schedule: sc.count || 0 });
      const { data: news } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(5);
      setRecentActivity(news || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const statCards = [
    { label: 'Студентов', value: stats.students, icon: GraduationCap, id: '01' },
    { label: 'Преподавателей', value: stats.teachers, icon: Users, id: '02' },
    { label: 'Новостей', value: stats.news, icon: Newspaper, id: '03' },
    { label: 'Занятий', value: stats.schedule, icon: Calendar, id: '04' },
  ];

  const quickActions = [
    { label: 'Новости', href: '/admin/news', icon: Newspaper, desc: 'Управление' },
    { label: 'Расписание', href: '/admin/schedule', icon: Calendar, desc: 'Создать' },
    { label: 'Студенты', href: '/admin/students', icon: GraduationCap, desc: 'Список' },
    { label: 'Преподаватели', href: '/admin/teachers', icon: Users, desc: 'Список' },
    { label: 'Магазин', href: '/admin/shop', icon: ShoppingBag, desc: 'Товары' },
    { label: 'Пользователи', href: '/admin/users', icon: ShieldCheck, desc: 'Контроль' },
    { label: 'Настройки', href: '/admin/settings', icon: Settings, desc: 'Система' },
  ];

  if (loading) return (
    <DarkLayout role="admin">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </DarkLayout>
  );

  return (
    <DarkLayout role="admin">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-8">

        <motion.div variants={stagger.item} className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Admin Portal</p>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            System <span className="text-white/20">Control</span>
          </h1>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger.item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="p-6 rounded-[20px] bg-white/[0.02] border border-white/5 hover:border-red-600/20 transition-all group">
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
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-4">Управление</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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

        {/* Activity */}
        <motion.div variants={stagger.item} className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Последняя активность</p>
            <button onClick={() => router.push('/admin/news')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
              Все <ArrowUpRight size={10} />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.length > 0 ? recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{item.title}</p>
                  <p className="text-[9px] font-mono text-gray-600 mt-1">{new Date(item.created_at).toLocaleString('ru-RU')}</p>
                </div>
                <span className={`ml-4 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${item.published ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}`}>
                  {item.published ? 'Live' : 'Draft'}
                </span>
              </div>
            )) : <p className="text-gray-700 text-sm text-center py-6">Активности пока нет</p>}
          </div>
        </motion.div>

      </motion.div>
    </DarkLayout>
  );
}
