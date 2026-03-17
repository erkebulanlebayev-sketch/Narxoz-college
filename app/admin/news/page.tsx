'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { X, Plus, Tag, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5 } } },
};

const BG = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600',
  'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=600',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600',
];

interface News {
  id: number;
  title: string;
  content: string;
  author_id?: string;
  author_name: string;
  published: boolean;
  category?: string;
  created_at: string;
  updated_at: string;
}

const EMPTY = { title: '', content: '', category: 'Объявление', published: true };

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    loadNews();
    const ch = supabase.channel('admin-news-v6')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, loadNews)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function loadNews() {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    setNews(data || []);
    setLoading(false);
  }

  function openCreate() { setEditing(null); setForm(EMPTY); setShowModal(true); }
  function openEdit(item: News) {
    setEditing(item);
    setForm({ title: item.title, content: item.content, category: item.category || 'Объявление', published: item.published });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = await getCurrentUser();
    if (!user) return alert('Необходимо войти');
    if (editing) {
      await supabase.from('news').update({ title: form.title, content: form.content, category: form.category, published: form.published }).eq('id', editing.id);
    } else {
      await supabase.from('news').insert([{ ...form, author_id: user.id, author_name: user.user_metadata?.name || user.email || 'Администратор' }]);
    }
    setShowModal(false);
    loadNews();
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить?')) return;
    await supabase.from('news').delete().eq('id', id);
    loadNews();
  }

  async function togglePublished(id: number, cur: boolean) {
    await supabase.from('news').update({ published: !cur }).eq('id', id);
    loadNews();
  }

  return (
    <DarkLayout role="admin">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-10">
        <motion.div variants={stagger.item} className="relative border-b border-white/5 pb-8 overflow-hidden flex items-end justify-between">
          <div>
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Admin Portal · News
            </p>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Новости<br /><span className="text-white/10">Управление</span>
            </h1>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors">
            <Plus size={14} /> Добавить
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : news.length === 0 ? (
          <motion.div variants={stagger.item} className="text-center py-24">
            <p className="text-gray-700 font-bold uppercase tracking-widest text-sm font-mono">// нет новостей</p>
          </motion.div>
        ) : (
          <motion.div variants={stagger.container} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {news.map((item, i) => (
              <motion.div key={item.id} variants={stagger.item}
                className="group relative h-[320px] md:h-[420px] rounded-[32px] overflow-hidden border border-white/5 bg-white/[0.02]">
                <img src={BG[i % BG.length]} alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-40 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                {!item.published && (
                  <div className="absolute top-6 left-6 px-3 py-1 bg-black/60 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400">Черновик</div>
                )}
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => togglePublished(item.id, item.published)}
                    className="w-9 h-9 rounded-full bg-black/70 border border-white/10 flex items-center justify-center hover:border-white/30 transition-all">
                    <ArrowUpRight size={14} className={item.published ? 'text-green-400' : 'text-gray-500'} />
                  </button>
                  <button onClick={() => openEdit(item)}
                    className="w-9 h-9 rounded-full bg-black/70 border border-white/10 flex items-center justify-center hover:border-red-600/50 transition-all">
                    <Pencil size={14} className="text-gray-400" />
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="w-9 h-9 rounded-full bg-black/70 border border-red-600/20 flex items-center justify-center hover:border-red-600/60 transition-all">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  {item.category && (
                    <p className="text-red-500 font-mono text-xs mb-3 tracking-widest flex items-center gap-1">
                      <Tag size={10} />{item.category}
                    </p>
                  )}
                  <h3 className="text-2xl md:text-3xl font-black italic uppercase leading-tight tracking-tighter mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-xs font-mono line-clamp-2 mb-4">{item.content}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-[9px] font-mono text-gray-600">{new Date(item.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">{item.author_name}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md" />
            <motion.div key="md" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[201] flex items-center justify-center p-6 pointer-events-none">
              <div className="pointer-events-auto w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 relative max-h-[90vh] overflow-y-auto">
                <button onClick={() => setShowModal(false)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                  <X size={18} />
                </button>
                <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-3">Admin · News</p>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8">{editing ? 'Редактировать' : 'Новая новость'}</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Заголовок</label>
                    <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white text-sm focus:outline-none focus:border-red-600/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Категория</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-3 text-white text-sm focus:outline-none focus:border-red-600/50 transition-colors">
                      {['Объявление', 'Мероприятие', 'Система', 'Материалы', 'Важное'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Содержание</label>
                    <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white text-sm focus:outline-none focus:border-red-600/50 transition-colors resize-none" />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-red-600" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Опубликовать сразу</span>
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)}
                      className="flex-1 py-3 rounded-2xl border border-white/10 text-gray-400 text-[11px] font-black uppercase tracking-widest hover:border-white/20 transition-all">Отмена</button>
                    <button type="submit"
                      className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-widest transition-colors">
                      {editing ? 'Сохранить' : 'Опубликовать'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DarkLayout>
  );
}