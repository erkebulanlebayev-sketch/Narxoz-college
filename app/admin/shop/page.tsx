'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Plus, Pencil, Trash2, Package, X, Check } from 'lucide-react';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
};

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  in_stock: boolean;
  rating?: number;
  reviews?: number;
}

const CATEGORIES = [
  { id: 'merch', name: 'Мерч' },
  { id: 'stationery', name: 'Канцелярия' },
  { id: 'books', name: 'Книги' },
  { id: 'tech', name: 'Техника' },
];

const EMOJIS = ['👕', '👔', '🧢', '🎒', '🖊️', '📓', '🖍️', '📐', '🐍', '💾', '🎧', '🖱️', '📚', '🛍️'];

const EMPTY_FORM = { name: '', category: 'merch', price: 0, image: '🛍️', description: '', in_stock: true };

export default function AdminShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    loadProducts();
    const sub = supabase.channel('admin-shop')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shop_products' }, loadProducts)
      .subscribe();
    const iv = setInterval(loadProducts, 5000);
    return () => { sub.unsubscribe(); clearInterval(iv); };
  }, []);

  async function loadProducts() {
    const { data } = await supabase.from('shop_products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) {
        const { error } = await supabase.from('shop_products').update({
          name: form.name, category: form.category, price: form.price,
          image: form.image, description: form.description, in_stock: form.in_stock,
        }).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('shop_products').insert([{
          ...form, rating: 0, reviews: 0,
        }]);
        if (error) throw error;
      }
      closeForm();
      loadProducts();
    } catch (err: any) { alert('Ошибка: ' + err.message); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить товар?')) return;
    await supabase.from('shop_products').delete().eq('id', id);
    loadProducts();
  }

  async function toggleStock(id: number, cur: boolean) {
    await supabase.from('shop_products').update({ in_stock: !cur }).eq('id', id);
    loadProducts();
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({ name: p.name, category: p.category, price: p.price, image: p.image, description: p.description, in_stock: p.in_stock });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  if (loading) return (
    <DarkLayout role="admin">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </DarkLayout>
  );

  return (
    <DarkLayout role="admin">
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-10">

        {/* Header */}
        <motion.div variants={stagger.item} className="relative border-b border-white/5 pb-8 overflow-hidden">
          <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
          <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
            Admin · Shop
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Магазин<br /><span className="text-white/10">Товары</span>
            </h1>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY_FORM); }}
              className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black italic uppercase tracking-tighter transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)] shrink-0"
            >
              <Plus size={14} /> Добавить товар
            </motion.button>
          </div>
        </motion.div>

        {/* Form modal */}
        <AnimatePresence>
          {showForm && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={closeForm} className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="pointer-events-auto w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[28px] p-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                      {editing ? 'Редактировать' : 'Новый товар'}
                    </h2>
                    <button onClick={closeForm} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Название</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600/50 transition-colors" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Категория</label>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors">
                          {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-[#111]">{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Цена (₸)</label>
                        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required min="0"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600/50 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Иконка</label>
                      <div className="flex gap-2 flex-wrap">
                        {EMOJIS.map(e => (
                          <button key={e} type="button" onClick={() => setForm({ ...form, image: e })}
                            className={`text-2xl p-2 rounded-lg transition-all ${form.image === e ? 'bg-red-600/20 border border-red-600/40 scale-110' : 'bg-white/[0.03] border border-white/5 hover:scale-110'}`}>
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Описание</label>
                      <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors resize-none" />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div onClick={() => setForm({ ...form, in_stock: !form.in_stock })}
                        className={`w-10 h-5 rounded-full transition-colors relative ${form.in_stock ? 'bg-green-600' : 'bg-white/10'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.in_stock ? 'left-5' : 'left-0.5'}`} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">В наличии</span>
                    </label>
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={closeForm}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:border-white/20 transition-all">
                        Отмена
                      </button>
                      <button type="submit"
                        className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-black italic uppercase tracking-tighter transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                        {editing ? 'Сохранить' : 'Добавить'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Products grid */}
        {products.length === 0 ? (
          <motion.div variants={stagger.item} className="text-center py-24">
            <Package size={40} className="mx-auto mb-4 text-gray-700" />
            <p className="text-gray-700 font-bold uppercase tracking-widest text-sm font-mono">// no products yet</p>
          </motion.div>
        ) : (
          <motion.div variants={stagger.item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <motion.div key={p.id}
                whileHover={{ scale: 1.02, borderColor: 'rgba(220,38,38,0.3)' }}
                transition={{ duration: 0.2 }}
                className="relative rounded-[24px] bg-white/[0.02] border border-white/5 p-6 flex flex-col overflow-hidden group"
              >
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-600/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-5xl text-center mb-4">{p.image}</div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-black italic uppercase text-sm tracking-tight leading-tight">{p.name}</h3>
                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-gray-600 border border-white/5 px-2 py-0.5 rounded-full">
                    {CATEGORIES.find(c => c.id === p.category)?.name}
                  </span>
                </div>
                <p className="text-gray-600 text-xs mb-4 flex-1 font-mono">{p.description}</p>
                <div className="text-2xl font-black italic text-red-500 mb-4">{p.price.toLocaleString()} ₸</div>

                <div className="space-y-2">
                  <button onClick={() => toggleStock(p.id, p.in_stock)}
                    className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${
                      p.in_stock
                        ? 'bg-green-600/10 border-green-600/20 text-green-500 hover:bg-green-600/20'
                        : 'bg-white/[0.02] border-white/5 text-gray-600 hover:border-white/10'
                    }`}>
                    {p.in_stock ? <><Check size={11} /> В наличии</> : '○ Нет в наличии'}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)}
                      className="flex-1 py-2 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:border-white/15 transition-all flex items-center justify-center gap-1.5">
                      <Pencil size={11} /> Изменить
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="flex-1 py-2 rounded-xl border border-red-600/10 text-[10px] font-bold uppercase tracking-widest text-red-600/60 hover:text-red-500 hover:border-red-600/30 transition-all flex items-center justify-center gap-1.5">
                      <Trash2 size={11} /> Удалить
                    </button>
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
