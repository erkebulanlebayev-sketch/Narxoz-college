'use client';

import { useMemo } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import dynamic from 'next/dynamic';
import { FiUsers, FiBarChart2, FiCalendar, FiFileText } from 'react-icons/fi';

const Carousel = dynamic(() => import('@/components/Carousel'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded-xl" />
});

export default function TeacherDashboard() {
  const carouselItems = useMemo(() => [
    {
      title: 'Студенты',
      description: 'Управление списком студентов и группами',
      id: 1,
      icon: <FiUsers className="carousel-icon" />,
      href: '/teacher/students'
    },
    {
      title: 'Оценки',
      description: 'Выставление и управление оценками',
      id: 2,
      icon: <FiBarChart2 className="carousel-icon" />,
      href: '/teacher/grades'
    },
    {
      title: 'Расписание',
      description: 'Просмотр расписания занятий',
      id: 3,
      icon: <FiCalendar className="carousel-icon" />,
      href: '/teacher/schedule'
    },
    {
      title: 'Материалы',
      description: 'Учебные материалы и задания',
      id: 4,
      icon: <FiFileText className="carousel-icon" />,
      href: '/teacher/materials'
    }
  ], []);

  return (
    <UniversalLayout role="teacher">
      <div className="mb-8 md:mb-12 animate-fadeIn text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-black">
          Панель преподавателя
          <span className="inline-block ml-2">👨‍🏫</span>
        </h1>
        <p className="text-gray-600 text-base md:text-xl">Управление учебным процессом</p>
      </div>

      <div className="mb-8 md:mb-12 flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full lg:w-auto flex-shrink-0">
          <div className="stat-box animate-fadeIn hover-lift">
            <div className="flex items-center justify-between mb-3">
              <div className="stat-label">Студентов</div>
              <div className="text-3xl">👥</div>
            </div>
            <div className="stat-number">45</div>
          </div>

          <div className="stat-box animate-fadeIn hover-lift" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="stat-label">Групп</div>
              <div className="text-3xl">📚</div>
            </div>
            <div className="stat-number">3</div>
          </div>

          <div className="stat-box animate-fadeIn hover-lift" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="stat-label">Предметов</div>
              <div className="text-3xl">📖</div>
            </div>
            <div className="stat-number">2</div>
          </div>

          <div className="stat-box animate-fadeIn hover-lift" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="stat-label">Занятий сегодня</div>
              <div className="text-3xl">📅</div>
            </div>
            <div className="stat-number">4</div>
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

      <div className="ferris-card p-4 md:p-6 lg:p-8 animate-fadeIn">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <span className="text-2xl md:text-3xl lg:text-4xl">📅</span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">Расписание на сегодня</h2>
        </div>
        <div className="space-y-3 md:space-y-4">
          {[
            { time: '09:00 - 10:30', subject: 'Математика', room: 'А-101', group: 'ИС-21' },
            { time: '10:45 - 12:15', subject: 'Алгебра', room: 'Б-201', group: 'ПО-22' },
            { time: '13:00 - 14:30', subject: 'Математика', room: 'А-102', group: 'ИС-22' },
          ].map((lesson, index) => (
            <div key={index} className="ferris-card p-3 md:p-5 hover-lift">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                <div className="bg-primary text-white px-3 md:px-4 py-2 md:py-3 rounded-lg text-center w-full md:w-auto md:min-w-[120px] font-bold">
                  <p className="text-xs md:text-sm">{lesson.time}</p>
                </div>
                <div className="flex-1 w-full">
                  <p className="font-bold text-base md:text-lg text-gray-800 mb-1">{lesson.subject}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs md:text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span>👥</span>
                      {lesson.group}
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
