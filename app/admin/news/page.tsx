'use client';

import { useState } from 'react';
import UniversalLayout from '@/components/UniversalLayout';

export default function AdminNewsPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  const news = [
    {
      id: 1,
      title: 'Обновление системы оценивания',
      date: '2024-02-15',
      category: 'Система',
      content: 'С 1 марта вводится новая система оценивания.',
      important: true,
      author: 'Администратор'
    },
    {
      id: 2,
      title: 'Педагогический совет',
      date: '2024-02-10',
      category: 'Мероприятие',
      content: 'Педагогический совет состоится 20 февраля в 14:00.',
      important: false,
      author: 'Администратор'
    },
  ];

  return (
    <UniversalLayout role="admin">
      <div className="animate-fadeIn">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Управление новостями</h1>
            <p className="text-gray-600">Создание и редактирование новостей</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            + Добавить новость
          </button>
        </div>

        <div className="space-y-4">
          {news.map((item) => (
            <div 
              key={item.id} 
              className={`glass-effect rounded-xl p-6 hover:shadow-lg transition-all ${
                item.important ? 'border-2 border-red-300' : ''
              }`}
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
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm whitespace-nowrap">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{item.content}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span>📅 {item.date}</span>
                  <span className="ml-3">👤 {item.author}</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all">
                    Редактировать
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all">
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">Добавить новость</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Заголовок" className="w-full px-4 py-2 border rounded-lg" />
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option>Категория</option>
                  <option>Система</option>
                  <option>Мероприятие</option>
                  <option>Материалы</option>
                </select>
                <textarea 
                  placeholder="Содержание новости" 
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg"
                ></textarea>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-5 h-5" />
                  <span>Отметить как важное</span>
                </label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Отмена
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg">
                    Опубликовать
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UniversalLayout>
  );
}
