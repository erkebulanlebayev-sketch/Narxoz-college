'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';

interface Student {
  id: number;
  name: string;
  email: string;
  group_name: string;
  gpa: number;
  created_at: string;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
  created_at: string;
}

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    name?: string;
    role?: string;
    group?: string;
  };
}

export default function AdminUsersPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'teachers'>('all');

  useEffect(() => {
    loadData();

    // Real-time подписка на изменения
    const studentsChannel = supabase
      .channel('students-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        () => {
          console.log('✅ Студенты обновлены через Realtime!');
          loadData();
        }
      )
      .subscribe();

    const teachersChannel = supabase
      .channel('teachers-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teachers' },
        () => {
          console.log('✅ Учителя обновлены через Realtime!');
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(studentsChannel);
      supabase.removeChannel(teachersChannel);
    };
  }, []);

  async function loadData() {
    try {
      // Загрузить студентов
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Загрузить учителей
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (teachersError) throw teachersError;
      setTeachers(teachersData || []);

      // Загрузить всех пользователей из auth (через admin API)
      // Примечание: это работает только если у вас есть service_role ключ
      // Альтернатива: использовать данные из students и teachers таблиц
      
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setLoading(false);
    }
  }

  async function deleteStudent(id: number, email: string) {
    if (!confirm(`Удалить студента ${email}?`)) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('✅ Студент удалён!');
      loadData();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    }
  }

  async function deleteTeacher(id: number, email: string) {
    if (!confirm(`Удалить учителя ${email}?`)) return;

    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('✅ Учитель удалён!');
      loadData();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
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

  const allUsers = [
    ...students.map(s => ({ ...s, role: 'student' as const })),
    ...teachers.map(t => ({ ...t, role: 'teacher' as const }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredUsers = activeTab === 'all' 
    ? allUsers 
    : activeTab === 'students' 
    ? students.map(s => ({ ...s, role: 'student' as const }))
    : teachers.map(t => ({ ...t, role: 'teacher' as const }));

  return (
    <UniversalLayout role="admin">
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            👥 Управление пользователями
          </h1>
          <p className="text-gray-600">Все зарегистрированные студенты и учителя</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="stat-card bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="stat-icon bg-gradient-to-br from-blue-500 to-blue-600">
              👥
            </div>
            <div className="stat-content">
              <div className="stat-value">{students.length + teachers.length}</div>
              <div className="stat-label">Всего пользователей</div>
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-green-50 to-green-100">
            <div className="stat-icon bg-gradient-to-br from-green-500 to-green-600">
              🎓
            </div>
            <div className="stat-content">
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">Студентов</div>
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="stat-icon bg-gradient-to-br from-purple-500 to-purple-600">
              👨‍🏫
            </div>
            <div className="stat-content">
              <div className="stat-value">{teachers.length}</div>
              <div className="stat-label">Учителей</div>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            👥 Все ({allUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'students'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            🎓 Студенты ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'teachers'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            👨‍🏫 Учителя ({teachers.length})
          </button>
        </div>

        {/* Список пользователей */}
        <div className="modern-card p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-600">Пользователи не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Роль</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Имя</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Email</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Доп. инфо</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Дата регистрации</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr 
                      key={`${user.role}-${user.id}`}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        {user.role === 'student' ? (
                          <span className="badge-modern-success">
                            🎓 Студент
                          </span>
                        ) : (
                          <span className="badge-modern">
                            👨‍🏫 Учитель
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        {user.name}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {user.email}
                      </td>
                      <td className="py-4 px-4">
                        {user.role === 'student' ? (
                          <div>
                            <div className="text-sm">
                              <span className="font-semibold">Группа:</span> {(user as Student).group_name}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-semibold">GPA:</span> {(user as Student).gpa.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm">
                            <span className="font-semibold">Предмет:</span> {(user as Teacher).subject || 'Не указан'}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => {
                            if (user.role === 'student') {
                              deleteStudent(user.id, user.email);
                            } else {
                              deleteTeacher(user.id, user.email);
                            }
                          }}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all text-sm"
                        >
                          🗑️ Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Информация */}
        <div className="modern-card p-6 mt-6">
          <h3 className="text-xl font-bold gradient-text mb-4">ℹ️ Информация</h3>
          <div className="space-y-2 text-gray-700">
            <p>
              • Здесь отображаются все зарегистрированные пользователи системы
            </p>
            <p>
              • Студенты автоматически добавляются при регистрации с выбором группы
            </p>
            <p>
              • Учителя добавляются администратором или при регистрации
            </p>
            <p className="text-sm text-gray-600 mt-4">
              💡 Все изменения синхронизируются в реальном времени
            </p>
          </div>
        </div>
      </div>
    </UniversalLayout>
  );
}
