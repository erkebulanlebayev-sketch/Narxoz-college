'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

interface Schedule {
  id: number;
  day: number;
  start_time: string;
  end_time: string;
  subject: string;
  group_name: string;
  room: string;
}


export default function TeacherSchedulePage() {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState<string>('');

  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

  useEffect(() => {
    loadSchedule();

    // Real-time подписка
    const channel = supabase
      .channel('teacher-schedule-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedule' },
        () => {
          console.log('✅ Расписание обновлено через Realtime!');
          loadSchedule();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadSchedule() {
    try {
      const user = await getCurrentUser();
      const name = user?.user_metadata?.name || '';
      setTeacherName(name);

      // Получить ID учителя
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('id')
        .eq('email', user?.email)
        .single();

      if (!teacherData) {
        setLoading(false);
        return;
      }

      // Загрузить расписание учителя
      const { data, error } = await supabase
        .from('schedule')
        .select('*')
        .eq('teacher_id', teacherData.id)
        .order('day') // Изменено с day_of_week на day
        .order('start_time');

      if (error) throw error;
      setSchedule(data || []);
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <UniversalLayout role="teacher">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl gradient-text font-bold">Загрузка...</p>
        </div>
      </UniversalLayout>
    );
  }

  return (
    <UniversalLayout role="teacher">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">🗓️ Моё расписание</span>
          </h1>
          <p className="text-gray-600 font-medium">{teacherName}</p>
        </div>

        {/* Расписание по дням */}
        <div className="space-y-6">
          {days.map((day, dayIndex) => {
            const daySchedule = schedule.filter(s => s.day === dayIndex); // Изменено с day_of_week на day
            
            if (daySchedule.length === 0) return null;

            return (
              <div key={dayIndex} className="ferris-card p-6 shadow-colorful animate-fadeIn">
                <h2 className="text-2xl font-bold gradient-text mb-4">{day}</h2>
                <div className="space-y-3">
                  {daySchedule.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white p-5 rounded-xl border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl font-black gradient-text">
                              {item.start_time}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="text-xl font-bold text-gray-600">
                              {item.end_time}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            📚 {item.subject}
                          </h3>
                          <div className="flex items-center gap-4 text-gray-600">
                            <span className="badge">👥 {item.group_name}</span>
                            <span className="badge badge-secondary">🚪 Аудитория {item.room}</span>
                          </div>
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
            <p className="text-gray-600 text-lg">
              У вас пока нет занятий в расписании
            </p>
          </div>
        )}
      </div>
    </UniversalLayout>
  );
}
