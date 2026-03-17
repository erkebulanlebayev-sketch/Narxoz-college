'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signUp } from '@/lib/auth';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

const groups = ['ИС-21-1', 'ИС-21-2', 'ИС-22-1', 'ИС-22-2', 'ИС-23-1', 'ИС-23-2'];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [group, setGroup] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role === 'student' && !group) { setError('Выберите группу'); return; }
    setLoading(true);
    setError('');
    const { error } = await signUp(email, password, name, role, group);
    if (error) { setError('Ошибка регистрации: ' + error.message); setLoading(false); return; }
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-red-600 flex items-center justify-center px-4">
      <Link href="/" className="fixed top-6 left-6 font-black italic text-sm tracking-tighter uppercase hover:text-red-600 transition-colors">
        ← Narxoz <span className="text-red-600">College</span>
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
            Регистрация<br /><span className="text-white/20">аккаунта</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Имя</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ваше имя"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors" />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors" />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Пароль</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-colors pr-12" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Роль</label>
            <div className="grid grid-cols-2 gap-2">
              {(['student', 'teacher'] as const).map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                    role === r ? 'bg-red-600/10 text-red-500 border border-red-600/20' : 'bg-white/[0.03] border border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                  }`}>
                  {r === 'student' ? 'Студент' : 'Преподаватель'}
                </button>
              ))}
            </div>
          </div>

          {role === 'student' && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Группа</label>
              <select value={group} onChange={e => setGroup(e.target.value)} required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600/50 transition-colors">
                <option value="" className="bg-[#111]">Выберите группу</option>
                {groups.map(g => <option key={g} value={g} className="bg-[#111]">{g}</option>)}
              </select>
            </div>
          )}

          {error && <p className="text-red-500 text-[11px] font-bold uppercase tracking-widest">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black italic uppercase tracking-tighter text-sm py-3.5 rounded-xl transition-colors">
            {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-600 mt-6">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-white font-bold hover:text-red-500 transition-colors">Войти →</Link>
        </p>
      </motion.div>
    </div>
  );
}
