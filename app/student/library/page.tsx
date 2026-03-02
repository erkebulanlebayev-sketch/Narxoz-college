'use client';

import { useState, useEffect } from 'react';
import StudentLayout from '@/components/StudentLayout';
import StarBorder from '@/components/StarBorder';
import { supabase } from '@/lib/supabase';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn?: string;
  pages?: number;
  available: boolean;
  created_at: string;
}

export default function StudentLibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  useEffect(() => {
    loadBooks();

    // Real-time подписка на книги
    const booksChannel = supabase
      .channel('student-library-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'library_books' },
        () => {
          console.log('✅ Библиотека обновлена через Realtime!');
          loadBooks();
        }
      )
      .subscribe();

    // Fallback: обновление каждые 10 секунд
    const interval = setInterval(loadBooks, 10000);

    return () => {
      supabase.removeChannel(booksChannel);
      clearInterval(interval);
    };
  }, []);

  async function loadBooks() {
    try {
      const { data, error } = await supabase
        .from('library_books')
        .select('*')
        .order('title');

      if (error) throw error;
      setBooks(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки книг:', error);
      setLoading(false);
    }
  }

  const categories = ['Все', ...Array.from(new Set(books.map(b => b.category)))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Программирование': '💻',
      'Математика': '📐',
      'Физика': '⚡',
      'Языки': '🌐',
      'Экономика': '💰',
      'История': '📜',
      'Литература': '📖'
    };
    return icons[category] || '📚';
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl gradient-text font-bold">Загрузка библиотеки...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="mb-8 animate-fadeIn text-center">
        <h1 className="text-5xl font-bold mb-3 gradient-text">
          📚 Электронная библиотека
        </h1>
        <p className="text-gray-600 text-xl">Доступ к учебным материалам и книгам</p>
      </div>

      {/* Поиск и фильтры */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 Поиск книг по названию или автору..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-6 py-4 ferris-card rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
        />
      </div>

      {/* Категории */}
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'ferris-card text-gray-700 hover:shadow-md hover:scale-105'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Список книг */}
      {filteredBooks.length === 0 ? (
        <div className="ferris-card p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold mb-2">
            {searchQuery || selectedCategory !== 'Все' ? 'Книги не найдены' : 'Библиотека пуста'}
          </h3>
          <p className="text-gray-600">
            {searchQuery || selectedCategory !== 'Все' 
              ? 'Попробуйте изменить параметры поиска' 
              : 'Книги появятся здесь, когда администратор их добавит'}
          </p>
        </div>
      ) : (
        <>
          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="ferris-card p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{books.length}</div>
              <div className="text-sm text-gray-600">Всего книг</div>
            </div>
            <div className="ferris-card p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {books.filter(b => b.available).length}
              </div>
              <div className="text-sm text-gray-600">Доступно</div>
            </div>
            <div className="ferris-card p-4 text-center">
              <div className="text-3xl font-bold text-red-600">
                {books.filter(b => !b.available).length}
              </div>
              <div className="text-sm text-gray-600">Занято</div>
            </div>
            <div className="ferris-card p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{categories.length - 1}</div>
              <div className="text-sm text-gray-600">Категорий</div>
            </div>
          </div>

          {/* Сетка книг */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book, index) => (
              <div
                key={book.id}
                className="ferris-card p-6 hover-lift animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-6xl">{getCategoryIcon(book.category)}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">✍️ {book.author}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                        {book.category}
                      </span>
                      {book.pages && (
                        <span className="text-xs text-gray-500">📄 {book.pages} стр.</span>
                      )}
                      {book.isbn && (
                        <span className="text-xs text-gray-500">ISBN: {book.isbn}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`text-sm font-bold flex items-center gap-2 ${
                    book.available ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {book.available ? '✅ Доступна' : '❌ Занята'}
                  </span>
                  <StarBorder
                    as="button"
                    disabled={!book.available}
                    color={book.available ? '#9333EA' : '#9ca3af'}
                    speed="5s"
                    style={{ 
                      opacity: book.available ? 1 : 0.5,
                      cursor: book.available ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {book.available ? '📖 Читать' : '🔒 Недоступно'}
                  </StarBorder>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </StudentLayout>
  );
}
