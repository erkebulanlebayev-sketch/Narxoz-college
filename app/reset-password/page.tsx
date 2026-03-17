'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { updatePassword } from '@/lib/auth';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsValidSession(true);
      else setError('Недействительная ссылка для сброса пароля');
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Пароли не совпадают'); return; }
    if (password.length < 6) { setError('Минимум 6 символов'); return; }
    setLoading(true);
    setError('');
    try {
      const { error } = await updatePassword(password);
      if (error) throw error;
      setMessage('Пароль изменён! Перенаправление...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-red-600 flex items-center justify-center px-4">
      <Link href="/login" className="fixed top-6 left-6 font-black italic text-sm tracking-tighter uppercase hover:text-red-600 transition-colors">
        ← Назад
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-10">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-3">Narxoz College</p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            Новый<br /><span className="text-white/20">пароль</span>
          </h1>
        </div>

        {isValidSession ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Новый пароль</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" minLength={6}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Подтвердите пароль</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••" minLength={6}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors" />
            </div>

            {message && <p className="text-green-500 text-[11px] font-bold uppercase tracking-widest">{message}</p>}
            {error && <p className="text-red-500 text-[11px] font-bold uppercase tracking-widest">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black italic uppercase tracking-tighter text-sm py-3.5 rounded-xl transition-colors">
              {loading ? 'Сохраняем...' : 'Изменить пароль'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {error && <p className="text-red-500 text-[11px] font-bold uppercase tracking-widest">{error}</p>}
            <Link href="/forgot-password" className="block text-center text-white font-bold hover:text-red-500 transition-colors text-sm">
              Запросить новую ссылку →
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
