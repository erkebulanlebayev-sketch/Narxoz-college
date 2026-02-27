'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/auth';
import { translations, Language } from '@/lib/translations';
import dynamic from 'next/dynamic';

const PillNav = dynamic(() => import('@/components/PillNav'), {
  ssr: false,
  loading: () => <div className="h-16" />
});

interface UniversalLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'teacher' | 'admin';
}

export default function UniversalLayout({ children, role }: UniversalLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>('ru');

  const t = translations[currentLang];

  // Все хуки должны быть вызваны до любых условных возвратов
  const navItems = useMemo(() => {
    if (role === 'student') {
      return [
        { label: t.home, href: '/student' },
        { label: t.news, href: '/student/news' },
        { label: t.schedule, href: '/student/schedule' },
        { label: t.library, href: '/student/library' },
        { label: t.grades, href: '/student/grades' },
        { label: t.exchange, href: '/student/exchange' },
        { label: t.shop, href: '/student/shop' },
        { label: t.profile, href: '/student/profile' }
      ];
    } else if (role === 'teacher') {
      return [
        { label: t.home, href: '/teacher' },
        { label: t.news, href: '/teacher/news' },
        { label: t.schedule, href: '/teacher/schedule' },
        { label: t.students, href: '/teacher/students' },
        { label: t.grades, href: '/teacher/grades' },
        { label: t.materials, href: '/teacher/materials' },
        { label: t.profile, href: '/teacher/profile' }
      ];
    } else {
      return [
        { label: t.home, href: '/admin' },
        { label: t.news, href: '/admin/news' },
        { label: t.schedule, href: '/admin/schedule' },
        { label: t.students, href: '/admin/students' },
        { label: t.teachers, href: '/admin/teachers' },
        { label: t.shop, href: '/admin/shop' },
        { label: t.users, href: '/admin/users' },
        { label: t.audit, href: '/admin/audit' },
        { label: t.settings, href: '/admin/settings' }
      ];
    }
  }, [role, currentLang, t]);

  const baseColor = useMemo(() => {
    if (role === 'teacher') return '#10b981';
    if (role === 'admin') return '#f59e0b';
    return '#667eea';
  }, [role]);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    if (currentUser.user_metadata?.role !== role) {
      router.push(`/${currentUser.user_metadata?.role || 'login'}`);
      return;
    }
    
    setUser(currentUser);
    setLoading(false);
  }

  async function handleLogout() {
    await signOut();
    router.push('/login');
  }

  function handleLanguageChange(lang: string) {
    setCurrentLang(lang as Language);
    localStorage.setItem('preferredLanguage', lang);
  }

  // Загрузка сохраненного языка
  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage') as Language;
    if (savedLang && translations[savedLang]) {
      setCurrentLang(savedLang);
    }
  }, []);

  // Показываем минимальный UI во время загрузки
  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="decorative-blob blob-1"></div>
        <div className="decorative-blob blob-2"></div>
        <div className="decorative-blob blob-3"></div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl animate-pulse">{t.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Декоративные блобы */}
      <div className="decorative-blob blob-1"></div>
      <div className="decorative-blob blob-2"></div>
      <div className="decorative-blob blob-3"></div>

      <PillNav
        logo="https://img.hhcdn.ru/employer-logo/7337850.png"
        logoAlt="Narxoz College"
        items={navItems}
        activeHref={pathname}
        baseColor={baseColor}
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor={baseColor}
        userName={user?.user_metadata?.name}
        onLogout={handleLogout}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-20 md:py-24 relative z-10">
        {children}
      </div>
    </div>
  );
}

