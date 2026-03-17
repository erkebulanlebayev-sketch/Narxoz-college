'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser, signOut } from '@/lib/auth';
import Link from 'next/link';
import {
  LayoutDashboard, Calendar, BarChart2, BookOpen, ShoppingBag,
  FileText, Users, Settings, LogOut, GraduationCap, ShieldCheck,
  User, Newspaper, Library, ArrowLeftRight
} from 'lucide-react';

interface DarkLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'teacher' | 'admin';
}

const navConfig = {
  student: [
    { label: 'Главная', href: '/student', icon: LayoutDashboard },
    { label: 'Новости', href: '/student/news', icon: Newspaper },
    { label: 'Расписание', href: '/student/schedule', icon: Calendar },
    { label: 'Оценки', href: '/student/grades', icon: BarChart2 },
    { label: 'Библиотека', href: '/student/library', icon: Library },
    { label: 'Материалы', href: '/student/exchange', icon: ArrowLeftRight },
    { label: 'Магазин', href: '/student/shop', icon: ShoppingBag },
    { label: 'Профиль', href: '/student/profile', icon: User },
  ],
  teacher: [
    { label: 'Главная', href: '/teacher', icon: LayoutDashboard },
    { label: 'Новости', href: '/teacher/news', icon: Newspaper },
    { label: 'Расписание', href: '/teacher/schedule', icon: Calendar },
    { label: 'Студенты', href: '/teacher/students', icon: Users },
    { label: 'Оценки', href: '/teacher/grades', icon: BarChart2 },
    { label: 'Материалы', href: '/teacher/materials', icon: FileText },
    { label: 'Профиль', href: '/teacher/profile', icon: User },
  ],
  admin: [
    { label: 'Главная', href: '/admin', icon: LayoutDashboard },
    { label: 'Новости', href: '/admin/news', icon: Newspaper },
    { label: 'Расписание', href: '/admin/schedule', icon: Calendar },
    { label: 'Студенты', href: '/admin/students', icon: GraduationCap },
    { label: 'Преподаватели', href: '/admin/teachers', icon: Users },
    { label: 'Магазин', href: '/admin/shop', icon: ShoppingBag },
    { label: 'Пользователи', href: '/admin/users', icon: ShieldCheck },
    { label: 'Настройки', href: '/admin/settings', icon: Settings },
  ],
};

const roleLabel = { student: 'Студент', teacher: 'Преподаватель', admin: 'Администратор' };
const roleIcon = { student: GraduationCap, teacher: BookOpen, admin: ShieldCheck };

export default function DarkLayout({ children, role }: DarkLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const u = await getCurrentUser();
      if (!u) { router.push('/login'); return; }
      if (u.user_metadata?.role !== role) {
        router.push(`/${u.user_metadata?.role || 'login'}`);
        return;
      }
      setUser(u);
      setLoading(false);
    }
    checkAuth();
  }, [role, router]);

  async function handleLogout() {
    await signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = navConfig[role];
  const RoleIcon = roleIcon[role];

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <Link href="/" className="font-black italic text-lg tracking-tighter uppercase">
          Narxoz <span className="text-red-600">College</span>
        </Link>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center shadow-[0_0_8px_rgba(220,38,38,0.3)]">
            <RoleIcon size={12} className="text-red-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{roleLabel[role]}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-red-600/30 scrollbar-track-transparent">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <motion.div
                whileHover={{ x: active ? 0 : 4 }}
                transition={{ duration: 0.15 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all group ${
                  active
                    ? 'bg-red-600/10 text-red-500 border border-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.15)]'
                    : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {/* Active left border glow */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                )}
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  active
                    ? 'bg-red-600/20 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                    : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
                }`}>
                  <Icon size={13} className={active ? 'text-red-500' : 'text-gray-600 group-hover:text-white'} />
                </div>
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="px-3 py-2.5 mb-1 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-[10px] font-black italic uppercase tracking-tight text-white truncate">{user?.user_metadata?.name || 'Пользователь'}</p>
          <p className="text-[9px] text-gray-600 truncate font-mono mt-0.5">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-500 hover:bg-red-600/5 border border-transparent hover:border-red-600/10 transition-all"
        >
          <div className="w-6 h-6 rounded-lg bg-white/[0.03] flex items-center justify-center">
            <LogOut size={13} />
          </div>
          Выйти
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-red-600 flex">

      {/* SIDEBAR - desktop */}
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-full border-r border-white/5 bg-black/40 backdrop-blur-xl z-50">
        <SidebarContent />
      </aside>

      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-black/60 px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-black italic tracking-tighter uppercase">
          Narxoz <span className="text-red-600">College</span>
        </Link>
        <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-1.5 hover:border-red-600/30 transition-colors">
          <span className="w-4 h-px bg-white block" />
          <span className="w-4 h-px bg-white block" />
          <span className="w-3 h-px bg-red-500 block" />
        </button>
      </header>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-64 z-[61] bg-[#080808] border-r border-white/5 flex flex-col lg:hidden"
            >
              <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
                <span className="font-black italic tracking-tighter uppercase">
                  Narxoz <span className="text-red-600">College</span>
                </span>
                <button onClick={() => setSidebarOpen(false)} className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all text-xs">✕</button>
              </div>
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT with page transition */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="max-w-7xl mx-auto px-4 md:px-8 py-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
