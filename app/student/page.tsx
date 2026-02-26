'use client';

import { useEffect, useState, useMemo } from 'react';
import { getCurrentUser } from '@/lib/auth';
import UniversalLayout from '@/components/UniversalLayout';
import dynamic from 'next/dynamic';
import { FiCalendar, FiBarChart2, FiFileText, FiBook } from 'react-icons/fi';

const Carousel = dynamic(() => import('@/components/Carousel'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded-xl" />
});

export default function StudentPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    
    async function loadUser() {
      const currentUser = await getCurrentUser();
      if (mounted) {
        setUser(currentUser);
      }
    }
    
    loadUser();
    
    return () => {
      mounted = false;
    };
  }, []);

  const carouselItems = useMemo(() => [
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
  ], []);

  return (
    <UniversalLayout role="student">
      <div className="mb-8 md:mb-12 animate-fadeIn text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
          <span className="gradient-text">Добро пожаловать, {user?.user_metadata?.name}!</span> 
          <span className="inline-block animate-float ml-2">👋</span>
        </h1>
        <p className="text-gray-600 text-base md:text-xl">Рады видеть вас в системе Narxoz College</p>
      </div>

      <div className="mb-8 md:mb-12 flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full lg:w-auto flex-shrink-0">
          <div className="ferris-card rounded-xl md:rounded-2xl p-4 md:p-6 card-hover animate-fadeIn group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 font-medium">Средний балл</p>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">3.8</p>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl group-hover:scale-110 transition-transform">📈</div>
            </div>
            <div className="mt-2 md:mt-3 h-1.5 md:h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          </div>

          <div className="ferris-card rounded-xl md:rounded-2xl p-4 md:p-6 card-hover animate-fadeIn group" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 font-medium">Посещаемость</p>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">92%</p>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl group-hover:scale-110 transition-transform">✅</div>
            </div>
            <div className="mt-2 md:mt-3 h-1.5 md:h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '92%' }}></div>
          </div>

          <div className="ferris-card rounded-xl md:rounded-2xl p-4 md:p-6 card-hover animate-fadeIn group" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 font-medium">Предметов</p>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">8</p>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl group-hover:scale-110 transition-transform">📚</div>
            </div>
            <div className="mt-2 md:mt-3 h-1.5 md:h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>

          <div className="ferris-card rounded-xl md:rounded-2xl p-4 md:p-6 card-hover animate-fadeIn group" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 font-medium">Новых заданий</p>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">3</p>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl group-hover:scale-110 transition-transform">📝</div>
            </div>
            <div className="mt-2 md:mt-3 h-1.5 md:h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '60%' }}></div>
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

      <div className="ferris-card rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 animate-fadeIn shadow-xl">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <span className="text-2xl md:text-3xl lg:text-4xl">📅</span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold gradient-text">Расписание на сегодня</h2>
        </div>
        <div className="space-y-3 md:space-y-4">
          {[
            { time: '09:00 - 10:30', subject: 'Алгоритмы и структуры данных', room: 'А-101', teacher: 'Иванов И.И.', color: 'from-blue-500 to-indigo-500' },
            { time: '10:45 - 12:15', subject: 'Базы данных', room: 'Б-201', teacher: 'Петрова А.С.', color: 'from-purple-500 to-pink-500' },
            { time: '13:00 - 14:30', subject: 'Веб-разработка', room: 'А-102', teacher: 'Сидоров П.К.', color: 'from-indigo-500 to-purple-500' },
          ].map((lesson, index) => (
            <div key={index} className="ferris-card rounded-lg md:rounded-xl p-3 md:p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                <div className={`bg-gradient-to-r ${lesson.color} text-white px-3 md:px-4 py-2 md:py-3 rounded-lg text-center w-full md:w-auto md:min-w-[120px] group-hover:scale-105 transition-transform`}>
                  <p className="text-xs md:text-sm font-bold">{lesson.time}</p>
                </div>
                <div className="flex-1 w-full">
                  <p className="font-bold text-base md:text-lg text-gray-800 mb-1">{lesson.subject}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs md:text-sm text-gray-600">
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
                <div className="hidden md:block text-2xl lg:text-3xl opacity-0 group-hover:opacity-100 transition-opacity">→</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UniversalLayout>
  );
}
