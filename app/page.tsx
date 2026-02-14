'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const user = await getCurrentUser();
    if (user) {
      const role = user.user_metadata?.role;
      if (role === 'admin') router.push('/admin');
      else if (role === 'teacher') router.push('/teacher');
      else if (role === 'student') router.push('/student');
    } else {
      router.push('/login');
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  return null;
}
