'use client';

import { useState } from 'react';
import StudentLayout from '@/components/StudentLayout';
import StarBorder from '@/components/StarBorder';

const books = [
  { id: 1, title: 'Алгоритмы и структуры данных', author: 'Кормен Т.', category: 'Программирование', available: true, icon: '💻', pages: 1312 },
  { id: 2, title: 'Базы данных', author: 'Дейт К.', category: 'Программирование', available: true, icon: '🗄️', pages: 768 },
  { id: 3, title: 'Высшая математика', author: 'Пискунов Н.', category: 'Математика', available: false, icon: '📐', pages: 560 },
  { id: 4, title: 'Английский для IT', author: 'Murphy R.', category: 'Языки', available: true, icon: '🌐', pages: 392 },
  { id: 5, title: 'Веб-разработка', author: 'Фримен Э.', category: 'Программирование', available: true, icon: '🌍', pages: 896 },
  { id: 6, title: 'Физика для инженеров', author: 'Савельев И.', category: 'Физика', available: true, icon: '⚡', pages: 432 },
];

export default function StudentLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const categories = ['Все', 'Программирование', 'Математика', 'Языки', 'Физика'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <StudentLayout>
      <div className="mb-8 animate-fadeIn text-center">
        <h1 className="text-5xl font-bold mb-3">
          <span className="gradient-text">Электронная библиотека</span>
          <span className="inline-block animate-float ml-2">📚</span>
        </h1>
        <p className="text-gray-600 text-xl">Доступ к учебным материалам и книгам</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Поиск книг..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-6 py-4 glass-effect rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
        />
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-gray-800 to-black text-white shadow-lg'
                  : 'glass-effect text-gray-700 hover:shadow-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book, index) => (
          <div
            key={book.id}
            className="glass-effect rounded-2xl p-6 card-hover animate-fadeIn group"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="text-6xl group-hover:scale-110 transition-transform">{book.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-800 mb-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Автор: {book.author}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
                    {book.category}
                  </span>
                  <span className="text-xs text-gray-500">{book.pages} стр.</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium flex items-center gap-1 ${book.available ? 'text-green-600' : 'text-red-600'}`}>
                {book.available ? '✓ Доступна' : '✗ Занята'}
              </span>
              <StarBorder
                as="button"
                disabled={!book.available}
                color={book.available ? '#a855f7' : '#9ca3af'}
                speed="5s"
                style={{ 
                  opacity: book.available ? 1 : 0.5,
                  cursor: book.available ? 'pointer' : 'not-allowed'
                }}
              >
                {book.available ? 'Читать' : 'Недоступно'}
              </StarBorder>
            </div>
          </div>
        ))}
      </div>
    </StudentLayout>
  );
}
