'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import {
  GraduationCap, Users, Newspaper, Calendar, ShoppingBag,
  Settings, ShieldCheck, ArrowUpRight, Bell, TrendingUp, Activity, BarChart2
} from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

// Neon glow bar chart
function GlowBar({ data, label, color = '#dc2626' }: {
  data: { label: string; value: number; max: number }[];
  label: string;
  color?: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-4">{label}</p>
      <div className="space-y-4">
        {data.map((d, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{d.label}</span>
              <span className="text-[10px] font-mono" style={{ color }}>{d.value}</span>
            </div>
            <div className="h-px bg-white/5 rounded-full overflow-visible relative">
              <motion.div
                className="h-px rounded-full absolute top-0 left-0"
                style={{ background: color, boxShadow: `0 0 8px ${color}, 0 0 20px ${color}40` }}
                initial={{ width: 0 }}
                animate={{ width: `${(d.value / d.max) * 100}%` }}
                transition={{ duration: 1.2, delay: i * 0.12, ease: 'easeOut' }}
              />
              {/* Glow dot at end */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                initial={{ left: 0 }}
                animate={{ left: `${(d.value / d.max) * 100}%` }}
                transition={{ duration: 1.2, delay: i * 0.12, ease: 'easeOut' }}
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
  const [target, setTarget] = useState('Всем');

  function send() {
    if (!msg.trim()) return;
    setSent(true);
    setMsg('');
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-red-600/20 border border-red-600/30 flex items-center justify-center shadow-[0_0_8px_rgba(220,38,38,0.3)]">
          <Bell size={12} className="text-red-500" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Рассылка</p>
      </div>
      {sent ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="py-8 text-center">
          <p className="text-green-400 font-black italic uppercase tracking-tighter text-lg">Отправлено ✓</p>
          <p className="text-gray-600 text-[10px] font-mono mt-1">Уведомление доставлено: {target}</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3}
            placeholder="Введите сообщение для колледжа..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors resize-none font-mono text-[12px]" />
          <div className="flex gap-2 flex-wrap">
            {['Студентам', 'Преподавателям', 'Всем'].map(t => (
              <button key={t} onClick={() => setTarget(t)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border ${
                  target === t
                    ? 'border-red-600/40 text-red-500 bg-red-600/10 shadow-[0_0_10px_rgba(220,38,38,0.15)]'
                    : 'border-white/5 text-gray-600 hover:border-red-600/20 hover:text-red-500'
                }`}>
                {t}
              </button>
            ))}
            <button onClick={send} disabled={!msg.trim()}
              className="ml-auto px-5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-30 text-white text-[9px] font-black italic uppercase tracking-tighter transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              Отправить →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Glowing stat card
function StatCard({ label, value, icon: Icon, id }: { label: string; value: number; icon: any; id: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: 'rgba(220,38,38,0.4)' }}
      transition={{ duration: 0.2 }}
      className="relative p-6 rounded-[20px] bg-white/[0.02] border border-white/5 overflow-hidden group cursor-default"
    >
      {/* Corner glow */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-600/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-between items-start mb-4">
        <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-red-600/20 group-hover:bg-red-600/10 group-hover:shadow-[0_0_12px_rgba(220,38,38,0.2)] flex items-center justify-center transition-all">
          <Icon size={15} className="text-gray-600 group-hover:text-red-500 transition-colors" />
        </div>
        <span className="text-[9px] font-mono text-gray-800">{id}</span>
      </div>
      <div className="text-3xl font-black italic tracking-tighter">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-1">{label}</div>
    </motion.div>
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
    { label: 'Новости', href: '/admin/news', icon: Newspaper },
    { label: 'Расписание', href: '/admin/schedule', icon: Calendar },
    { label: 'Студенты', href: '/admin/students', icon: GraduationCap },
    { label: 'Преподаватели', href: '/admin/teachers', icon: Users },
    { label: 'Магазин', href: '/admin/shop', icon: ShoppingBag },
    { label: 'Пользователи', href: '/admin/users', icon: ShieldCheck },
    { label: 'Настройки', href: '/admin/settings', icon: Settings },
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
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-10">

        {/* Brutalist header */}
        <motion.div variants={stagger.item} className="relative border-b border-white/5 pb-8 overflow-hidden">
          <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
          <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
            Admin Portal · Live
          </p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            System<br /><span className="text-white/10">Control</span>
          </h1>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger.item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(s => <StatCard key={s.id} {...s} />)}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={stagger.item}>
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-4">Управление системой</p>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
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

        {/* Analytics — neon glow bars */}
        <motion.div variants={stagger.item} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { data: analyticsData.load, label: 'Нагрузка колледжа', icon: TrendingUp, color: '#dc2626', badge: 'Live' },
            { data: analyticsData.performance, label: 'Успеваемость %', icon: BarChart2, color: '#3b82f6', badge: null },
            { data: analyticsData.activity, label: 'Активность персонала', icon: Activity, color: '#22c55e', badge: null },
          ].map(({ data, label, icon: Icon, color, badge }, i) => (
            <motion.div key={i}
              whileHover={{ scale: 1.01, borderColor: `${color}40` }}
              transition={{ duration: 0.2 }}
              className="relative rounded-[24px] bg-white/[0.02] border border-white/5 p-6 overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 pointer-events-none" style={{ background: color }} />
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30`, boxShadow: `0 0 8px ${color}30` }}>
                  <Icon size={12} style={{ color }} />
                </div>
                {badge && <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>{badge}</span>}
              </div>
              <GlowBar data={data} label={label} color={color} />
            </motion.div>
          ))}
        </motion.div>

        {/* Broadcast + Activity */}
        <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            whileHover={{ borderColor: 'rgba(220,38,38,0.2)' }}
            className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6"
          >
            <BroadcastTool />
          </motion.div>

          <motion.div
            whileHover={{ borderColor: 'rgba(255,255,255,0.08)' }}
            className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Последняя активность</p>
              <button onClick={() => router.push('/admin/news')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Все <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="space-y-2">
              {recentActivity.length > 0 ? recentActivity.map((item, i) => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                    <p className="text-[9px] font-mono text-gray-600 mt-0.5">{new Date(item.created_at).toLocaleString('ru-RU')}</p>
                  </div>
                  <span className={`ml-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    item.published
                      ? 'text-green-500 border-green-500/20 bg-green-500/5 shadow-[0_0_8px_rgba(34,197,94,0.15)]'
                      : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'
                  }`}>
                    {item.published ? 'Live' : 'Draft'}
                  </span>
                </motion.div>
              )) : <p className="text-gray-700 text-sm text-center py-6">Активности пока нет</p>}
            </div>
          </motion.div>
        </motion.div>

      </motion.div>
    </DarkLayout>
  );
}
