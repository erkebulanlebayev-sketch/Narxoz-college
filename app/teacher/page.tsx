'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import ScheduleTable from '@/components/ScheduleTable';

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [gradeType, setGradeType] = useState('lecture');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.user_metadata?.role !== 'teacher') {
      router.push('/login');
      return;
    }

    setUser(currentUser);

    // Пример данных расписания учителя
    const mockSchedule = [
      { id: '1', day: 'Понедельник', time: '09:00-10:30', subject: 'Математика', teacher: currentUser.user_metadata?.name, auditory: '101' },
      { id: '2', day: 'Среда', time: '10:45-12:15', subject: 'Алгебра', teacher: currentUser.user_metadata?.name, auditory: '102' },
    ];
    setSchedule(mockSchedule);

    // Пример студентов
    const mockStudents = [
      { id: '1', name: 'Алексеев Алексей', group: 'ИС-21', subject: 'Математика', grades: [] },
      { id: '2', name: 'Борисова Мария', group: 'ИС-21', subject: 'Математика', grades: [] },
      { id: '3', name: 'Васильев Иван', group: 'ПО-22', subject: 'Алгебра', grades: [] },
    ];
    setStudents(mockStudents);

    setLoading(false);
  }

  function handleAddGrade(studentId: string, grade: number) {
    alert(`Оценка ${grade} добавлена студенту ${studentId} (тип: ${gradeType})`);
  }

  const filteredStudents = students.filter(s => 
    (!selectedGroup || s.group === selectedGroup) &&
    (!selectedSubject || s.subject === selectedSubject)
  );

  const groups = [...new Set(students.map(s => s.group))];
  const subjects = [...new Set(students.map(s => s.subject))];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="teacher" userName={user?.user_metadata?.name} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ScheduleTable schedule={schedule} />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Управление оценками</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Группа</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Все группы</option>
                  {groups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Предмет</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Все предметы</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Тип оценки</label>
                <select
                  value={gradeType}
                  onChange={(e) => setGradeType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="lecture">Лекция</option>
                  <option value="srsp">СРСП</option>
                  <option value="srs">СРС</option>
                  <option value="session">Сессия</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Студенты ({filteredStudents.length})</h3>
              {filteredStudents.map(student => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.group} - {student.subject}</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Оценка"
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = parseInt((e.target as HTMLInputElement).value);
                          if (value >= 0 && value <= 100) {
                            handleAddGrade(student.id, value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
