'use client';

import { useState } from 'react';
import UniversalLayout from '@/components/UniversalLayout';

export default function TeacherStudentsPage() {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const students = [
    { id: 1, name: 'Алексеев Алексей', group: 'ИС-21', gpa: 3.8, attendance: 92 },
    { id: 2, name: 'Борисова Мария', group: 'ИС-21', gpa: 3.9, attendance: 95 },
    { id: 3, name: 'Васильев Иван', group: 'ПО-22', gpa: 3.5, attendance: 88 },
    { id: 4, name: 'Григорьева Анна', group: 'ИС-22', gpa: 4.0, attendance: 98 },
    { id: 5, name: 'Дмитриев Петр', group: 'ПО-22', gpa: 3.6, attendance: 90 },
  ];

  const groups = ['all', ...Array.from(new Set(students.map(s => s.group)))];

  const filteredStudents = students.filter(s => 
    (selectedGroup === 'all' || s.group === selectedGroup) &&
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UniversalLayout role="teacher">
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Студенты</h1>
          <p className="text-gray-600">Управление списком студентов</p>
        </div>

        <div className="ferris-card rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Поиск студента..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Все группы</option>
              {groups.filter(g => g !== 'all').map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <div key={student.id} className="ferris-card rounded-lg p-4 hover:shadow-lg transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{student.name}</p>
                      <p className="text-sm text-gray-600">Группа: {student.group}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">GPA</p>
                      <p className="text-xl font-bold text-green-600">{student.gpa}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Посещаемость</p>
                      <p className="text-xl font-bold text-red-600">{student.attendance}%</p>
                    </div>
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
