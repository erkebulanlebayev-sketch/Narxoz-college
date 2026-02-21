'use client';

import UniversalLayout from '@/components/UniversalLayout';

export default function TeacherSchedulePage() {
  const schedule = [
    { day: 'Понедельник', lessons: [
      { time: '09:00-10:30', subject: 'Математика', group: 'ИС-21', room: 'А-101' },
      { time: '10:45-12:15', subject: 'Алгебра', group: 'ПО-22', room: 'Б-201' },
    ]},
    { day: 'Вторник', lessons: [
      { time: '09:00-10:30', subject: 'Математика', group: 'ИС-22', room: 'А-102' },
    ]},
    { day: 'Среда', lessons: [
      { time: '10:45-12:15', subject: 'Алгебра', group: 'ИС-21', room: 'А-101' },
      { time: '13:00-14:30', subject: 'Математика', group: 'ПО-22', room: 'Б-201' },
    ]},
    { day: 'Четверг', lessons: [
      { time: '09:00-10:30', subject: 'Математика', group: 'ИС-21', room: 'А-101' },
    ]},
    { day: 'Пятница', lessons: [
      { time: '10:45-12:15', subject: 'Алгебра', group: 'ПО-22', room: 'Б-201' },
    ]},
  ];

  return (
    <UniversalLayout role="teacher">
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Расписание</h1>
          <p className="text-gray-600">Ваше расписание занятий на неделю</p>
        </div>

        <div className="space-y-4">
          {schedule.map((day, index) => (
            <div key={index} className="glass-effect rounded-xl p-6 animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
              <h2 className="text-xl font-bold mb-4 gradient-text">{day.day}</h2>
              {day.lessons.length > 0 ? (
                <div className="space-y-3">
                  {day.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="glass-effect rounded-lg p-4 hover:shadow-lg transition-all group">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg text-center min-w-[120px]">
                          <p className="text-sm font-bold">{lesson.time}</p>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg">{lesson.subject}</p>
                          <div className="flex gap-3 text-sm text-gray-600">
                            <span>👥 {lesson.group}</span>
                            <span>🚪 {lesson.room}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Нет занятий</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </UniversalLayout>
  );
}
