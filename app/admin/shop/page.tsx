'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';

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

export default function AdminShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'merch',
    price: 0,
    image: '🛍️',
    description: '',
    in_stock: true
  });

  const categories = [
    { id: 'merch', name: 'Мерч', icon: '👕' },
    { id: 'stationery', name: 'Канцелярия', icon: '✏️' },
    { id: 'books', name: 'Книги', icon: '📚' },
    { id: 'tech', name: 'Техника', icon: '💻' }
  ];

  const emojis = ['👕', '👔', '🧢', '🎒', '🖊️', '📓', '🖍️', '📐', '🐍', '💾', '🎧', '🖱️', '📚', '🛍️'];

  // Загрузка товаров из базы
  useEffect(() => {
    loadProducts();

    // Подписка на изменения в реальном времени
    const subscription = supabase
      .channel('shop_products_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'shop_products' },
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
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
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Обновление
        const { error } = await supabase
          .from('shop_products')
          .update({
            name: formData.name,
            category: formData.category,
            price: formData.price,
            image: formData.image,
            description: formData.description,
            in_stock: formData.in_stock
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
        alert('✅ Товар обновлен!');
      } else {
        // Добавление
        const { error } = await supabase
          .from('shop_products')
          .insert([{
            name: formData.name,
            category: formData.category,
            price: formData.price,
            image: formData.image,
            description: formData.description,
            in_stock: formData.in_stock,
            rating: 0,
            reviews: 0
          }]);

        if (error) throw error;
        alert('✅ Товар добавлен!');
      }

      // Сброс формы
      setFormData({
        name: '',
        category: 'merch',
        price: 0,
        image: '🛍️',
        description: '',
        in_stock: true
      });
      setShowAddForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
      in_stock: product.in_stock
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот товар?')) return;

    try {
      const { error } = await supabase
        .from('shop_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('✅ Товар удален!');
      loadProducts();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    }
  };

  const toggleStock = async (id: number, currentStock: boolean) => {
    try {
      const { error } = await supabase
        .from('shop_products')
        .update({ in_stock: !currentStock })
        .eq('id', id);

      if (error) throw error;
      loadProducts();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    }
  };

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
      <div className="mb-8 animate-fadeIn text-center">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">🛍️ Управление магазином</span>
        </h1>
        <p className="text-gray-600 text-lg font-medium">Добавление и редактирование товаров</p>
      </div>

      {/* Кнопка добавления */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProduct(null);
            setFormData({
              name: '',
              category: 'merch',
              price: 0,
              image: '🛍️',
              description: '',
              in_stock: true
            });
          }}
          className="btn-primary"
        >
          {showAddForm ? '❌ Отмена' : '➕ Добавить товар'}
        </button>
      </div>

      {/* Форма добавления/редактирования */}
      {showAddForm && (
        <div className="ferris-card p-6 mb-8 shadow-colorful animate-fadeIn">
          <h2 className="text-2xl font-bold gradient-text mb-4">
            {editingProduct ? '✏️ Редактировать товар' : '➕ Новый товар'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Цена (₸)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Иконка</label>
                <div className="flex gap-2 flex-wrap">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: emoji })}
                      className={`text-3xl p-2 rounded-lg transition-all ${
                        formData.image === emoji 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125' 
                          : 'hover:scale-110 ferris-card'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                rows={3}
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="in_stock"
                checked={formData.in_stock}
                onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="in_stock" className="text-sm font-bold text-gray-700">
                В наличии
              </label>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingProduct ? '💾 Сохранить' : '➕ Добавить'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
                className="btn-secondary"
              >
                ❌ Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список товаров */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="ferris-card p-6 card-hover animate-fadeIn"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">{product.image}</div>
              <h3 className="text-xl font-bold gradient-text mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              <div className="text-3xl font-black gradient-text mb-3">
                {product.price.toLocaleString()} ₸
              </div>
              <span className={`badge ${product.in_stock ? '' : 'badge-secondary'}`}>
                {categories.find(c => c.id === product.category)?.name}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => toggleStock(product.id, product.in_stock)}
                className={`w-full py-2 px-4 rounded-xl font-bold transition-all ${
                  product.in_stock
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                }`}
              >
                {product.in_stock ? '✅ В наличии' : '❌ Нет в наличии'}
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  ✏️ Изменить
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-lg">Нет товаров. Добавьте первый товар!</p>
        </div>
      )}
    </UniversalLayout>
  );
}
