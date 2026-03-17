'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, ShoppingBag, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  in_stock: boolean;
  rating: number;
  reviews: number;
}

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'merch', name: 'Мерч' },
  { id: 'stationery', name: 'Канцелярия' },
  { id: 'books', name: 'Книги' },
  { id: 'tech', name: 'Техника' },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<number[]>([]);

  useEffect(() => {
    loadProducts();
    const interval = setInterval(loadProducts, 5000);
    const subscription = supabase
      .channel('shop_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shop_products' }, loadProducts)
      .subscribe();
    return () => { clearInterval(interval); subscription.unsubscribe(); };
  }, []);

  async function loadProducts() {
    try {
      const { data } = await supabase
        .from('shop_products').select('*').order('created_at', { ascending: false });
      setProducts(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const filtered = products.filter(p => selectedCategory === 'all' || p.category === selectedCategory);
  const totalPrice = cart.reduce((sum, id) => sum + (products.find(p => p.id === id)?.price || 0), 0);

  function toggleCart(id: number) {
    setCart(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
  }

  function handleCheckout() {
    const items = cart.map(id => {
      const p = products.find(x => x.id === id);
      return `• ${p?.name} — ${p?.price.toLocaleString()} ₸`;
    }).join('\n');
    const msg = `🛍️ Новый заказ из Narxoz Shop\n\n${items}\n\nИтого: ${totalPrice.toLocaleString()} ₸`;
    window.open(`https://wa.me/77771234567?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <DarkLayout role="student">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Narxoz <span className="text-red-600">Shop</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">Официальный магазин колледжа</p>
        </div>

        {/* Cart bar */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart size={16} className="text-red-500" />
              <span className="font-black italic uppercase text-sm tracking-tight">
                {cart.length} товаров · <span className="text-red-500">{totalPrice.toLocaleString()} ₸</span>
              </span>
            </div>
            <button onClick={handleCheckout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
              Оформить
            </button>
          </motion.div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-red-600/10 border-red-600/30 text-red-500'
                  : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold uppercase text-sm tracking-widest">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product, i) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col"
              >
                <div className="text-5xl text-center mb-4">{product.image}</div>
                <h3 className="font-black italic uppercase text-sm tracking-tight mb-1">{product.name}</h3>
                <p className="text-gray-500 text-xs mb-3 flex-1">{product.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <Star size={11} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold">{product.rating}</span>
                  <span className="text-gray-600 text-xs">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-lg text-red-500">{product.price.toLocaleString()} ₸</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${product.in_stock ? 'text-green-500' : 'text-gray-600'}`}>
                    {product.in_stock ? '● В наличии' : '○ Нет'}
                  </span>
                </div>

                <button
                  onClick={() => toggleCart(product.id)}
                  disabled={!product.in_stock}
                  className={`w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                    cart.includes(product.id)
                      ? 'bg-red-600/10 border-red-600/30 text-red-500'
                      : product.in_stock
                      ? 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                      : 'border-white/5 text-gray-700 cursor-not-allowed'
                  }`}
                >
                  {cart.includes(product.id) ? '✓ В корзине' : 'В корзину'}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DarkLayout>
  );
}
