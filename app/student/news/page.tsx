'use client';

import { useState, useEffect } from 'react';
import StudentLayout from '@/components/StudentLayout';
import { supabase } from '@/lib/supabase';

interface News {
  id: number;
  title: string;
  content: string;
  author_name: string;
  category?: string;
  created_at: string;
}

export default function StudentNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNews();

    // Real-time подписка на новости
    const channel = supabase
      .channel('student-news-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news' },
        (payload) => {
          console.log('✅ Новости обновлены через Realtime!', payload);
          loadNews();
        }
      )
      .subscribe();

    // Fallback: автообновление каждые 10 секунд
    const interval = setInterval(() => {
      loadNews();
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  async function loadNews() {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = ['all', ...Array.from(new Set(news.map(n => n.category).filter(Boolean)))];

  const filteredNews = news.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <p className="text-xl gradient-text font-bold">Загрузка новостей...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">📰 Новости колледжа</span>
          </h1>
          <p className="text-gray-600 font-medium">Актуальные новости и объявления</p>
        </div>

        {/* Поиск и фильтры */}
        <div className="ferris-card p-6 shadow-colorful">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔍 Поиск
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по новостям..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📂 Категория
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              >
                <option value="all">Все категории</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Список новостей */}
        <div className="space-y-6">
          {filteredNews.map((item, index) => (
            <div
              key={item.id}
              className="ferris-card p-6 card-hover glow animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold gradient-text">{item.title}</h2>
                {item.category && (
                  <span className="badge whitespace-nowrap">
                    {item.category}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">
                {item.content}
              </p>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">📅 {new Date(item.created_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                  <span className="ml-4">👤 {item.author_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Новости не найдены' 
                : 'Пока нет новостей'}
            </p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
