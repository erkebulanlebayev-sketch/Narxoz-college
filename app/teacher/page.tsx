'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UniversalLayout from '@/components/UniversalLayout';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function TeacherDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    materials: 0,
    grades: 0
  });
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [recentGrades, setRecentGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const user = await getCurrentUser();
      const name = user?.user_metadata?.name || 'Преподаватель';
      setUserName(name);

      // Получить ID преподавателя
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('id')
        .eq('email', user?.email)
        .single();

      if (teacherData) {
        // Загрузить статистику
        const [scheduleData, gradesData, materialsData] = await Promise.all([
          supabase.from('schedule').select('*', { count: 'exact' }).eq('teacher_id', teacherData.id),
          supabase.from('grades').select('*', { count: 'exact' }),
          supabase.from('materials').select('*', { count: 'exact' })
        ]);

        // Сегодняшние занятия
        const today = new Date().getDay();
        const { data: todaySchedule } = await supabase
          .from('schedule')
          .select('*')
          .eq('teacher_id', teacherData.id)
          .eq('day', today === 0 ? 6 : today - 1)
          .order('start_time');

        // Последние оценки
        const { data: grades } = await supabase
          .from('grades')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          classes: scheduleData.count || 0,
          students: new Set(scheduleData.data?.map(s => s.group_name)).size,
          materials: materialsData.count || 0,
          grades: gradesData.count || 0
        });

        setTodayClasses(todaySchedule || []);
        setRecentGrades(grades || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  }

  const quickActions = [
    { icon: '📅', label: 'Расписание', href: '/teacher/schedule', color: 'from-blue-500 to-cyan-500', desc: 'Мои занятия' },
    { icon: '📊', label: 'Оценки', href: '/teacher/grades', color: 'from-purple-500 to-pink-500', desc: 'Выставить оценки' },
    { icon: '👥', label: 'Студенты', href: '/teacher/students', color: 'from-green-500 to-emerald-500', desc: 'Список студентов' },
    { icon: '📁', label: 'Материалы', href: '/teacher/materials', color: 'from-orange-500 to-red-500', desc: 'Загрузить материалы' },
    { icon: '📰', label: 'Новости', href: '/teacher/news', color: 'from-pink-500 to-rose-500', desc: 'Просмотр новостей' },
    { icon: '👤', label: 'Профиль', href: '/teacher/profile', color: 'from-indigo-500 to-purple-500', desc: 'Мой профиль' }
  ];

  if (loading) {
    return (
      <UniversalLayout role="teacher">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Загрузка...</p>
          </div>
        </div>
      </UniversalLayout>
    );
  }

  return (
    <UniversalLayout role="teacher">
      <div className="container-modern animate-fade-in">
        {/* Приветствие */}
        <div className="modern-card-gradient p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Добро пожаловать, {userName}! 👨‍🏫
              </h1>
              <p className="text-gray-600 text-lg">
                Панель преподавателя
              </p>
            </div>
            <div className="hidden md:block text-6xl">📚</div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
              📅
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.classes}</div>
              <div className="stat-label">Занятий</div>
            </div>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-500">
              👥
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.students}</div>
              <div className="stat-label">Групп</div>
            </div>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="stat-icon bg-gradient-to-br from-orange-500 to-red-500">
              📁
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.materials}</div>
              <div className="stat-label">Материалов</div>
            </div>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
              📊
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.grades}</div>
              <div className="stat-label">Оценок</div>
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={action.href}
                onClick={() => router.push(action.href)}
                className="modern-card p-6 text-left hover:scale-105 transition-transform animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {action.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{action.label}</h3>
                <p className="text-sm text-gray-600">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Сегодняшние занятия */}
          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📅 Сегодня</h2>
              <button
                onClick={() => router.push('/teacher/schedule')}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                Все занятия →
              </button>
            </div>
            <div className="space-y-4">
              {todayClasses.length > 0 ? (
                todayClasses.map((cls, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{cls.subject}</h3>
                      <span className="badge-modern-info">{cls.room}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Группа: {cls.group_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {cls.start_time} - {cls.end_time}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">Сегодня занятий нет</p>
              )}
            </div>
          </div>

          {/* Последние оценки */}
          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📊 Последние оценки</h2>
              <button
                onClick={() => router.push('/teacher/grades')}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                Все оценки →
              </button>
            </div>
            <div className="space-y-4">
              {recentGrades.length > 0 ? (
                recentGrades.map((grade) => (
                  <div key={grade.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{grade.student_name}</h3>
                      <span className={`badge-modern-${grade.grade >= 70 ? 'success' : grade.grade >= 50 ? 'warning' : 'danger'}`}>
                        {grade.grade}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{grade.subject}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">Оценок пока нет</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </UniversalLayout>
  );
}
