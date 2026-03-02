'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';

interface News {
  id: number;
  title: string;
  content: string;
  author_name: string;
  category?: string;
  created_at: string;
}

export default function TeacherNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadNews();

    // Real-time подписка
    const channel = supabase
      .channel('teacher-news-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news' },
        () => {
          console.log('✅ Новости обновлены через Realtime!');
          loadNews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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

  const filteredNews = news.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  if (loading) {
    return (
      <UniversalLayout role="teacher">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl gradient-text font-bold">Загрузка...</p>
        </div>
      </UniversalLayout>
    );
  }

  return (
    <UniversalLayout role="teacher">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">📰 Новости колледжа</span>
          </h1>
          <p className="text-gray-600 font-medium">Актуальные новости и объявления</p>
        </div>

        {/* Фильтр */}
        <div className="ferris-card p-4 shadow-colorful">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
          >
            <option value="all">📂 Все категории</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Новости */}
        <div className="space-y-6">
          {filteredNews.map((item, index) => (
            <div
              key={item.id}
              className="ferris-card p-6 card-hover animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold gradient-text">{item.title}</h2>
                {item.category && (
                  <span className="badge">{item.category}</span>
                )}
              </div>

              <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">
                {item.content}
              </p>

              <div className="text-sm text-gray-500 border-t pt-4">
                <span>📅 {new Date(item.created_at).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
                <span className="ml-4">👤 {item.author_name}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">Нет новостей</p>
          </div>
        )}
      </div>
    </UniversalLayout>
  );
}
