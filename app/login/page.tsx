'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';
import dynamic from 'next/dynamic';
import StarBorder from '@/components/StarBorder';

// Динамическая загрузка Galaxy только на клиенте
const Galaxy = dynamic(() => import('@/components/Galaxy'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await signIn(email, password);
    
    if (error) {
      setError('Ошибка входа: ' + error.message);
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role;
    if (role === 'admin') router.push('/admin');
    else if (role === 'teacher') router.push('/teacher');
    else if (role === 'student') router.push('/student');
  }

  function handleTestLogin(testEmail: string, testPassword: string) {
    setEmail(testEmail);
    setPassword(testPassword);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Galaxy Background */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1}
          glowIntensity={0.3}
          saturation={0.2}
          hueShift={200}
          twinkleIntensity={0.3}
          rotationSpeed={0.08}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
        />
      </div>
      
      <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn z-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Narxoz College
          </h1>
          <p className="text-gray-600">Войдите в свой аккаунт</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white/90"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">Пароль</label>
              <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition">
                Забыли пароль?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white/90"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <StarBorder
            as="button"
            type="submit"
            disabled={loading}
            color="#000000"
            speed="4s"
            className="w-full"
            style={{ opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </StarBorder>
        </form>

        <div className="mt-6 text-center">
          <a href="/register" className="text-gray-900 hover:text-gray-700 font-semibold transition">
            Нет аккаунта? Зарегистрироваться →
          </a>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-3 font-semibold">Тестовые аккаунты:</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleTestLogin('admin@narxoz.kz', 'admin123')}
              className="w-full px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-all text-sm font-medium"
            >
              ⚙️ Администратор
            </button>
            <button
              type="button"
              onClick={() => handleTestLogin('teacher@narxoz.kz', 'teacher123')}
              className="w-full px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-all text-sm font-medium"
            >
              👨‍🏫 Преподаватель
            </button>
            <button
              type="button"
              onClick={() => handleTestLogin('student@narxoz.kz', 'student123')}
              className="w-full px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-all text-sm font-medium"
            >
              👨‍🎓 Студент
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
