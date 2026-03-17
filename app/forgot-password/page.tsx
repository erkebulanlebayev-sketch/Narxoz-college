'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { requestPasswordReset } from '@/lib/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { error } = await requestPasswordReset(email);
      if (error) throw error;
      setMessage('Письмо отправлено! Проверьте вашу почту.');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке письма');
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
            Сброс<br /><span className="text-white/20">пароля</span>
          </h1>
          <p className="text-gray-600 text-sm mt-4">Введите email — пришлём ссылку для восстановления.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors" />
          </div>

          {message && <p className="text-green-500 text-[11px] font-bold uppercase tracking-widest">{message}</p>}
          {error && <p className="text-red-500 text-[11px] font-bold uppercase tracking-widest">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black italic uppercase tracking-tighter text-sm py-3.5 rounded-xl transition-colors">
            {loading ? 'Отправляем...' : 'Отправить письмо'}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-600 mt-6">
          <Link href="/login" className="text-white font-bold hover:text-red-500 transition-colors">← Вернуться к входу</Link>
        </p>
      </motion.div>
    </div>
  );
}
