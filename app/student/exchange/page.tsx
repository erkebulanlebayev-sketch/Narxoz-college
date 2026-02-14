'use client';

import { useState } from 'react';
import StudentLayout from '@/components/StudentLayout';

export default function ExchangePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Все', icon: '📚' },
    { id: 'notes', name: 'Конспекты', icon: '📝' },
    { id: 'homework', name: 'Домашки', icon: '✍️' },
    { id: 'projects', name: 'Проекты', icon: '💻' },
    { id: 'exams', name: 'Экзамены', icon: '🎓' }
  ];

  const materials = [
    {
      id: 1,
      title: 'Конспект по Математическому анализу',
      author: 'Алексей Иванов',
      category: 'notes',
      subject: 'Математика',
      rating: 4.8,
      downloads: 156,
      date: '2 дня назад',
      description: 'Полный конспект лекций за 1 семестр с примерами и решениями',
      tags: ['интегралы', 'производные', 'пределы']
    },
    {
      id: 2,
      title: 'Решения задач по Программированию',
      author: 'Мария Петрова',
      category: 'homework',
      subject: 'Программирование',
      rating: 4.9,
      downloads: 203,
      date: '5 дней назад',
      description: 'Все домашние задания с подробными комментариями на Python',
      tags: ['python', 'алгоритмы', 'ООП']
    },
    {
      id: 3,
      title: 'Курсовой проект: Веб-приложение',
      author: 'Иван Сидоров',
      category: 'projects',
      subject: 'Веб-разработка',
      rating: 5.0,
      downloads: 89,
      date: '1 неделю назад',
      description: 'Полноценное веб-приложение на React + Node.js с документацией',
      tags: ['react', 'nodejs', 'mongodb']
    },
    {
      id: 4,
      title: 'Шпаргалки к экзамену по Физике',
      author: 'Ольга Смирнова',
      category: 'exams',
      subject: 'Физика',
      rating: 4.6,
      downloads: 312,
      date: '3 дня назад',
      description: 'Все формулы и основные теоремы в удобном формате',
      tags: ['механика', 'электричество', 'оптика']
    },
    {
      id: 5,
      title: 'Лабораторные работы по Химии',
      author: 'Дмитрий Козлов',
      category: 'homework',
      subject: 'Химия',
      rating: 4.7,
      downloads: 124,
      date: '1 день назад',
      description: 'Отчеты по всем лабораторным с выводами и расчетами',
      tags: ['органика', 'реакции', 'эксперименты']
    }
  ];

  const myMaterials = [
    {
      id: 101,
      title: 'Мои конспекты по Английскому',
      category: 'notes',
      subject: 'Английский язык',
      rating: 4.5,
      downloads: 45,
      date: '1 неделю назад'
    }
  ];

  const filteredMaterials = materials.filter(m => 
    selectedCategory === 'all' || m.category === selectedCategory
  );

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🔄 Обменник знаниями
          </h1>
          <p className="text-gray-600">Делитесь материалами и помогайте друг другу</p>
        </div>

        {/* Табы */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'glass-card hover:scale-105'
            }`}
          >
            📚 Все материалы
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'my'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'glass-card hover:scale-105'
            }`}
          >
            📤 Мои загрузки
          </button>
        </div>

        {activeTab === 'all' && (
          <>
            {/* Категории */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'glass-card hover:scale-105'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* Список материалов */}
            <div className="grid gap-6">
              {filteredMaterials.map(material => (
                <div key={material.id} className="glass-card p-6 hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold gradient-text mb-2">{material.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{material.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {material.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👤 {material.author}</span>
                        <span>📚 {material.subject}</span>
                        <span>🕒 {material.date}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        <span className="text-2xl">⭐</span>
                        <span className="text-xl font-bold">{material.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        📥 {material.downloads} скачиваний
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all">
                      📥 Скачать
                    </button>
                    <button className="px-4 py-2 glass-card hover:scale-105 transition-all">
                      👁️ Просмотр
                    </button>
                    <button className="px-4 py-2 glass-card hover:scale-105 transition-all">
                      ❤️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'my' && (
          <div className="space-y-6">
            {/* Кнопка загрузки */}
            <div className="glass-card p-8 text-center">
              <div className="text-6xl mb-4">📤</div>
              <h3 className="text-2xl font-bold mb-2">Загрузите свои материалы</h3>
              <p className="text-gray-600 mb-4">Помогите другим студентам и заработайте репутацию</p>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:shadow-lg transition-all">
                ➕ Загрузить материал
              </button>
            </div>

            {/* Мои материалы */}
            <div className="grid gap-6">
              {myMaterials.map(material => (
                <div key={material.id} className="glass-card p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold gradient-text mb-2">{material.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📚 {material.subject}</span>
                        <span>🕒 {material.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        <span>⭐</span>
                        <span className="font-bold">{material.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        📥 {material.downloads}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 glass-card hover:scale-105 transition-all">
                      ✏️ Редактировать
                    </button>
                    <button className="px-4 py-2 glass-card hover:scale-105 transition-all text-red-600">
                      🗑️ Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
