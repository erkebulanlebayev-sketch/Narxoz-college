'use client';

import { useState } from 'react';
import StudentLayout from '@/components/StudentLayout';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<number[]>([]);

  const categories = [
    { id: 'all', name: 'Все товары', icon: '🛍️' },
    { id: 'merch', name: 'Мерч', icon: '👕' },
    { id: 'stationery', name: 'Канцелярия', icon: '✏️' },
    { id: 'books', name: 'Книги', icon: '📚' },
    { id: 'tech', name: 'Техника', icon: '💻' }
  ];

  const products = [
    {
      id: 1,
      name: 'Толстовка Narxoz',
      category: 'merch',
      price: 15000,
      image: '👕',
      description: 'Стильная толстовка с логотипом колледжа',
      inStock: true,
      rating: 4.8,
      reviews: 24
    },
    {
      id: 2,
      name: 'Футболка Narxoz',
      category: 'merch',
      price: 8000,
      image: '👔',
      description: 'Хлопковая футболка с принтом',
      inStock: true,
      rating: 4.6,
      reviews: 18
    },
    {
      id: 3,
      name: 'Кепка Narxoz',
      category: 'merch',
      price: 5000,
      image: '🧢',
      description: 'Бейсболка с вышитым логотипом',
      inStock: true,
      rating: 4.7,
      reviews: 15
    },
    {
      id: 4,
      name: 'Рюкзак студента',
      category: 'merch',
      price: 12000,
      image: '🎒',
      description: 'Вместительный рюкзак для учебы',
      inStock: true,
      rating: 4.9,
      reviews: 32
    },
    {
      id: 5,
      name: 'Набор ручек',
      category: 'stationery',
      price: 2000,
      image: '🖊️',
      description: 'Набор из 10 шариковых ручек',
      inStock: true,
      rating: 4.5,
      reviews: 45
    },
    {
      id: 6,
      name: 'Блокнот А5',
      category: 'stationery',
      price: 1500,
      image: '📓',
      description: 'Блокнот в клетку, 96 листов',
      inStock: true,
      rating: 4.6,
      reviews: 28
    },
    {
      id: 7,
      name: 'Маркеры цветные',
      category: 'stationery',
      price: 3000,
      image: '🖍️',
      description: 'Набор из 12 цветных маркеров',
      inStock: true,
      rating: 4.7,
      reviews: 19
    },
    {
      id: 8,
      name: 'Учебник по Математике',
      category: 'books',
      price: 6000,
      image: '📐',
      description: 'Математический анализ, 2-е издание',
      inStock: true,
      rating: 4.8,
      reviews: 56
    },
    {
      id: 9,
      name: 'Программирование на Python',
      category: 'books',
      price: 7500,
      image: '🐍',
      description: 'Полное руководство для начинающих',
      inStock: false,
      rating: 5.0,
      reviews: 89
    },
    {
      id: 10,
      name: 'Флешка 32GB',
      category: 'tech',
      price: 4000,
      image: '💾',
      description: 'USB 3.0 флеш-накопитель',
      inStock: true,
      rating: 4.6,
      reviews: 67
    },
    {
      id: 11,
      name: 'Наушники',
      category: 'tech',
      price: 9000,
      image: '🎧',
      description: 'Беспроводные наушники с микрофоном',
      inStock: true,
      rating: 4.7,
      reviews: 43
    },
    {
      id: 12,
      name: 'Мышка беспроводная',
      category: 'tech',
      price: 5500,
      image: '🖱️',
      description: 'Эргономичная беспроводная мышь',
      inStock: true,
      rating: 4.5,
      reviews: 31
    }
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

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-black bg-clip-text text-transparent mb-2">
            🛍️ Narxoz Shop
          </h1>
          <p className="text-gray-600">Официальный магазин колледжа</p>
        </div>

        {/* Корзина */}
        {cart.length > 0 && (
          <div className="ferris-card p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold gradient-text mb-1">🛒 Корзина</h3>
                <p className="text-gray-600">{cart.length} товаров</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Итого:</div>
                <div className="text-3xl font-bold gradient-text">{totalPrice.toLocaleString()} ₸</div>
              </div>
              <button className="bg-gradient-to-r from-red-600 to-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:shadow-lg transition-all">
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
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-red-600 shadow-md'
                  : 'ferris-card hover:scale-105'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Товары */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="ferris-card p-6 hover:scale-[1.02] transition-transform">
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{product.image}</div>
                <h3 className="text-xl font-bold gradient-text mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                {/* Рейтинг */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span>⭐</span>
                    <span className="font-bold">{product.rating}</span>
                  </div>
                  <span className="text-gray-400 text-sm">({product.reviews} отзывов)</span>
                </div>

                {/* Цена */}
                <div className="text-3xl font-bold gradient-text mb-4">
                  {product.price.toLocaleString()} ₸
                </div>

                {/* Наличие */}
                {product.inStock ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 text-sm mb-4">
                    <span>✅</span>
                    <span>В наличии</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-red-600 text-sm mb-4">
                    <span>❌</span>
                    <span>Нет в наличии</span>
                  </div>
                )}
              </div>

              {/* Кнопки */}
              <div className="flex gap-3">
                <button
                  onClick={() => toggleCart(product.id)}
                  disabled={!product.inStock}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                    cart.includes(product.id)
                      ? 'bg-green-600 text-white'
                      : product.inStock
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {cart.includes(product.id) ? '✓ В корзине' : '🛒 В корзину'}
                </button>
                <button className="px-4 py-2 ferris-card hover:scale-105 transition-all">
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
