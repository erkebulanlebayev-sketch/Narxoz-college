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
          <span className="inline-block ml-2 text-4xl">👋</span>
        </h1>
        <p className="text-gray-600 text-base md:text-xl font-medium">Рады видеть вас в системе Narxoz College</p>
      </div>

      <div className="mb-8 md:mb-12 flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full lg:w-auto flex-shrink-0">
          <div className="stat-box animate-fadeIn glow">
            <div className="text-5xl mb-3">📈</div>
            <div className="stat-number">3.8</div>
            <div className="stat-label">Средний балл</div>
          </div>

          <div className="stat-box animate-fadeIn glow" style={{ animationDelay: '0.1s' }}>
            <div className="text-5xl mb-3">✅</div>
            <div className="stat-number">92%</div>
            <div className="stat-label">Посещаемость</div>
          </div>

          <div className="stat-box animate-fadeIn glow" style={{ animationDelay: '0.2s' }}>
            <div className="text-5xl mb-3">📚</div>
            <div className="stat-number">8</div>
            <div className="stat-label">Предметов</div>
          </div>

          <div className="stat-box animate-fadeIn glow" style={{ animationDelay: '0.3s' }}>
            <div className="text-5xl mb-3">📝</div>
            <div className="stat-number">3</div>
            <div className="stat-label">Новых заданий</div>
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

      <div className="ferris-card p-4 md:p-6 lg:p-8 animate-fadeIn shadow-colorful">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <span className="text-2xl md:text-3xl lg:text-4xl">📅</span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold gradient-text">Расписание на сегодня</h2>
        </div>
        <div className="space-y-3 md:space-y-4">
          {[
            { time: '09:00 - 10:30', subject: 'Алгоритмы и структуры данных', room: 'А-101', teacher: 'Иванов И.И.', gradient: 'from-blue-500 via-blue-600 to-indigo-600' },
            { time: '10:45 - 12:15', subject: 'Базы данных', room: 'Б-201', teacher: 'Петрова А.С.', gradient: 'from-purple-500 via-purple-600 to-pink-600' },
            { time: '13:00 - 14:30', subject: 'Веб-разработка', room: 'А-102', teacher: 'Сидоров П.К.', gradient: 'from-green-500 via-emerald-600 to-teal-600' },
          ].map((lesson, index) => (
            <div key={index} className="ferris-card p-3 md:p-5 card-hover">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                <div className={`bg-gradient-to-r ${lesson.gradient} text-white px-3 md:px-4 py-2 md:py-3 rounded-xl text-center w-full md:w-auto md:min-w-[120px] font-bold shadow-lg`}>
                  <p className="text-xs md:text-sm">{lesson.time}</p>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </UniversalLayout>
  );
}
