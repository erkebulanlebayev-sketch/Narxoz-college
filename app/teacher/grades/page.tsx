'use client';

import { useState } from 'react';
import UniversalLayout from '@/components/UniversalLayout';

export default function TeacherGradesPage() {
  const [selectedGroup, setSelectedGroup] = useState('ИС-21');
  const [selectedSubject, setSelectedSubject] = useState('Математика');
  const [gradeType, setGradeType] = useState('lecture');

  const students = [
    { id: 1, name: 'Алексеев Алексей', group: 'ИС-21', grades: { lecture: 85, srsp: 90, srs: 88, session: 92 } },
    { id: 2, name: 'Борисова Мария', group: 'ИС-21', grades: { lecture: 92, srsp: 95, srs: 90, session: 94 } },
    { id: 3, name: 'Васильев Иван', group: 'ИС-21', grades: { lecture: 78, srsp: 82, srs: 80, session: 85 } },
  ];

  const gradeTypes = [
    { value: 'lecture', label: 'Лекция' },
    { value: 'srsp', label: 'СРСП' },
    { value: 'srs', label: 'СРС' },
    { value: 'session', label: 'Сессия' }
  ];

  function handleGradeChange(studentId: number, value: string) {
    console.log(`Изменена оценка для студента ${studentId}: ${value}`);
  }

  return (
    <UniversalLayout role="teacher">
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Управление оценками</h1>
          <p className="text-gray-600">Выставление и редактирование оценок</p>
        </div>

        <div className="glass-effect rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Группа</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="ИС-21">ИС-21</option>
                <option value="ПО-22">ПО-22</option>
                <option value="ИС-22">ИС-22</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Предмет</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Математика">Математика</option>
                <option value="Алгебра">Алгебра</option>
                <option value="Физика">Физика</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Тип оценки</label>
              <select
                value={gradeType}
                onChange={(e) => setGradeType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {gradeTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="glass-effect rounded-lg p-4 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-lg">{student.name}</p>
                    <p className="text-sm text-gray-600">Группа: {student.group}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Текущая оценка</p>
                      <p className="text-2xl font-bold text-green-600">
                        {student.grades[gradeType as keyof typeof student.grades]}
                      </p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Новая оценка"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleGradeChange(student.id, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                      Сохранить
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
