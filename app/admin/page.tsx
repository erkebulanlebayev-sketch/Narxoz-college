'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.user_metadata?.role !== 'admin') {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="admin" userName={user?.user_metadata?.name} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Обзор
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-3 font-semibold ${activeTab === 'schedule' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Расписание
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-6 py-3 font-semibold ${activeTab === 'students' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Студенты
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-6 py-3 font-semibold ${activeTab === 'teachers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Учителя
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Панель администратора</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Всего студентов</h3>
                    <p className="text-4xl font-bold">156</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Учителей</h3>
                    <p className="text-4xl font-bold">24</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Групп</h3>
                    <p className="text-4xl font-bold">12</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Управление расписанием</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4">
                  Добавить занятие
                </button>
                <p className="text-gray-600">Здесь будет форма создания расписания</p>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Управление студентами</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mb-4">
                  Добавить студента
                </button>
                <p className="text-gray-600">Список студентов и их GPA</p>
              </div>
            )}

            {activeTab === 'teachers' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Управление учителями</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 mb-4">
                  Добавить учителя
                </button>
                <p className="text-gray-600">Список учителей и их предметов</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
