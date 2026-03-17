'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Search, Tag } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

export default function StudentNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    loadNews();
    const ch = supabase.channel('student-news').on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, loadNews).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function loadNews() {
    const { data } = await supabase.from('news').select('*').eq('published', true).order('created_at', { ascending: false });
    setNews(data || []);
    setLoading(false);
  }

  const categories = ['all', ...Array.from(new Set(news.map((n: any) => n.category).filter(Boolean)))];
  const filtered = news.filter(n =>
    (category === 'all' || n.category === category) &&
    (n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DarkLayout role="student">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-8">

        <motion.div variants={stagger.item} className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Student Portal</p>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            Новости <span className="text-white/20">колледжа</span>
          </h1>
        </motion.div>

        {/* Filters */}
        <motion.div variants={stagger.item} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-red-600/50 transition-colors">
            {categories.map(c => <option key={c} value={c} className="bg-[#111]">{c === 'all' ? 'Все категории' : c}</option>)}
          </select>
        </motion.div>

        {/* News grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <motion.div variants={stagger.container} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item, i) => (
              <motion.div key={item.id} variants={stagger.item}
                className="group relative rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-red-600/20 hover:shadow-[0_0_30px_rgba(220,38,38,0.06)] transition-all p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/[0.03] transition-all duration-500 pointer-events-none rounded-[24px]" />
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-base font-black italic uppercase tracking-tighter leading-tight text-white group-hover:text-red-400 transition-colors">{item.title}</h2>
                  {item.category && (
                    <span className="shrink-0 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-red-500 border border-red-600/20 px-2 py-1 rounded-full">
                      <Tag size={8} />{item.category}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-4 mb-4">{item.content}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[9px] font-mono text-gray-700">{new Date(item.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">{item.author_name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-700 font-bold uppercase tracking-widest text-sm">Новостей не найдено</p>
          </div>
        )}

      </motion.div>
    </DarkLayout>
  );
}
