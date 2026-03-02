'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';

interface Student {
  id: number;
  name: string;
  email: string;
  group_name: string;
  created_at: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('all');

  useEffect(() => {
    loadStudents();

    // Real-time подписка на студентов
    const channel = supabase
      .channel('admin-students-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        () => {
          console.log('✅ Студенты обновлены через Realtime!');
          loadStudents();
        }
      )
      .subscribe();

    // Fallback: обновление каждые 10 секунд
    const interval = setInterval(loadStudents, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  async function loadStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) throw error;
      setStudents(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки студентов:', error);
      setLoading(false);
    }
  }

  const groups = ['all', ...Array.from(new Set(students.map(s => s.group_name)))];
  const filteredStudents = students.filter(s => 
    selectedGroup === 'all' || s.group_name === selectedGroup
  );

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
            👨‍🎓 Студенты
          </h1>
          <p className="text-gray-600">Всего студентов: {students.length}</p>
        </div>

        {/* Фильтр по группе */}
        {groups.length > 1 && (
          <div className="ferris-card p-4 mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Фильтр по группе
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="all">Все группы</option>
              {groups.filter(g => g !== 'all').map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        )}

        {/* Список студентов */}
        {filteredStudents.length === 0 ? (
          <div className="ferris-card p-12 text-center">
            <div className="text-6xl mb-4">👨‍🎓</div>
            <h3 className="text-2xl font-bold mb-2">Студенты не найдены</h3>
            <p className="text-gray-600">Добавьте студентов в систему</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredStudents.map((student, index) => (
              <div
                key={student.id}
                className="ferris-card p-6 hover-lift animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
                          {student.group_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          Добавлен: {new Date(student.created_at).toLocaleDateString('ru-RU')}
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
