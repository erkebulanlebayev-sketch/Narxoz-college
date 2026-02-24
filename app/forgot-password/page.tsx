'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import StarBorder from '@/components/StarBorder';
import { translations, Language } from '@/lib/translations';

const Galaxy = dynamic(() => import('@/components/Galaxy'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<Language>('ru');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  const t = translations[language];

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      const successMsg = language === 'kz' 
        ? 'Құпия сөзді қалпына келтіру хаты жіберілді! Поштаңызды тексеріңіз.'
        : language === 'ru'
        ? 'Письмо для сброса пароля отправлено! Проверьте вашу почту.'
        : 'Password reset email sent! Check your inbox.';
      
      setMessage(successMsg);
      setEmail('');
    } catch (error: any) {
      setError(error.message || 'Ошибка при отправке письма');
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
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

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => changeLanguage('kz')}
          className={`px-3 py-1 rounded-lg font-medium transition-all ${
            language === 'kz'
              ? 'bg-white text-blue-600 shadow-md'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          ҚАЗ
        </button>
        <button
          onClick={() => changeLanguage('ru')}
          className={`px-3 py-1 rounded-lg font-medium transition-all ${
            language === 'ru'
              ? 'bg-white text-blue-600 shadow-md'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          РУС
        </button>
      </div>
      
      <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn z-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {t.forgotPasswordTitle}
          </h1>
          <p className="text-gray-600">{t.forgotPasswordDesc}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white/90"
              placeholder="your@email.com"
              required
            />
          </div>

          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

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
            {loading ? `${t.loading}` : t.sendEmail}
          </StarBorder>
        </form>

        <div className="mt-6 text-center space-y-2">
          <a href="/login" className="block text-gray-900 hover:text-gray-700 font-semibold transition">
            {t.backToLogin}
          </a>
        </div>
      </div>
    </div>
  );
}
