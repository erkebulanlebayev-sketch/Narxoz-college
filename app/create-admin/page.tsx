'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CreateAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function createAdmin() {
    setLoading(true);
    setMessage('');

    try {
      // Регистрация администратора
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@narxoz.kz',
        password: 'xxx123',
        options: {
          data: {
            name: 'Администратор Системы',
            role: 'admin'
          }
        }
      });

      if (error) {
        setMessage(`❌ Ошибка: ${error.message}`);
      } else {
        setMessage('✅ Администратор создан! Email: admin@narxoz.kz, Пароль: xxx123');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err: any) {
      setMessage(`❌ Ошибка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="ferris-card p-8 max-w-md w-full shadow-colorful">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">👨‍💼</div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Создать администратора
          </h1>
          <p className="text-gray-600">
            Быстрое создание тестового аккаунта администратора
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-light rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Email:</p>
            <p className="font-bold">admin@narxoz.kz</p>
          </div>

          <div className="p-4 bg-light rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Пароль:</p>
            <p className="font-bold">xxx123</p>
          </div>

          <div className="p-4 bg-light rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Роль:</p>
            <p className="font-bold">Администратор</p>
          </div>

          <button
            onClick={createAdmin}
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? '⏳ Создание...' : '➕ Создать администратора'}
          </button>

          {message && (
            <div className={`p-4 rounded-xl text-center font-bold ${
              message.includes('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={() => router.push('/login')}
            className="w-full btn-secondary"
          >
            ← Вернуться к входу
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Важно:</strong> Эта страница только для разработки. 
            Удалите её перед деплоем в production!
          </p>
        </div>
      </div>
    </div>
  );
}
