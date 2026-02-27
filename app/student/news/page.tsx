'use client';

import StudentLayout from '@/components/StudentLayout';

const newsData = [
  {
    id: 1,
    title: 'Открытие новой библиотеки',
    date: '2024-02-10',
    category: 'События',
    image: '📚',
    content: 'В нашем колледже открылась современная библиотека с электронными ресурсами и зонами для самостоятельной работы.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'Студенческая олимпиада по программированию',
    date: '2024-02-08',
    category: 'Конкурсы',
    image: '🏆',
    content: 'Приглашаем всех студентов принять участие в олимпиаде по программированию. Регистрация до 20 февраля.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    title: 'Изменения в расписании',
    date: '2024-02-05',
    category: 'Объявления',
    image: '📅',
    content: 'С 15 февраля вступают в силу изменения в расписании занятий для групп ИС-21-1 и ПО-21-1.',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 4,
    title: 'День открытых дверей',
    date: '2024-02-01',
    category: 'События',
    image: '🎓',
    content: 'Приглашаем абитуриентов и их родителей на День открытых дверей 25 февраля в 10:00.',
    color: 'from-green-500 to-teal-500'
  },
];

export default function StudentNewsPage() {
  return (
    <StudentLayout>
      <div className="mb-8 animate-fadeIn text-center">
        <h1 className="text-5xl font-bold mb-3">
          <span className="gradient-text">Новости колледжа</span>
          <span className="inline-block ml-2 text-5xl">📰</span>
        </h1>
        <p className="text-gray-600 text-xl font-medium">Будьте в курсе всех событий и объявлений</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {newsData.map((news, index) => (
          <div
            key={news.id}
            className="ferris-card overflow-hidden card-hover animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`h-4 bg-gradient-to-r ${news.color}`}></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-5xl">{news.image}</div>
                  <div>
                    <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${news.color} shadow-lg`}>
                      {news.category}
                    </span>
                    <p className="text-sm text-gray-500 mt-2 font-medium">{news.date}</p>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{news.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{news.content}</p>
              <button className={`px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${news.color} hover:shadow-2xl transition-all hover:scale-105`}>
                Читать далее →
              </button>
            </div>
          </div>
        ))}
      </div>
    </StudentLayout>
  );
}
