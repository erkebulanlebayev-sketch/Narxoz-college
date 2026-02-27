'use client';

import { useState } from 'react';
import UniversalLayout from '@/components/UniversalLayout';

const studentsData = [
  {
    id: 1,
    name: 'Иванов Иван Иванович',
    group: 'ИС-21-1',
    email: 'ivanov@narxoz.kz',
    phone: '+7 777 123 4567',
    gpa: 3.8,
    attendance: 92,
    status: 'active'
  },
  {
    id: 2,
    name: 'Петрова Анна Сергеевна',
    group: 'ИС-21-1',
    email: 'petrova@narxoz.kz',
    phone: '+7 777 234 5678',
    gpa: 3.9,
    attendance: 95,
    status: 'active'
  },
  {
    id: 3,
    name: 'Сидоров Петр Константинович',
    group: 'ПО-21-1',
    email: 'sidorov@narxoz.kz',
    phone: '+7 777 345 6789',
    gpa: 3.5,
    attendance: 88,
    status: 'active'
  },
  {
    id: 4,
    name: 'Козлова Мария Викторовна',
    group: 'ПО-21-1',
    email: 'kozlova@narxoz.kz',
    phone: '+7 777 456 7890',
    gpa: 4.0,
    attendance: 98,
    status: 'active'
  },
  {
    id: 5,
    name: 'Новиков Алексей Павлович',
    group: 'ИС-22-1',
    email: 'novikov@narxoz.kz',
    phone: '+7 777 567 8901',
    gpa: 3.7,
    attendance: 90,
    status: 'active'
  }
];

const groupsData = [
  {
    id: 'ИС-21-1',
    name: 'Информационные системы 21-1',
    course: 3,
    students: 25,
    curator: 'Иванов И.И.'
  },
  {
    id: 'ПО-21-1',
    name: 'Программное обеспечение 21-1',
    course: 3,
    students: 22,
    curator: 'Петрова А.С.'
  },
  {
    id: 'ИС-22-1',
    name: 'Информационные системы 22-1',
    course: 2,
    students: 28,
    curator: 'Сидоров П.К.'
  }
];

export default function AdminStudentsPage() {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = studentsData.filter(student => {
    const matchesGroup = selectedGroup === 'all' || student.group === selectedGroup;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <UniversalLayout role="admin">
      <div className="mb-8 animate-fadeIn text-center">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">👥 Управление студентами</span>
        </h1>
        <p className="text-gray-600 text-lg font-medium">Список студентов и групп</p>
      </div>

      {/* Статистика по группам */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-4">📚 Группы</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {groupsData.map((group, index) => (
            <div
              key={group.id}
              className="ferris-card p-6 card-hover animate-fadeIn glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">🎓</div>
                <h3 className="text-xl font-bold gradient-text mb-2">{group.id}</h3>
                <p className="text-gray-600 text-sm mb-3">{group.name}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-light rounded-lg">
                  <span className="text-gray-600">Курс:</span>
                  <span className="font-bold">{group.course}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-light rounded-lg">
                  <span className="text-gray-600">Студентов:</span>
                  <span className="font-bold">{group.students}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-light rounded-lg">
                  <span className="text-gray-600">Куратор:</span>
                  <span className="font-bold text-xs">{group.curator}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Фильтры */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 Поиск студента..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-6 py-4 ferris-card rounded-xl focus:ring-2 focus:ring-purple-500 text-lg"
        />
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-6 py-4 ferris-card rounded-xl focus:ring-2 focus:ring-purple-500 text-lg font-bold"
        >
          <option value="all">Все группы</option>
          {groupsData.map(group => (
            <option key={group.id} value={group.id}>{group.id}</option>
          ))}
        </select>
      </div>

      {/* Список студентов */}
      <div>
        <h2 className="text-2xl font-bold gradient-text mb-4">
          👨‍🎓 Студенты ({filteredStudents.length})
        </h2>
        <div className="space-y-4">
          {filteredStudents.map((student, index) => (
            <div
              key={student.id}
              className="ferris-card p-6 hover-lift animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Аватар */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg">
                    👨‍🎓
                  </div>
                </div>

                {/* Основная информация */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{student.name}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span>🎓</span>
                      <span className="font-semibold">{student.group}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📧</span>
                      {student.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📱</span>
                      {student.phone}
                    </span>
                  </div>
                </div>

                {/* Статистика */}
                <div className="flex gap-3">
                  <div className="stat-box !p-4 min-w-[100px]">
                    <div className="stat-label !text-xs">GPA</div>
                    <div className="stat-number !text-2xl">{student.gpa}</div>
                  </div>
                  <div className="stat-box !p-4 min-w-[100px]">
                    <div className="stat-label !text-xs">Посещаемость</div>
                    <div className="stat-number !text-2xl">{student.attendance}%</div>
                  </div>
                </div>

                {/* Действия */}
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                    ✏️
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                    👁️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">Студенты не найдены</p>
          </div>
        )}
      </div>
    </UniversalLayout>
  );
}
