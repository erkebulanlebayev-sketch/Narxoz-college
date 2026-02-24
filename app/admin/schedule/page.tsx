'use client';

import { useState } from 'react';
import UniversalLayout from '@/components/UniversalLayout';

export default function AdminSchedulePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('all');

  const schedule = [
    { id: 1, day: 'Понедельник', time: '09:00-10:30', subject: 'Математика', teacher: 'Иванов И.И.', group: 'ИС-21', room: 'А-101' },
    { id: 2, day: 'Понедельник', time: '10:45-12:15', subject: 'Физика', teacher: 'Петрова А.С.', group: 'ПО-22', room: 'Б-201' },
    { id: 3, day: 'Вторник', time: '09:00-10:30', subject: 'Информатика', teacher: 'Сидоров П.К.', group: 'ИС-22', room: 'А-102' },
    { id: 4, day: 'Среда', time: '10:45-12:15', subject: 'Алгебра', teacher: 'Иванов И.И.', group: 'ИС-21', room: 'А-101' },
  ];

  const days = ['all', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];

  const filteredSchedule = schedule.filter(s => 
    selectedDay === 'all' || s.day === selectedDay
  );

  return (
    <UniversalLayout role="admin">
      <div className="animate-fadeIn">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Управление расписанием</h1>
            <p className="text-gray-600">Создание и редактирование расписания занятий</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            + Добавить занятие
          </button>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Фильтр по дню недели</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Все дни</option>
              {days.filter(d => d !== 'all').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {filteredSchedule.map((lesson) => (
              <div key={lesson.id} className="glass-effect rounded-lg p-4 hover:shadow-lg transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
                        {lesson.day}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-blue-700 rounded-lg text-sm font-semibold">
                        {lesson.time}
                      </span>
                    </div>
                    <p className="font-bold text-lg">{lesson.subject}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                      <span>👨‍🏫 {lesson.teacher}</span>
                      <span>👥 {lesson.group}</span>
                      <span>🚪 {lesson.room}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
              <h2 className="text-2xl font-bold mb-4">Добавить занятие</h2>
              <div className="space-y-4">
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option>День недели</option>
                  {days.filter(d => d !== 'all').map(d => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <input type="time" className="w-full px-4 py-2 border rounded-lg" />
                <input type="text" placeholder="Предмет" className="w-full px-4 py-2 border rounded-lg" />
                <input type="text" placeholder="Преподаватель" className="w-full px-4 py-2 border rounded-lg" />
                <input type="text" placeholder="Группа" className="w-full px-4 py-2 border rounded-lg" />
                <input type="text" placeholder="Аудитория" className="w-full px-4 py-2 border rounded-lg" />
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
