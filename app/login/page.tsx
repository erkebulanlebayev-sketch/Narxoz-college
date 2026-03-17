'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signIn } from '@/lib/auth';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await signIn(email, password);
    if (error) { setError('Неверный email или пароль'); setLoading(false); return; }
    const role = data.user?.user_metadata?.role;
    if (role === 'admin') router.push('/admin');
    else if (role === 'teacher') router.push('/teacher');
    else router.push('/student');
  }

  function fillTest(e: string, p: string) { setEmail(e); setPassword(p); }

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-red-600 flex items-center justify-center px-4">

      {/* Back to landing */}
      <Link href="/" className="fixed top-6 left-6 font-black italic text-sm tracking-tighter uppercase hover:text-red-600 transition-colors">
        ← Narxoz <span className="text-red-600">College</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-10">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-3">Narxoz College</p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            Вход в<br /><span className="text-white/20">систему</span>
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Пароль</label>
              <Link href="/forgot-password" className="text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                Забыли?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-[11px] font-bold uppercase tracking-widest">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black italic uppercase tracking-tighter text-sm py-3.5 rounded-xl transition-colors"
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-[11px] text-gray-600 mt-6">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-white font-bold hover:text-red-500 transition-colors">
            Зарегистрироваться →
          </Link>
        </p>

        {/* Test accounts */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-700 text-center mb-4">Тестовые аккаунты</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Студент', e: 'student@narxoz.kz', p: 'student123' },
              { label: 'Учитель', e: 'teacher@narxoz.kz', p: 'teacher123' },
              { label: 'Админ', e: 'admin@narxoz.kz', p: 'admin123' },
            ].map(a => (
              <button key={a.label} onClick={() => fillTest(a.e, a.p)}
                className="py-2 px-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all">
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
