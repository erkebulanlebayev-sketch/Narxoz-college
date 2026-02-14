'use client';

import { useRouter, usePathname } from 'next/navigation';
import { signOut } from '@/lib/auth';
import Link from 'next/link';

interface NavbarProps {
  role: string;
  userName?: string;
}

export default function Navbar({ role, userName }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await signOut();
    router.push('/login');
  }

  const roleNames = {
    admin: 'Администратор',
    teacher: 'Преподаватель',
    student: 'Студент',
  };

  const getMenuItems = () => {
    const baseItems = [
      { href: `/${role}`, label: 'Главная', icon: '🏠' },
      { href: `/${role}/news`, label: 'Новости', icon: '📰' },
      { href: `/${role}/schedule`, label: 'Расписание', icon: '📅' },
    ];

    if (role === 'student') {
      baseItems.push(
        { href: `/${role}/grades`, label: 'Оценки', icon: '📊' },
        { href: `/${role}/library`, label: 'Библиотека', icon: '📚' }
      );
    } else if (role === 'teacher') {
      baseItems.push(
        { href: `/${role}/students`, label: 'Студенты', icon: '👥' },
        { href: `/${role}/materials`, label: 'Материалы', icon: '📁' }
      );
    } else if (role === 'admin') {
      baseItems.push(
        { href: `/${role}/users`, label: 'Пользователи', icon: '👥' },
        { href: `/${role}/settings`, label: 'Настройки', icon: '⚙️' }
      );
    }

    return baseItems;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎓</div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Narxoz College
              </h1>
              <p className="text-xs text-gray-500">{roleNames[role as keyof typeof roleNames]}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {getMenuItems().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {userName && (
              <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg">
                <span className="text-xl">👤</span>
                <span className="font-medium text-gray-700">{userName}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all hover:scale-105 font-medium"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
          {getMenuItems().map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                pathname === item.href
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
