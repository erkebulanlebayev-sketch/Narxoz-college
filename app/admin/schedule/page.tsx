'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';

interface Schedule {
  id: number;
  day: number; // Изменено с day_of_week на day
  start_time: string;
  end_time: string;
  subject: string;
  teacher_id?: number;
  group_name: string;
  room: string;
}

interface Teacher {
  id: number;
  name: string;
}

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    day_of_week: 0,
    start_time: '09:00',
    end_time: '10:30',
    subject: '',
    teacher_id: '',
    group_name: '',
    room: ''
  });

  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

  useEffect(() => {
    loadData();

    // Real-time подписка
    const channel = supabase
      .channel('schedule-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedule' },
        () => {
          console.log('✅ Расписание обновлено через Realtime!');
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadData() {
    try {
      // Загрузка расписания
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('schedule')
        .select('*')
        .order('day') // Изменено с day_of_week на day
        .order('start_time');

      console.log('📥 Загружено занятий:', scheduleData?.length || 0); // Отладка
      
      if (scheduleError) {
        console.error('❌ Ошибка загрузки расписания:', scheduleError);
        throw scheduleError;
      }
      setSchedule(scheduleData || []);

      // Загрузка учителей
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('id, name')
        .order('name');

      if (teachersError) throw teachersError;
      setTeachers(teachersData || []);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = {
        day: Number(formData.day_of_week),
        start_time: formData.start_time,
        end_time: formData.end_time,
        subject: formData.subject,
        teacher_id: formData.teacher_id ? Number(formData.teacher_id) : null,
        group_name: formData.group_name,
        room: formData.room
      };

      console.log('📤 Отправляем данные:', data);

      if (editingItem) {
        const { data: result, error } = await supabase
          .from('schedule')
          .update(data)
          .eq('id', editingItem.id)
          .select();

        console.log('📥 Результат обновления:', result, error);
        if (error) throw error;
        alert('✅ Занятие обновлено!');
      } else {
        const { data: result, error } = await supabase
          .from('schedule')
          .insert([data])
          .select();

        console.log('📥 Результат добавления:', result, error);
        if (error) throw error;
        
        if (!result || result.length === 0) {
          throw new Error('Данные не были добавлены в базу');
        }
        
        alert('✅ Занятие добавлено!');
      }

      setFormData({
        day_of_week: 0,
        start_time: '09:00',
        end_time: '10:30',
        subject: '',
        teacher_id: '',
        group_name: '',
        room: ''
      });
      setShowModal(false);
      setEditingItem(null);
      loadData(); // Перезагрузить данные
      loadData();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить это занятие?')) return;

    try {
      const { error } = await supabase
        .from('schedule')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('✅ Занятие удалено!');
      loadData();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    }
  }

  function handleEdit(item: Schedule) {
    setEditingItem(item);
    setFormData({
      day_of_week: item.day, // Изменено с item.day_of_week на item.day
      start_time: item.start_time,
      end_time: item.end_time,
      subject: item.subject,
      teacher_id: item.teacher_id?.toString() || '',
      group_name: item.group_name,
      room: item.room
    });
    setShowModal(true);
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

  return (
    <UniversalLayout role="admin">
      <div className="animate-fadeIn">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              🗓️ Управление расписанием
            </h1>
            <p className="text-gray-600">Создание и редактирование расписания занятий</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({
                day_of_week: 0,
                start_time: '09:00',
                end_time: '10:30',
                subject: '',
                teacher_id: '',
                group_name: '',
                room: ''
              });
              setShowModal(true);
            }}
            className="btn-primary"
          >
            ➕ Добавить занятие
          </button>
        </div>

        {/* Расписание по дням */}
        <div className="space-y-6">
          {days.map((day, dayIndex) => {
            const daySchedule = schedule.filter(s => s.day === dayIndex); // Изменено с day_of_week на day
            
            if (daySchedule.length === 0) return null;

            return (
              <div key={dayIndex} className="ferris-card p-6 shadow-colorful">
                <h2 className="text-2xl font-bold gradient-text mb-4">{day}</h2>
                <div className="space-y-3">
                  {daySchedule.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-xl border-2 border-gray-100 hover:border-purple-300 transition-all"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-purple-600">
                              {item.start_time} - {item.end_time}
                            </span>
                            <span className="badge">{item.group_name}</span>
                            <span className="badge badge-secondary">🚪 {item.room}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {item.subject}
                          </h3>
                          {item.teacher_id && (
                            <p className="text-gray-600">
                              👤 {teachers.find(t => t.id === item.teacher_id)?.name || 'Преподаватель'}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg font-bold hover:bg-blue-200 transition-all"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-all"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {schedule.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600 text-lg">Расписание пусто. Добавьте первое занятие!</p>
          </div>
        )}

        {/* Модальное окно */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold gradient-text mb-4">
                {editingItem ? '✏️ Редактировать занятие' : '➕ Новое занятие'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      День недели
                    </label>
                    <select
                      value={formData.day_of_week}
                      onChange={(e) => setFormData({ ...formData, day_of_week: Number(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    >
                      {days.map((day, index) => (
                        <option key={index} value={index}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Предмет
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Время начала
                    </label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Время окончания
                    </label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Группа
                    </label>
                    <input
                      type="text"
                      value={formData.group_name}
                      onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                      placeholder="ИС-21-1"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Аудитория
                    </label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      placeholder="301"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Преподаватель (опционально)
                    </label>
                    <select
                      value={formData.teacher_id}
                      onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    >
                      <option value="">Не выбран</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                    }}
                    className="flex-1 btn-secondary"
                  >
                    ❌ Отмена
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    {editingItem ? '💾 Сохранить' : '➕ Добавить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </UniversalLayout>
  );
}
