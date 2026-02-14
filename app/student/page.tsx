'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/auth';
import PillNav from '@/components/PillNav';
import Carousel from '@/components/Carousel';
import { FiCalendar, FiBarChart2, FiFileText, FiBook } from 'react-icons/fi';

export default function StudentPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }

  async function handleLogout() {
    await signOut();
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  const carouselItems = [
    {
      title: 'Расписание',
      description: 'Посмотреть расписание занятий на неделю',
      id: 1,
      icon: <FiCalendar className="carousel-icon" />,
      href: '/student/schedule'
    },
    {
      title: 'Оценки',
      description: 'Проверить успеваемость и средний балл',
      id: 2,
      icon: <FiBarChart2 className="carousel-icon" />,
      href: '/student/grades'
    },
    {
      title: 'Новости',
      description: 'Актуальные новости и объявления колледжа',
      id: 3,
      icon: <FiFileText className="carousel-icon" />,
      href: '/student/news'
    },
    {
      title: 'Библиотека',
      description: 'Электронные учебники и материалы',
      id: 4,
      icon: <FiBook className="carousel-icon" />,
      href: '/student/library'
    }
  ];

  const navItems = [
    { label: 'Главная', href: '/student' },
    { label: 'Новости', href: '/student/news' },
    { label: 'Расписание', href: '/student/schedule' },
    { label: 'Библиотека', href: '/student/library' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Декоративные блобы */}
      <div className="decorative-blob blob-1"></div>
      <div className="decorative-blob blob-2"></div>
      <div className="decorative-blob blob-3"></div>

      <PillNav
        logo="https://img.hhcdn.ru/employer-logo/7337850.png"
        logoAlt="Narxoz College"
        items={navItems}
        activeHref="/student"
        baseColor="#667eea"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#667eea"
        userName={user?.user_metadata?.name}
        onLogout={handleLogout}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        {/* Welcome Section */}
        <div className="mb-12 animate-fadeIn text-center">
          <h1 className="text-5xl font-bold mb-3">
            <span className="gradient-text">Добро пожаловать, {user?.user_metadata?.name}!</span> 
            <span className="inline-block animate-float ml-2">👋</span>
          </h1>
          <p className="text-gray-600 text-xl">Рады видеть вас в системе Narxoz College</p>
        </div>

        {/* Stats and Carousel in one row */}
        <div className="mb-12 flex flex-col lg:flex-row gap-8 items-start">
          {/* Quick Stats - Left Side - Horizontal Layout */}
          <div className="grid grid-cols-2 gap-4 lg:w-auto flex-shrink-0">
            <div className="glass-effect rounded-2xl p-6 card-hover animate-fadeIn group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2 font-medium">Средний балл</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">3.8</p>
                </div>
                <div className="text-6xl group-hover:scale-110 transition-transform">📈</div>
              </div>
              <div className="mt-3 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            </div>

            <div className="glass-effect rounded-2xl p-6 card-hover animate-fadeIn group" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2 font-medium">Посещаемость</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">92%</p>
                </div>
                <div className="text-6xl group-hover:scale-110 transition-transform">✅</div>
              </div>
              <div className="mt-3 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '92%' }}></div>
            </div>

            <div className="glass-effect rounded-2xl p-6 card-hover animate-fadeIn group" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2 font-medium">Предметов</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">8</p>
                </div>
                <div className="text-6xl group-hover:scale-110 transition-transform">📚</div>
              </div>
              <div className="mt-3 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>

            <div className="glass-effect rounded-2xl p-6 card-hover animate-fadeIn group" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2 font-medium">Новых заданий</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">3</p>
                </div>
                <div className="text-6xl group-hover:scale-110 transition-transform">📝</div>
              </div>
              <div className="mt-3 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Carousel - Right Side */}
          <div className="flex-1 flex flex-col items-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
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

        {/* Today's Schedule */}
        <div className="glass-effect rounded-2xl p-8 animate-fadeIn shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">📅</span>
            <h2 className="text-3xl font-bold gradient-text">Расписание на сегодня</h2>
          </div>
          <div className="space-y-4">
            {[
              { time: '09:00 - 10:30', subject: 'Алгоритмы и структуры данных', room: 'А-101', teacher: 'Иванов И.И.', color: 'from-blue-500 to-indigo-500' },
              { time: '10:45 - 12:15', subject: 'Базы данных', room: 'Б-201', teacher: 'Петрова А.С.', color: 'from-purple-500 to-pink-500' },
              { time: '13:00 - 14:30', subject: 'Веб-разработка', room: 'А-102', teacher: 'Сидоров П.К.', color: 'from-indigo-500 to-purple-500' },
            ].map((lesson, index) => (
              <div key={index} className="glass-effect rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-center gap-4">
                  <div className={`bg-gradient-to-r ${lesson.color} text-white px-4 py-3 rounded-lg text-center min-w-[120px] group-hover:scale-105 transition-transform`}>
                    <p className="text-sm font-bold">{lesson.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-800 mb-1">{lesson.subject}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span>👨‍🏫</span>
                        {lesson.teacher}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🚪</span>
                        {lesson.room}
                      </span>
                    </div>
                  </div>
                  <div className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
