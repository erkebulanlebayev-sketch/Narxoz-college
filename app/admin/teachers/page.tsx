'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject?: string;
  created_at: string;
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeachers();

    // Real-time подписка на преподавателей
    const channel = supabase
      .channel('admin-teachers-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teachers' },
        () => {
          console.log('✅ Преподаватели обновлены через Realtime!');
          loadTeachers();
        }
      )
      .subscribe();

    // Fallback: обновление каждые 10 секунд
    const interval = setInterval(loadTeachers, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  async function loadTeachers() {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name');

      if (error) throw error;
      setTeachers(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки преподавателей:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <UniversalLayout role="admin">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl gradient-text font-bold">Загрузка...</p>
        </div>
      </UniversalLayout>
    );
  }

  return (
    <UniversalLayout role="admin">
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            👨‍🏫 Преподаватели
          </h1>
          <p className="text-gray-600">Всего преподавателей: {teachers.length}</p>
        </div>

        {/* Список преподавателей */}
        {teachers.length === 0 ? (
          <div className="ferris-card p-12 text-center">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h3 className="text-2xl font-bold mb-2">Преподаватели не найдены</h3>
            <p className="text-gray-600">Добавьте преподавателей в систему</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {teachers.map((teacher, index) => (
              <div
                key={teacher.id}
                className="ferris-card p-6 hover-lift animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {teacher.subject && (
                          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
                            {teacher.subject}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          Добавлен: {new Date(teacher.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UniversalLayout>
  );
}
