'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

interface News {
  id: number;
  title: string;
  content: string;
  author_id?: string;
  author_name: string;
  published: boolean;
  image_url?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Объявление',
    published: true
  });

  useEffect(() => {
    loadNews();

    // Real-time подписка
    const channel = supabase
      .channel('news-changes')
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const user = await getCurrentUser();
      if (!user) {
        alert('Необходимо войти в систему');
        return;
      }

      if (editingNews) {
        // Обновление
        const { error } = await supabase
          .from('news')
          .update({
            title: formData.title,
            content: formData.content,
            category: formData.category,
            published: formData.published
          })
          .eq('id', editingNews.id);

        if (error) throw error;
        alert('✅ Новость обновлена!');
      } else {
        // Создание
        const { error } = await supabase
          .from('news')
          .insert([{
            title: formData.title,
            content: formData.content,
            category: formData.category,
            published: formData.published,
            author_id: user.id,
            author_name: user.user_metadata?.name || user.email || 'Администратор'
          }]);

        if (error) throw error;
        alert('✅ Новость опубликована!');
      }

      // Сброс формы
      setFormData({
        title: '',
        content: '',
        category: 'Объявление',
        published: true
      });
      setShowModal(false);
      setEditingNews(null);
      loadNews();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить эту новость?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('✅ Новость удалена!');
      loadNews();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    }
  }

  function handleEdit(item: News) {
    setEditingNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category || 'Объявление',
      published: item.published
    });
    setShowModal(true);
  }

  async function togglePublished(id: number, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('news')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadNews();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    }
  }

  if (loading) {
    return (
      <UniversalLayout role="admin">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl gradient-text font-bold">Загрузка...</p>
        </div>
      </UniversalLayout>
    );
  }

  return (
    <UniversalLayout role="admin">
      <div className="animate-fadeIn">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              📰 Управление новостями
            </h1>
            <p className="text-gray-600">Создание и редактирование новостей</p>
          </div>
          <button 
            onClick={() => {
              setEditingNews(null);
              setFormData({
                title: '',
                content: '',
                category: 'Объявление',
                published: true
              });
              setShowModal(true);
            }}
            className="btn-primary"
          >
            ➕ Добавить новость
          </button>
        </div>

        <div className="space-y-4">
          {news.map((item, index) => (
            <div 
              key={item.id} 
              className="ferris-card p-6 card-hover animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold gradient-text">{item.title}</h2>
                    {!item.published && (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-bold">
                        📝 Черновик
                      </span>
                    )}
                    {item.published && (
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-bold">
                        ✅ Опубликовано
                      </span>
                    )}
                  </div>
                  {item.category && (
                    <span className="badge badge-secondary">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{item.content}</p>
              
              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-gray-500">
                  <span>📅 {new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                  <span className="ml-3">👤 {item.author_name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublished(item.id, item.published)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      item.published
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {item.published ? '📝 Снять с публикации' : '✅ Опубликовать'}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition-all"
                  >
                    ✏️ Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all"
                  >
                    🗑️ Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">Нет новостей. Создайте первую!</p>
          </div>
        )}

        {/* Модальное окно */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold gradient-text mb-4">
                {editingNews ? '✏️ Редактировать новость' : '➕ Новая новость'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  >
                    <option>Объявление</option>
                    <option>Мероприятие</option>
                    <option>Система</option>
                    <option>Материалы</option>
                    <option>Важное</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Содержание
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <label htmlFor="published" className="text-sm font-bold text-gray-700">
                    Опубликовать сразу
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingNews(null);
                    }}
                    className="flex-1 btn-secondary"
                  >
                    ❌ Отмена
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    {editingNews ? '💾 Сохранить' : '📰 Опубликовать'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </UniversalLayout>
  );
}
