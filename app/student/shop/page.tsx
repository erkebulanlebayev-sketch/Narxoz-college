'use client';

import { useState, useEffect } from 'react';
import StudentLayout from '@/components/StudentLayout';
import { supabase } from '@/lib/supabase';

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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<number[]>([]);

  // Загрузка товаров из базы данных
  useEffect(() => {
    loadProducts();

    // Автоматическое обновление каждые 5 секунд
    const interval = setInterval(() => {
      loadProducts();
    }, 5000);

    // Real-time подписка на изменения (если работает)
    const subscription = supabase
      .channel('shop_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'shop_products' },
        () => {
          console.log('✅ Товары обновлены через Realtime!');
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('shop_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    { id: 'all', name: 'Все товары', icon: '🛍️' },
    { id: 'merch', name: 'Мерч', icon: '👕' },
    { id: 'stationery', name: 'Канцелярия', icon: '✏️' },
    { id: 'books', name: 'Книги', icon: '📚' },
    { id: 'tech', name: 'Техника', icon: '💻' }
  ];

  const filteredProducts = products.filter(p => 
    selectedCategory === 'all' || p.category === selectedCategory
  );

  const toggleCart = (productId: number) => {
    if (cart.includes(productId)) {
      setCart(cart.filter(id => id !== productId));
    } else {
      setCart([...cart, productId]);
    }
  };

  const totalPrice = cart.reduce((sum, id) => {
    const product = products.find(p => p.id === id);
    return sum + (product?.price || 0);
  }, 0);

  const handleCheckout = () => {
    const cartItems = cart.map(id => {
      const product = products.find(p => p.id === id);
      return `• ${product?.name} - ${product?.price.toLocaleString()} ₸`;
    }).join('\n');

    const message = `🛍️ *Новый заказ из Narxoz Shop*\n\n${cartItems}\n\n💰 *Итого: ${totalPrice.toLocaleString()} ₸*\n\nПожалуйста, подтвердите заказ.`;
    const phoneNumber = '77771234567';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <p className="text-xl gradient-text font-bold">Загрузка товаров...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">🛍️ Narxoz Shop</span>
          </h1>
          <p className="text-gray-600 font-medium">Официальный магазин колледжа</p>
        </div>

        {/* Корзина */}
        {cart.length > 0 && (
          <div className="ferris-card p-6 shadow-colorful animated-bg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">🛒 Корзина</h3>
                <p className="text-white/90">{cart.length} товаров</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80">Итого:</div>
                <div className="text-3xl font-bold text-white">{totalPrice.toLocaleString()} ₸</div>
              </div>
              <button 
                className="btn-primary"
                onClick={handleCheckout}
              >
                Оформить заказ
              </button>
            </div>
          </div>
        )}

        {/* Категории */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-pink scale-110'
                  : 'ferris-card hover:scale-105'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Товары */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="ferris-card p-6 card-hover glow" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{product.image}</div>
                <h3 className="text-xl font-bold gradient-text mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span>⭐</span>
                    <span className="font-bold">{product.rating}</span>
                  </div>
                  <span className="text-gray-400 text-sm">({product.reviews} отзывов)</span>
                </div>

                <div className="text-3xl font-black gradient-text mb-4">
                  {product.price.toLocaleString()} ₸
                </div>

                {product.in_stock ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 text-sm mb-4 font-bold">
                    <span>✅</span>
                    <span>В наличии</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-red-600 text-sm mb-4 font-bold">
                    <span>❌</span>
                    <span>Нет в наличии</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleCart(product.id)}
                  disabled={!product.in_stock}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                    cart.includes(product.id)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : product.in_stock
                      ? 'btn-primary'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {cart.includes(product.id) ? '✓ В корзине' : '🛒 В корзину'}
                </button>
                <button className="px-4 py-3 ferris-card hover:scale-110 transition-all text-2xl">
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 text-lg">Товары не найдены</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
