'use client';

import { useMemo } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import dynamic from 'next/dynamic';
import { FiUsers, FiUserCheck, FiCalendar, FiSettings } from 'react-icons/fi';

const Carousel = dynamic(() => import('@/components/Carousel'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded-xl" />
});

export default function AdminDashboard() {
  const carouselItems = useMemo(() => [
    {
      title: 'Студенты',
      description: 'Управление студентами и группами',
      id: 1,
      icon: <FiUsers className="carousel-icon" />,
      href: '/admin/students'
    },
    {
      title: 'Учителя',
      description: 'Управление преподавателями',
      id: 2,
      icon: <FiUserCheck className="carousel-icon" />,
      href: '/admin/teachers'
    },
    {
      title: 'Расписание',
      description: 'Создание и редактирование расписания',
      id: 3,
      icon: <FiCalendar className="carousel-icon" />,
      href: '/admin/schedule'
    },
    {
      title: 'Настройки',
      description: 'Системные настройки',
      id: 4,
      icon: <FiSettings className="carousel-icon" />,
      href: '/admin/settings'
    }
  ], []);

  return (
    <UniversalLayout role="admin">
      <div className="mb-8 md:mb-12 animate-fadeIn text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
          <span className="gradient-text">Панель администратора</span>
          <span className="inline-block animate-float ml-2">⚙️</span>
        </h1>
        <p className="text-gray-600 text-base md:text-xl">Управление системой Narxoz College</p>
      </div>

      <div className="mb-8 md:mb-12 flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full lg:w-auto flex-shrink-0">
          <div className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 card-hover animate-fadeIn group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 font-medium">Студентов</p>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">156</p>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl group-hover:scale-110 transition-transform">👥</div>
            </div>
            <div className="mt-2 md:mt-3 h-1.5 md:h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          </div>

          <div className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 card-hover animate-fadeIn group" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 font-medium">Учителей</p>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">24</p>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl group-hover:scale-110 transition-transform">👨‍🏫</div>
            </div>
            <div className="mt-2 md:mt-3 h-1.5 md:h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          </div>

          <div className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 card-hover animate-fadeIn group" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 font-medium">Групп</p>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">12</p>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl group-hover:scale-110 transition-transform">📚</div>
            </div>
            <div className="mt-2 md:mt-3 h-1.5 md:h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>

          <div className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 card-hover animate-fadeIn group" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 font-medium">Предметов</p>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">18</p>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl group-hover:scale-110 transition-transform">📖</div>
            </div>
            <div className="mt-2 md:mt-3 h-1.5 md:h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col items-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <Carousel
            items={carouselItems}
            baseWidth={450}
            autoplay={true}
            autoplayDelay={4000}
            pauseOnHover={true}
            loop={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 animate-fadeIn shadow-xl">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <span className="text-2xl md:text-3xl">📊</span>
            <h2 className="text-xl md:text-2xl font-bold gradient-text">Последние действия</h2>
          </div>
          <div className="space-y-3">
            {[
              { action: 'Добавлен новый студент', user: 'Иванов И.И.', time: '10 минут назад', color: 'from-blue-500 to-indigo-500' },
              { action: 'Обновлено расписание', user: 'Петрова А.С.', time: '1 час назад', color: 'from-green-500 to-emerald-500' },
              { action: 'Создана новая группа', user: 'Сидоров П.К.', time: '2 часа назад', color: 'from-purple-500 to-pink-500' },
            ].map((item, index) => (
              <div key={index} className="glass-effect rounded-lg p-3 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} mt-2`}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.action}</p>
                    <p className="text-sm text-gray-600">{item.user} • {item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 animate-fadeIn shadow-xl" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <span className="text-2xl md:text-3xl">⚠️</span>
            <h2 className="text-xl md:text-2xl font-bold gradient-text">Требуют внимания</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Незаполненное расписание', desc: 'Группа ИС-23, понедельник', priority: 'high' },
              { title: 'Ожидают подтверждения', desc: '3 новых заявки на регистрацию', priority: 'medium' },
              { title: 'Обновление системы', desc: 'Доступна новая версия', priority: 'low' },
            ].map((item, index) => (
              <div key={index} className="glass-effect rounded-lg p-3 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UniversalLayout>
  );
}
