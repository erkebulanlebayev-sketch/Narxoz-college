'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import StudentLayout from '@/components/StudentLayout';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }

  const profileData = {
    group: 'ИС-21-1',
    studentId: '2021001234',
    phone: '+7 (777) 123-45-67',
    birthDate: '15.03.2003',
    address: 'г. Алматы, ул. Абая 150',
    enrollmentYear: '2021',
  };

  const achievements = [
    { title: 'Отличник учебы', icon: '🏆', date: '2023' },
    { title: 'Победитель олимпиады', icon: '🥇', date: '2023' },
    { title: 'Лучший проект', icon: '💡', date: '2022' },
  ];

  return (
    <StudentLayout>
      <div className="mb-8 animate-fadeIn text-center">
        <h1 className="text-5xl font-bold mb-3 text-black">
          Мой профиль
          <span className="inline-block ml-2">👤</span>
        </h1>
        <p className="text-gray-600 text-xl">Личная информация и достижения</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="md:col-span-2 ferris-card p-8 animate-fadeIn">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-6xl shadow-lg">
              👨‍🎓
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-black mb-2">{user?.user_metadata?.name || 'Студент'}</h2>
              <p className="text-gray-600 text-lg mb-1">{user?.email}</p>
              <p className="text-gray-500">Группа: {profileData.group}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="ferris-card p-4">
              <p className="text-gray-600 text-sm mb-1">Студенческий билет</p>
              <p className="text-xl font-bold text-gray-800">{profileData.studentId}</p>
            </div>
            <div className="ferris-card p-4">
              <p className="text-gray-600 text-sm mb-1">Телефон</p>
              <p className="text-xl font-bold text-gray-800">{profileData.phone}</p>
            </div>
            <div className="ferris-card p-4">
              <p className="text-gray-600 text-sm mb-1">Дата рождения</p>
              <p className="text-xl font-bold text-gray-800">{profileData.birthDate}</p>
            </div>
            <div className="ferris-card p-4">
              <p className="text-gray-600 text-sm mb-1">Год поступления</p>
              <p className="text-xl font-bold text-gray-800">{profileData.enrollmentYear}</p>
            </div>
          </div>

          <div className="mt-6 ferris-card p-4">
            <p className="text-gray-600 text-sm mb-1">Адрес</p>
            <p className="text-lg font-medium text-gray-800">{profileData.address}</p>
          </div>
        </div>

        {/* Achievements Card */}
        <div className="ferris-card p-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-2xl font-bold text-primary mb-4">🏆 Достижения</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="ferris-card p-4 hover-lift"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div>
                    <p className="font-bold text-gray-800">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academic Performance */}
      <div className="mt-6 ferris-card p-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-2xl font-bold text-primary mb-6">📊 Академическая успеваемость</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="stat-box">
            <div className="stat-label">Средний балл</div>
            <div className="stat-number">3.8</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Посещаемость</div>
            <div className="stat-number">92%</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Сданных работ</div>
            <div className="stat-number">45</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Рейтинг в группе</div>
            <div className="stat-number">3</div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
