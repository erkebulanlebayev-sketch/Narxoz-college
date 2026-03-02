'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UniversalLayout from '@/components/UniversalLayout';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function StudentDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    gpa: 0,
    courses: 0,
    news: 0,
    materials: 0
  });
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const user = await getCurrentUser();
      const name = user?.user_metadata?.name || 'Студент';
      const group = user?.user_metadata?.group || '';
      setUserName(name);

      // Загрузить статистику
      const [newsData, materialsData, gradesData, scheduleData] = await Promise.all([
        supabase.from('news').select('*', { count: 'exact' }).eq('published', true),
        supabase.from('materials').select('*', { count: 'exact' }),
        supabase.from('grades').select('grade').eq('student_name', name),
        supabase.from('schedule').select('*').eq('group_name', group).limit(3)
      ]);

      // Подсчитать GPA
      const grades = gradesData.data || [];
      const avgGrade = grades.length > 0 
        ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length 
        : 0;
      const gpa = (avgGrade / 100 * 4).toFixed(2);

      setStats({
        gpa: parseFloat(gpa),
        courses: scheduleData.data?.length || 0,
        news: newsData.count || 0,
        materials: materialsData.count || 0
      });

      // Загрузить последние новости
      const { data: news } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      setRecentNews(news || []);

      setUpcomingClasses(scheduleData.data || []);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  }

  const quickActions = [
    { icon: '📚', label: 'Расписание', href: '/student/schedule', color: 'from-blue-500 to-cyan-500' },
    { icon: '📊', label: 'Оценки', href: '/student/grades', color: 'from-purple-500 to-pink-500' },
    { icon: '📰', label: 'Новости', href: '/student/news', color: 'from-orange-500 to-red-500' },
    { icon: '🛍️', label: 'Магазин', href: '/student/shop', color: 'from-green-500 to-emerald-500' },
    { icon: '📖', label: 'Библиотека', href: '/student/library', color: 'from-indigo-500 to-purple-500' },
    { icon: '📁', label: 'Материалы', href: '/student/exchange', color: 'from-pink-500 to-rose-500' }
  ];

  if (loading) {
    return (
      <UniversalLayout role="student">
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
    <UniversalLayout role="student">
      <div className="container-modern animate-fade-in">
        {/* Приветствие */}
        <div className="modern-card-gradient p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Привет, {userName}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Добро пожаловать в твою панель управления
              </p>
            </div>
            <div className="hidden md:block text-6xl">🎓</div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
              📊
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.gpa}</div>
              <div className="stat-label">Средний GPA</div>
            </div>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
              📚
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.courses}</div>
              <div className="stat-label">Активных курсов</div>
            </div>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="stat-icon bg-gradient-to-br from-orange-500 to-red-500">
              📰
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.news}</div>
              <div className="stat-label">Новостей</div>
            </div>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-500">
              📁
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.materials}</div>
              <div className="stat-label">Материалов</div>
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Быстрые действия</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={action.href}
                onClick={() => router.push(action.href)}
                className="modern-card p-6 text-center hover:scale-105 transition-transform animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {action.icon}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Последние новости */}
          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📰 Последние новости</h2>
              <button
                onClick={() => router.push('/student/news')}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                Все новости →
              </button>
            </div>
            <div className="space-y-4">
              {recentNews.length > 0 ? (
                recentNews.map((news) => (
                  <div key={news.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-1">{news.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{news.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(news.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">Новостей пока нет</p>
              )}
            </div>
          </div>

          {/* Ближайшие занятия */}
          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📅 Ближайшие занятия</h2>
              <button
                onClick={() => router.push('/student/schedule')}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                Расписание →
              </button>
            </div>
            <div className="space-y-4">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((cls, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{cls.subject}</h3>
                      <span className="badge-modern-info">{cls.room}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {cls.start_time} - {cls.end_time}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">Занятий пока нет</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </UniversalLayout>
  );
}
