'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    news: 0,
    schedule: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [studentsData, teachersData, newsData, scheduleData] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact' }),
        supabase.from('teachers').select('*', { count: 'exact' }),
        supabase.from('news').select('*', { count: 'exact' }),
        supabase.from('schedule').select('*', { count: 'exact' })
      ]);

      setStats({
        students: studentsData.count || 0,
        teachers: teachersData.count || 0,
        news: newsData.count || 0,
        schedule: scheduleData.count || 0
      });

      // Последние новости как активность
      const { data: news } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentActivity(news || []);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  }

  const quickActions = [
    { icon: '📰', label: 'Новости', href: '/admin/news', color: 'from-orange-500 to-red-500', desc: 'Управление новостями' },
    { icon: '📅', label: 'Расписание', href: '/admin/schedule', color: 'from-blue-500 to-cyan-500', desc: 'Создать расписание' },
    { icon: '👥', label: 'Студенты', href: '/admin/students', color: 'from-purple-500 to-pink-500', desc: 'Список студентов' },
    { icon: '👨‍🏫', label: 'Преподаватели', href: '/admin/teachers', color: 'from-green-500 to-emerald-500', desc: 'Список преподавателей' },
    { icon: '🛍️', label: 'Магазин', href: '/admin/shop', color: 'from-pink-500 to-rose-500', desc: 'Товары магазина' },
    { icon: '⚙️', label: 'Настройки', href: '/admin/settings', color: 'from-indigo-500 to-purple-500', desc: 'Системные настройки' }
  ];

  if (loading) {
    return (
      <UniversalLayout role="admin">
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
    <UniversalLayout role="admin">
      <div className="container-modern animate-fade-in">
        {/* Приветствие */}
        <div className="modern-card-gradient p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Панель администратора 🎯
              </h1>
              <p className="text-gray-600 text-lg">
                Управление системой колледжа
              </p>
            </div>
            <div className="hidden md:block text-6xl">⚡</div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
              👥
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.students}</div>
              <div className="stat-label">Студентов</div>
            </div>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-500">
              👨‍🏫
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.teachers}</div>
              <div className="stat-label">Преподавателей</div>
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
            <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
              📅
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.schedule}</div>
              <div className="stat-label">Занятий</div>
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

        {/* Последняя активность */}
        <div className="modern-card p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Последняя активность</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    📰
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(item.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <span className={`badge-modern-${item.published ? 'success' : 'warning'}`}>
                    {item.published ? 'Опубликовано' : 'Черновик'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Активности пока нет</p>
            )}
          </div>
        </div>
      </div>
    </UniversalLayout>
  );
}
