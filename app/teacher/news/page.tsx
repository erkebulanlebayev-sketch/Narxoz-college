'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Newspaper } from 'lucide-react';

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
    const channel = supabase
      .channel('teacher-news-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, loadNews)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function loadNews() {
    try {
      const { data } = await supabase
        .from('news').select('*').eq('published', true)
        .order('created_at', { ascending: false });
      setNews(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const categories = ['all', ...Array.from(new Set(news.map(n => n.category).filter(Boolean) as string[]))];
  const filtered = news.filter(n => selectedCategory === 'all' || n.category === selectedCategory);

  return (
    <DarkLayout role="teacher">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Новости <span className="text-red-600">Колледжа</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">{news.length} публикаций</p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-red-600/10 border-red-600/30 text-red-500'
                  : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Все' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold uppercase text-sm tracking-widest">Нет новостей</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="font-black italic uppercase text-lg tracking-tight leading-tight">{item.title}</h2>
                  {item.category && (
                    <span className="px-2 py-1 rounded-lg bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap mb-4">{item.content}</p>
                <div className="flex items-center gap-4 text-[11px] font-mono text-gray-600 border-t border-white/5 pt-3">
                  <span>{new Date(item.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>·</span>
                  <span>{item.author_name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DarkLayout>
  );
}
