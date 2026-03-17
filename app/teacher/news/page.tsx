'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Tag } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5 } } },
};

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600',
  'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=600',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600',
];

export default function TeacherNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadNews();
    const ch = supabase.channel('teacher-news-v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, loadNews)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function loadNews() {
    try {
      const { data } = await supabase.from('news').select('*').eq('published', true).order('created_at', { ascending: false });
      setNews(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const categories = ['all', ...Array.from(new Set(news.map((n: any) => n.category).filter(Boolean)))];
  const filtered = news.filter((n: any) => selectedCategory === 'all' || n.category === selectedCategory);

  return (
    <DarkLayout role="teacher">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-10">

        {/* Header */}
        <motion.div variants={stagger.item} className="relative border-b border-white/5 pb-8 overflow-hidden">
          <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
          <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
            Teacher Portal · News
          </p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            Новости<br /><span className="text-white/10">Колледжа</span>
          </h1>
        </motion.div>

        {/* Category filter */}
        <motion.div variants={stagger.item} className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat: any) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-red-600/10 border-red-600/30 text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.1)]'
                  : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-white'
              }`}>
              {cat === 'all' ? 'Все' : cat}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div variants={stagger.item} className="text-center py-24">
            <p className="text-gray-700 font-bold uppercase tracking-widest text-sm font-mono">// no news yet</p>
          </motion.div>
        ) : (
          <motion.div variants={stagger.container} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {filtered.map((item: any, i: number) => (
              <motion.div key={item.id} variants={stagger.item}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="group relative h-[320px] md:h-[420px] rounded-[32px] overflow-hidden border border-white/5 bg-white/[0.02]"
              >
                <img
                  src={BG_IMAGES[i % BG_IMAGES.length]}
                  className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-40 transition-all duration-1000"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  {item.category && (
                    <p className="text-red-500 font-mono text-xs mb-3 tracking-widest flex items-center gap-1">
                      <Tag size={10} />{item.category}
                    </p>
                  )}
                  <h3 className="text-2xl md:text-3xl font-black italic uppercase leading-tight tracking-tighter mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs font-mono line-clamp-2 mb-4">{item.content}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-[9px] font-mono text-gray-600">
                      {new Date(item.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">{item.author_name}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </motion.div>
    </DarkLayout>
  );
}
