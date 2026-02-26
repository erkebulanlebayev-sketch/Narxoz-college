'use client';

import { useState } from 'react';
import UniversalLayout from '@/components/UniversalLayout';

export default function TeacherMaterialsPage() {
  const [selectedSubject, setSelectedSubject] = useState('all');

  const materials = [
    { id: 1, title: 'Лекция 1: Введение в математику', subject: 'Математика', type: 'Лекция', date: '2024-01-15', size: '2.5 MB' },
    { id: 2, title: 'Практическое задание 1', subject: 'Математика', type: 'Задание', date: '2024-01-16', size: '1.2 MB' },
    { id: 3, title: 'Лекция 1: Основы алгебры', subject: 'Алгебра', type: 'Лекция', date: '2024-01-17', size: '3.1 MB' },
    { id: 4, title: 'Контрольная работа 1', subject: 'Математика', type: 'Тест', date: '2024-01-18', size: '0.8 MB' },
  ];

  const subjects = ['all', ...Array.from(new Set(materials.map(m => m.subject)))];

  const filteredMaterials = materials.filter(m => 
    selectedSubject === 'all' || m.subject === selectedSubject
  );

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Лекция': return 'from-blue-500 to-indigo-500';
      case 'Задание': return 'from-green-500 to-emerald-500';
      case 'Тест': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <UniversalLayout role="teacher">
      <div className="animate-fadeIn">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Учебные материалы</h1>
            <p className="text-gray-600">Управление материалами и заданиями</p>
          </div>
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all">
            + Добавить материал
          </button>
        </div>

        <div className="ferris-card rounded-xl p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Фильтр по предмету</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Все предметы</option>
              {subjects.filter(s => s !== 'all').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="ferris-card rounded-lg p-4 hover:shadow-lg transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(material.type)} rounded-lg flex items-center justify-center text-white font-bold`}>
                      📄
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{material.title}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                        <span>📚 {material.subject}</span>
                        <span>📅 {material.date}</span>
                        <span>💾 {material.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 text-red-600 rounded-lg hover:bg-blue-200 transition-all">
                      Просмотр
                    </button>
                    <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all">
                      Редактировать
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
