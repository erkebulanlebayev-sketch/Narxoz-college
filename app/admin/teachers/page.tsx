'use client';

import { useState } from 'react';
import UniversalLayout from '@/components/UniversalLayout';

export default function AdminTeachersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const teachers = [
    { id: 1, name: 'Иванов Иван Иванович', email: 'ivanov@narxoz.kz', subjects: ['Математика', 'Алгебра'], groups: 3, status: 'active' },
    { id: 2, name: 'Петрова Анна Сергеевна', email: 'petrova@narxoz.kz', subjects: ['Физика'], groups: 2, status: 'active' },
    { id: 3, name: 'Сидоров Петр Константинович', email: 'sidorov@narxoz.kz', subjects: ['Информатика', 'Программирование'], groups: 4, status: 'active' },
  ];

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UniversalLayout role="admin">
      <div className="animate-fadeIn">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Управление учителями</h1>
            <p className="text-gray-600">Всего преподавателей: {teachers.length}</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            + Добавить учителя
          </button>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-3">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="glass-effect rounded-lg p-4 hover:shadow-lg transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{teacher.name}</p>
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {teacher.subjects.map((subject, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            {subject}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Групп: {teacher.groups}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all">
                      Просмотр
                    </button>
                    <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all">
                      Редактировать
                    </button>
                    <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all">
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Добавить учителя</h2>
              <div className="space-y-4">
                <input type="text" placeholder="ФИО" className="w-full px-4 py-2 border rounded-lg" />
                <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg" />
                <input type="text" placeholder="Предметы (через запятую)" className="w-full px-4 py-2 border rounded-lg" />
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Отмена
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg">
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UniversalLayout>
  );
}
