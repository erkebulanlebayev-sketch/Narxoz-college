'use client';

import StudentLayout from '@/components/StudentLayout';

const scheduleData = [
  {
    day: 'Понедельник',
    lessons: [
      { time: '09:00 - 10:30', subject: 'Алгоритмы и структуры данных', teacher: 'Иванов И.И.', room: 'А-101', type: 'Лекция' },
      { time: '10:45 - 12:15', subject: 'Базы данных', teacher: 'Петрова А.С.', room: 'Б-201', type: 'Практика' },
      { time: '13:00 - 14:30', subject: 'Веб-разработка', teacher: 'Сидоров П.К.', room: 'А-102', type: 'Лаб. работа' },
    ]
  },
  {
    day: 'Вторник',
    lessons: [
      { time: '09:00 - 10:30', subject: 'Математический анализ', teacher: 'Козлова М.В.', room: 'В-301', type: 'Лекция' },
      { time: '10:45 - 12:15', subject: 'Английский язык', teacher: 'Smith J.', room: 'Б-105', type: 'Практика' },
      { time: '13:00 - 14:30', subject: 'Физика', teacher: 'Новиков А.П.', room: 'В-202', type: 'Лекция' },
    ]
  },
  {
    day: 'Среда',
    lessons: [
      { time: '09:00 - 10:30', subject: 'Операционные системы', teacher: 'Волков Д.С.', room: 'А-103', type: 'Лекция' },
      { time: '10:45 - 12:15', subject: 'Алгоритмы и структуры данных', teacher: 'Иванов И.И.', room: 'А-101', type: 'Практика' },
    ]
  },
  {
    day: 'Четверг',
    lessons: [
      { time: '09:00 - 10:30', subject: 'Базы данных', teacher: 'Петрова А.С.', room: 'Б-201', type: 'Лекция' },
      { time: '10:45 - 12:15', subject: 'Веб-разработка', teacher: 'Сидоров П.К.', room: 'А-102', type: 'Практика' },
      { time: '13:00 - 14:30', subject: 'Математический анализ', teacher: 'Козлова М.В.', room: 'В-301', type: 'Практика' },
    ]
  },
  {
    day: 'Пятница',
    lessons: [
      { time: '09:00 - 10:30', subject: 'Английский язык', teacher: 'Smith J.', room: 'Б-105', type: 'Практика' },
      { time: '10:45 - 12:15', subject: 'Физическая культура', teacher: 'Орлов С.Н.', room: 'Спортзал', type: 'Практика' },
    ]
  },
];

const typeColors: { [key: string]: string } = {
  'Лекция': 'from-blue-500 to-indigo-500',
  'Практика': 'from-purple-500 to-pink-500',
  'Лаб. работа': 'from-green-500 to-emerald-500',
};

export default function SchedulePage() {
  return (
    <StudentLayout>
      <div className="mb-8 animate-fadeIn text-center">
        <h1 className="text-5xl font-bold mb-3">
          <span className="gradient-text">Расписание занятий</span>
          <span className="inline-block animate-float ml-2">📅</span>
        </h1>
        <p className="text-gray-600 text-xl">Ваше расписание на неделю</p>
      </div>

      <div className="space-y-6">
        {scheduleData.map((day, dayIndex) => (
          <div
            key={day.day}
            className="ferris-card rounded-2xl p-6 animate-fadeIn shadow-xl"
            style={{ animationDelay: `${dayIndex * 0.1}s` }}
          >
            <h2 className="text-2xl font-bold gradient-text mb-4">{day.day}</h2>
            <div className="space-y-3">
              {day.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className="ferris-card rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className={`bg-gradient-to-r ${typeColors[lesson.type]} text-white px-4 py-2 rounded-lg text-center min-w-[120px] group-hover:scale-105 transition-transform`}>
                      <p className="text-sm font-bold">{lesson.time}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-lg text-gray-800">{lesson.subject}</p>
                        <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${typeColors[lesson.type]} text-white`}>
                          {lesson.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
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
        ))}
      </div>
    </StudentLayout>
  );
}
