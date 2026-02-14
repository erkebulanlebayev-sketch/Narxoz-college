'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';
import Galaxy from '@/components/Galaxy';
import StarBorder from '@/components/StarBorder';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await signUp(email, password, name, role);
    
    if (error) {
      setError('Ошибка регистрации: ' + error.message);
      setLoading(false);
      return;
    }

    router.push('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Galaxy Background */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1.2}
          glowIntensity={0.4}
          saturation={0.3}
          hueShift={280}
          twinkleIntensity={0.4}
          rotationSpeed={0.05}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
        />
      </div>
      
      <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn z-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Регистрация
          </h1>
          <p className="text-gray-600">Создайте новый аккаунт</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white/90"
              placeholder="Ваше имя"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white/90"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white/90"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Роль</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  role === 'student'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-white/90 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                👨‍🎓 Студент
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  role === 'teacher'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-white/90 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                👨‍🏫 Преподаватель
              </button>
            </div>
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
            color="magenta"
            speed="4s"
            className="w-full"
            style={{ opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </StarBorder>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-purple-600 hover:text-purple-700 font-semibold transition">
            Уже есть аккаунт? Войти →
          </a>
        </div>
      </div>
    </div>
  );
}

