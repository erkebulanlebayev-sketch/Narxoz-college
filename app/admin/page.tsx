'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { GraduationCap, Users, Newspaper, Calendar, ShoppingBag, Settings, ShieldCheck, ArrowUpRight, Bell, TrendingUp, Activity, BarChart2 } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

// Animated bar chart
function BarChart({ data, label }: { data: { label: string; value: number; max: number }[]; label: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-4">{label}</p>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{d.label}</span>
              <span className="text-[10px] font-mono text-gray-600">{d.value}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(d.value / d.max) * 100}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Broadcast tool
function BroadcastTool() {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  function send() {
    if (!msg.trim()) return;
    setSent(true);
    setMsg('');
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={14} className="text-red-500" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Рассылка уведомлений</p>
      </div>
      {sent ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="py-6 text-center">
          <p className="text-green-500 font-black italic uppercase tracking-tighter">Отправлено всем ✓</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3}
            placeholder="Введите сообщение для всего колледжа..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors resize-none" />
          <div className="flex gap-2">
            {['Студентам', 'Преподавателям', 'Всем'].map(t => (
              <button key={t} className="px-3 py-1.5 rounded-lg border border-white/5 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:border-red-600/30 hover:text-red-500 transition-all">
                {t}
              </button>
            ))}
            <button onClick={send} disabled={!msg.trim()}
              className="ml-auto px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-30 text-white text-[9px] font-black italic uppercase tracking-tighter transition-colors">
              Отправить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

  const analyticsData = {
    load: [
      { label: 'Студенты', value: stats.students, max: Math.max(stats.students, 100) },
      { label: 'Преподаватели', value: stats.teachers, max: Math.max(stats.teachers, 50) },
      { label: 'Занятий', value: stats.schedule, max: Math.max(stats.schedule, 200) },
    ],
    performance: [
      { label: 'Отлично (90+)', value: 42, max: 100 },
      { label: 'Хорошо (70-89)', value: 31, max: 100 },
      { label: 'Удовл. (50-69)', value: 18, max: 100 },
      { label: 'Неудовл.', value: 9, max: 100 },
    ],
    activity: [
      { label: 'Активных сегодня', value: 78, max: 100 },
      { label: 'Новых материалов', value: 12, max: 50 },
      { label: 'Новостей за неделю', value: stats.news, max: Math.max(stats.news, 20) },
    ],
  };

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
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button key={a.href} onClick={() => router.push(a.href)}
                  className="group p-4 rounded-[20px] bg-white/[0.02] border border-white/5 hover:border-red-600/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.08)] transition-all text-left">
                  <Icon size={18} className="text-gray-600 group-hover:text-red-500 transition-colors mb-2" />
                  <p className="text-[9px] font-black italic uppercase tracking-tighter">{a.label}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Analytics */}
        <motion.div variants={stagger.item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-red-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-500">Live</span>
            </div>
            <BarChart data={analyticsData.load} label="Нагрузка колледжа" />
          </div>
          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 size={14} className="text-blue-500" />
            </div>
            <BarChart data={analyticsData.performance} label="Успеваемость студентов %" />
          </div>
          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={14} className="text-green-500" />
            </div>
            <BarChart data={analyticsData.activity} label="Активность персонала" />
          </div>
        </motion.div>

        {/* Broadcast + Activity */}
        <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BroadcastTool />

          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Последняя активность</p>
              <button onClick={() => router.push('/admin/news')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Все <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="space-y-2">
              {recentActivity.length > 0 ? recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                    <p className="text-[9px] font-mono text-gray-600 mt-0.5">{new Date(item.created_at).toLocaleString('ru-RU')}</p>
                  </div>
                  <span className={`ml-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${item.published ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}`}>
                    {item.published ? 'Live' : 'Draft'}
                  </span>
                </div>
              )) : <p className="text-gray-700 text-sm text-center py-6">Активности пока нет</p>}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </DarkLayout>
  );
}
