'use client';

import { useState } from 'react';
import UniversalLayout from '@/components/UniversalLayout';

export default function AdminUsersPage() {
  const [selectedRole, setSelectedRole] = useState('all');

  const users = [
    { id: 1, name: 'Алексеев Алексей', email: 'alexeev@narxoz.kz', role: 'student', status: 'active', lastLogin: '2024-02-20' },
    { id: 2, name: 'Иванов Иван Иванович', email: 'ivanov@narxoz.kz', role: 'teacher', status: 'active', lastLogin: '2024-02-21' },
    { id: 3, name: 'Петрова Анна', email: 'petrova@narxoz.kz', role: 'admin', status: 'active', lastLogin: '2024-02-21' },
    { id: 4, name: 'Борисова Мария', email: 'borisova@narxoz.kz', role: 'student', status: 'active', lastLogin: '2024-02-19' },
  ];

  const roleNames = {
    student: 'Студент',
    teacher: 'Преподаватель',
    admin: 'Администратор'
  };

  const filteredUsers = users.filter(u => 
    selectedRole === 'all' || u.role === selectedRole
  );

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'student': return 'bg-gray-100 text-blue-700';
      case 'teacher': return 'bg-green-100 text-green-700';
      case 'admin': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <UniversalLayout role="admin">
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Управление пользователями</h1>
          <p className="text-gray-600">Всего пользователей: {users.length}</p>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Фильтр по роли</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Все роли</option>
              <option value="student">Студенты</option>
              <option value="teacher">Преподаватели</option>
              <option value="admin">Администраторы</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="glass-effect rounded-lg p-4 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-lg">{user.name}</p>
                        <span className={`px-2 py-1 rounded text-xs ${getRoleColor(user.role)}`}>
                          {roleNames[user.role as keyof typeof roleNames]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Последний вход: {user.lastLogin}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 text-red-600 rounded-lg hover:bg-blue-200 transition-all">
                      Просмотр
                    </button>
                    <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all">
                      Заблокировать
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UniversalLayout>
  );
}
