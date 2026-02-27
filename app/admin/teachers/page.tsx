'use client';

import { useState } from 'react';
import UniversalLayout from '@/components/UniversalLayout';

const teachersData = [
  {
    id: 1,
    name: 'Иванов Иван Иванович',
    email: 'ivanov.teacher@narxoz.kz',
    phone: '+7 777 111 2222',
    subjects: ['Математический анализ', 'Алгебра'],
    groups: ['ИС-21-1', 'ПО-21-1', 'ИС-22-1'],
    experience: 15,
    degree: 'Кандидат наук'
  },
  {
    id: 2,
    name: 'Петрова Анна Сергеевна',
    email: 'petrova.teacher@narxoz.kz',
    phone: '+7 777 222 3333',
    subjects: ['Программирование', 'Базы данных'],
    groups: ['ИС-21-1', 'ПО-22-1'],
    experience: 10,
    degree: 'Магистр'
  },
  {
    id: 3,
    name: 'Сидоров Петр Константинович',
    email: 'sidorov.teacher@narxoz.kz',
    phone: '+7 777 333 4444',
    subjects: ['Веб-разработка', 'Мобильные приложения'],
    groups: ['ИС-21-1', 'ИС-22-1'],
    experience: 8,
    degree: 'Магистр'
  },
  {
    id: 4,
    name: 'Козлова Мария Викторовна',
    email: 'kozlova.teacher@narxoz.kz',
    phone: '+7 777 444 5555',
    subjects: ['Английский язык'],
    groups: ['ИС-21-1', 'ПО-21-1', 'ИС-22-1', 'ПО-22-1'],
    experience: 12,
    degree: 'Магистр'
  },
  {
    id: 5,
    name: 'Новиков Алексей Павлович',
    email: 'novikov.teacher@narxoz.kz',
    phone: '+7 777 555 6666',
    subjects: ['Физика', 'Математика'],
    groups: ['ИС-21-1', 'ПО-21-1'],
    experience: 20,
    degree: 'Доктор наук'
  }
];

const subjectsData = [
  { name: 'Математический анализ', groups: ['ИС-21-1', 'ПО-21-1', 'ИС-22-1'], teacher: 'Иванов И.И.' },
  { name: 'Программирование', groups: ['ИС-21-1', 'ПО-22-1'], teacher: 'Петрова А.С.' },
  { name: 'Веб-разработка', groups: ['ИС-21-1', 'ИС-22-1'], teacher: 'Сидоров П.К.' },
  { name: 'Английский язык', groups: ['ИС-21-1', 'ПО-21-1', 'ИС-22-1', 'ПО-22-1'], teacher: 'Козлова М.В.' },
  { name: 'Физика', groups: ['ИС-21-1', 'ПО-21-1'], teacher: 'Новиков А.П.' },
  { name: 'Базы данных', groups: ['ИС-21-1', 'ПО-22-1'], teacher: 'Петрова А.С.' },
  { name: 'Алгебра', groups: ['ИС-21-1', 'ПО-21-1', 'ИС-22-1'], teacher: 'Иванов И.И.' },
  { name: 'Мобильные приложения', groups: ['ИС-21-1', 'ИС-22-1'], teacher: 'Сидоров П.К.' }
];

export default function AdminTeachersPage() {
  const [activeTab, setActiveTab] = useState<'teachers' | 'subjects'>('teachers');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeachers = teachersData.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSubjects = subjectsData.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UniversalLayout role="admin">
      <div className="mb-8 animate-fadeIn text-center">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">👨‍🏫 Управление преподавателями</span>
        </h1>
        <p className="text-gray-600 text-lg font-medium">Преподаватели, предметы и группы</p>
      </div>

      {/* Табы */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all ${
            activeTab === 'teachers'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
              : 'ferris-card hover:scale-105'
          }`}
        >
          👨‍🏫 Преподаватели ({teachersData.length})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all ${
            activeTab === 'subjects'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
              : 'ferris-card hover:scale-105'
          }`}
        >
          📚 Предметы ({subjectsData.length})
        </button>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={activeTab === 'teachers' ? '🔍 Поиск преподавателя...' : '🔍 Поиск предмета...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 ferris-card rounded-xl focus:ring-2 focus:ring-purple-500 text-lg"
        />
      </div>

      {/* Преподаватели */}
      {activeTab === 'teachers' && (
        <div className="space-y-4">
          {filteredTeachers.map((teacher, index) => (
            <div
              key={teacher.id}
              className="ferris-card p-6 hover-lift animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Аватар и основная информация */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-lg flex-shrink-0">
                    👨‍🏫
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold gradient-text mb-2">{teacher.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <span>📧</span>
                        {teacher.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <span>📱</span>
                        {teacher.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <span>🎓</span>
                        {teacher.degree}
                      </p>
                      <p className="flex items-center gap-2">
                        <span>⏱️</span>
                        Стаж: {teacher.experience} лет
                      </p>
                    </div>
                  </div>
                </div>

                {/* Предметы */}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-700 mb-2">📚 Предметы:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {teacher.subjects.map((subject, idx) => (
                      <span key={idx} className="badge">
                        {subject}
                      </span>
                    ))}
                  </div>

                  <h4 className="font-bold text-gray-700 mb-2">👥 Группы:</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.groups.map((group, idx) => (
                      <span key={idx} className="badge-secondary">
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Действия */}
                <div className="flex lg:flex-col gap-2">
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

          {filteredTeachers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg">Преподаватели не найдены</p>
            </div>
          )}
        </div>
      )}

      {/* Предметы */}
      {activeTab === 'subjects' && (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSubjects.map((subject, index) => (
            <div
              key={index}
              className="ferris-card p-6 card-hover animate-fadeIn glow"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">📚</div>
                <h3 className="text-xl font-bold gradient-text mb-2">{subject.name}</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-light rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Преподаватель:</p>
                  <p className="font-bold">{subject.teacher}</p>
                </div>

                <div className="p-3 bg-light rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Группы:</p>
                  <div className="flex flex-wrap gap-2">
                    {subject.groups.map((group, idx) => (
                      <span key={idx} className="badge-secondary !text-xs">
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredSubjects.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg">Предметы не найдены</p>
            </div>
          )}
        </div>
      )}
    </UniversalLayout>
  );
}
