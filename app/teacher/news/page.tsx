'use client';

import UniversalLayout from '@/components/UniversalLayout';

export default function TeacherNewsPage() {
  const news = [
    {
      id: 1,
      title: 'Обновление системы оценивания',
      date: '2024-02-15',
      category: 'Система',
      content: 'С 1 марта вводится новая система оценивания. Просим всех преподавателей ознакомиться с изменениями.',
      important: true
    },
    {
      id: 2,
      title: 'Педагогический совет',
      date: '2024-02-10',
      category: 'Мероприятие',
      content: 'Педагогический совет состоится 20 февраля в 14:00 в актовом зале.',
      important: false
    },
    {
      id: 3,
      title: 'Новые учебные материалы',
      date: '2024-02-05',
      category: 'Материалы',
      content: 'В библиотеку добавлены новые учебные пособия по математике и физике.',
      important: false
    },
  ];

  return (
    <UniversalLayout role="teacher">
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Новости</h1>
          <p className="text-gray-600">Актуальные новости и объявления</p>
        </div>

        <div className="space-y-4">
          {news.map((item, index) => (
            <div 
              key={item.id} 
              className={`glass-effect rounded-xl p-6 hover:shadow-lg transition-all animate-fadeIn ${
                item.important ? 'border-2 border-red-300' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.important && (
                <div className="mb-3">
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                    ⚠️ Важно
                  </span>
                </div>
              )}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl font-bold">{item.title}</h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm whitespace-nowrap">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{item.content}</p>
              <p className="text-sm text-gray-500">📅 {item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </UniversalLayout>
  );
}
