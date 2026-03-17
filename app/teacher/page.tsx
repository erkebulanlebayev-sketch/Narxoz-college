'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Calendar, BarChart2, Users, FileText, Newspaper, User, ArrowUpRight } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

export default function TeacherDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({ classes: 0, groups: 0, materials: 0, grades: 0 });
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [recentGrades, setRecentGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const user = await getCurrentUser();
      const name = user?.user_metadata?.name || 'Преподаватель';
      setUserName(name);

      const { data: teacherData } = await supabase.from('teachers').select('id').eq('email', user?.email).single();

      if (teacherData) {
        const [scheduleData, gradesData, materialsData] = await Promise.all([
          supabase.from('schedule').select('*', { count: 'exact' }).eq('teacher_id', teacherData.id),
          supabase.from('grades').select('*', { count: 'exact' }),
          supabase.from('materials').select('*', { count: 'exact' }),
        ]);
        const today = new Date().getDay();
        const { data: todaySchedule } = await supabase.from('schedule').select('*').eq('teacher_id', teacherData.id).eq('day', today === 0 ? 6 : today - 1).order('start_time');
        const { data: grades } = await supabase.from('grades').select('*').order('created_at', { ascending: false }).limit(5);
        setStats({ classes: scheduleData.count || 0, groups: new Set(scheduleData.data?.map((s: any) => s.group_name)).size, materials: materialsData.count || 0, grades: gradesData.count || 0 });
        setTodayClasses(todaySchedule || []);
        setRecentGrades(grades || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const statCards = [
    { label: 'Занятий', value: stats.classes, icon: Calendar, id: '01' },
    { label: 'Групп', value: stats.groups, icon: Users, id: '02' },
    { label: 'Материалов', value: stats.materials, icon: FileText, id: '03' },
    { label: 'Оценок', value: stats.grades, icon: BarChart2, id: '04' },
  ];

  const quickActions = [
    { label: 'Расписание', href: '/teacher/schedule', icon: Calendar, desc: 'Мои занятия' },
    { label: 'Оценки', href: '/teacher/grades', icon: BarChart2, desc: 'Журнал' },
    { label: 'Студенты', href: '/teacher/students', icon: Users, desc: 'Группы' },
    { label: 'Материалы', href: '/teacher/materials', icon: FileText, desc: 'Файлы' },
    { label: 'Новости', href: '/teacher/news', icon: Newspaper, desc: 'Объявления' },
    { label: 'Профиль', href: '/teacher/profile', icon: User, desc: 'Мой профиль' },
  ];

  if (loading) return (
    <DarkLayout role="teacher">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </DarkLayout>
  );

  return (
    <DarkLayout role="teacher">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-8">

        <motion.div variants={stagger.item} className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Teacher Portal</p>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            Добро пожаловать, <span className="text-white/20">{userName}</span>
          </h1>
        </motion.div>

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

        <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Сегодня</p>
              <button onClick={() => router.push('/teacher/schedule')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Все <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="space-y-3">
              {todayClasses.length > 0 ? todayClasses.map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-white">{c.subject}</p>
                    <span className="text-[9px] font-mono text-red-500 border border-red-600/20 px-2 py-0.5 rounded-full">{c.room}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">Группа: {c.group_name}</p>
                  <p className="text-[11px] text-gray-600 font-mono">{c.start_time} — {c.end_time}</p>
                </div>
              )) : <p className="text-gray-700 text-sm text-center py-6">Сегодня занятий нет</p>}
            </div>
          </div>

          <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Последние оценки</p>
              <button onClick={() => router.push('/teacher/grades')} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Все <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="space-y-3">
              {recentGrades.length > 0 ? recentGrades.map((g) => (
                <div key={g.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-white">{g.student_name}</p>
                    <p className="text-[11px] text-gray-600">{g.subject}</p>
                  </div>
                  <span className={`text-lg font-black italic ${g.grade >= 70 ? 'text-green-500' : g.grade >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{g.grade}</span>
                </div>
              )) : <p className="text-gray-700 text-sm text-center py-6">Оценок пока нет</p>}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </DarkLayout>
  );
}
