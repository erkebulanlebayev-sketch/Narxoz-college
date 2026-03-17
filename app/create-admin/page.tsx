'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CreateAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('admin@narxoz.kz');
  const [password, setPassword] = useState('Admin123456!');
  const [name, setName] = useState('Администратор Системы');

  async function createAdmin() {
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role: 'admin' }
        }
      });

      if (error) {
        // Если уже существует — попробуем войти
        if (error.message.includes('already registered') || error.status === 422) {
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) {
            setMessage(`❌ Пользователь уже существует, но пароль неверный: ${signInError.message}`);
          } else {
            setMessage(`✅ Аккаунт уже существует — вход выполнен! Перенаправление...`);
            setTimeout(() => router.push('/admin'), 2000);
          }
        } else {
          setMessage(`❌ Ошибка: ${error.message}`);
        }
      } else {
        setMessage(`✅ Администратор создан!\nEmail: ${email}\nПароль: ${password}`);
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (err: any) {
      setMessage(`❌ Ошибка сети: ${err.message}. Проверьте .env.local`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
          Создать <span className="text-red-600">Администратора</span>
        </h1>
        <p className="text-gray-500 text-sm font-mono mb-6">Только для разработки</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Имя</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-600/50"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-600/50"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Пароль</label>
            <input
              type="text" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-600/50"
            />
          </div>

          <button
            onClick={createAdmin} disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
          >
            {loading ? 'Создание...' : 'Создать администратора'}
          </button>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-mono whitespace-pre-wrap ${
              message.includes('✅') ? 'bg-green-600/10 border border-green-600/20 text-green-400' : 'bg-red-600/10 border border-red-600/20 text-red-400'
            }`}>
              {message}
            </div>
          )}

          <button onClick={() => router.push('/login')}
            className="w-full py-3 border border-white/10 text-gray-400 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
            ← Вернуться к входу
          </button>
        </div>
      </div>
    </div>
  );
}
