'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { getCurrentUser } from '@/lib/auth';

export default function TeacherProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    
    async function loadUser() {
      const currentUser = await getCurrentUser();
      if (mounted) {
        setUser(currentUser);
      }
    }
    
    loadUser();
    
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <UniversalLayout role="teacher">
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Профиль</h1>
          <p className="text-gray-600">Личная информация и настройки</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
              {user?.user_metadata?.name?.charAt(0) || 'У'}
            </div>
            <h2 className="text-xl font-bold mb-1">{user?.user_metadata?.name || 'Преподаватель'}</h2>
            <p className="text-gray-600 mb-4">{user?.email}</p>
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
              Изменить фото
            </button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Личная информация</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ФИО</label>
                  <input 
                    type="text" 
                    defaultValue={user?.user_metadata?.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Телефон</label>
                  <input 
                    type="tel" 
                    placeholder="+7 (___) ___-__-__"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Преподаваемые предметы</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">Математика</span>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">Алгебра</span>
                <button className="px-4 py-2 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-all">
                  + Добавить предмет
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all">
                Отмена
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all">
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      </div>
    </UniversalLayout>
  );
}
