'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/auth';
import PillNav from '@/components/PillNav';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }

  async function handleLogout() {
    await signOut();
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  const navItems = [
    { label: 'Главная', href: '/student' },
    { label: 'Новости', href: '/student/news' },
    { label: 'Расписание', href: '/student/schedule' },
    { label: 'Библиотека', href: '/student/library' },
    { label: 'Оценки', href: '/student/grades' },
    { label: 'Обменник', href: '/student/exchange' },
    { label: 'Магазин', href: '/student/shop' },
    { label: 'Профиль', href: '/student/profile' }
  ];

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
        baseColor="#667eea"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#667eea"
        userName={user?.user_metadata?.name}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        {children}
      </div>
    </div>
  );
}
