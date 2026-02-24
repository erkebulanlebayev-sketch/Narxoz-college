'use client';

interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  auditory: string;
}

interface ScheduleTableProps {
  schedule: ScheduleItem[];
  selectedDay?: string;
}

export default function ScheduleTable({ schedule, selectedDay }: ScheduleTableProps) {
  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  
  const filteredSchedule = selectedDay 
    ? schedule.filter(item => item.day === selectedDay)
    : schedule;

  const groupedByDay = filteredSchedule.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Расписание</h2>
      
      {days.map(day => {
        const daySchedule = groupedByDay[day] || [];
        if (daySchedule.length === 0 && selectedDay) return null;
        
        return (
          <div key={day} className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-red-600">{day}</h3>
            <div className="space-y-2">
              {daySchedule.length > 0 ? (
                daySchedule.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">{item.subject}</p>
                        <p className="text-gray-600">Преподаватель: {item.teacher}</p>
                        <p className="text-gray-600">Аудитория: {item.auditory}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">Нет занятий</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
