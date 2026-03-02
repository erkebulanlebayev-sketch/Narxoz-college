'use client';

import { useState, useEffect } from 'react';
import StudentLayout from '@/components/StudentLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

interface Grade {
  id: number;
  subject: string;
  grade_type: string;
  grade: number;
  comment?: string;
  created_at: string;
  teachers?: { name: string };
}

interface SubjectGrades {
  subject: string;
  teacher: string;
  grades: {
    lecture: number[];
    srsp: number[];
    srs: number[];
    midterm: number[];
    final: number[];
  };
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [gpa, setGpa] = useState(0);

  useEffect(() => {
    loadGrades();

    // Real-time подписка на оценки
    const gradesChannel = supabase
      .channel('student-grades-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'grades' },
        (payload) => {
          console.log('✅ Оценки обновлены через Realtime!', payload);
          loadGrades();
        }
      )
      .subscribe();

    // Fallback: обновление каждые 10 секунд
    const interval = setInterval(loadGrades, 10000);

    return () => {
      supabase.removeChannel(gradesChannel);
      clearInterval(interval);
    };
  }, []);

  async function loadGrades() {
    try {
      const user = await getCurrentUser();
      
      // Получить ID студента
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('email', user?.email)
        .single();

      if (!studentData) {
        setLoading(false);
        return;
      }

      // Загрузить оценки студента
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          teachers (name)
        `)
        .eq('student_id', studentData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGrades(data || []);
      calculateGPA(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки оценок:', error);
      setLoading(false);
    }
  }

  function calculateGPA(allGrades: Grade[]) {
    if (allGrades.length === 0) {
      setGpa(0);
      return;
    }

    const total = allGrades.reduce((sum, g) => sum + g.grade, 0);
    setGpa(Number((total / allGrades.length).toFixed(2)));
  }

  function groupGradesBySubject(): SubjectGrades[] {
    const grouped: { [key: string]: SubjectGrades } = {};

    grades.forEach(grade => {
      if (!grouped[grade.subject]) {
        grouped[grade.subject] = {
          subject: grade.subject,
          teacher: grade.teachers?.name || 'Преподаватель',
          grades: {
            lecture: [],
            srsp: [],
            srs: [],
            midterm: [],
            final: []
          }
        };
      }

      const type = grade.grade_type as keyof SubjectGrades['grades'];
      if (grouped[grade.subject].grades[type]) {
        grouped[grade.subject].grades[type].push(grade.grade);
      }
    });

    return Object.values(grouped);
  }

  function calculateSubjectAverage(subjectGrades: SubjectGrades['grades']): string {
    const allGrades = [
      ...subjectGrades.lecture,
      ...subjectGrades.srsp,
      ...subjectGrades.srs,
      ...subjectGrades.midterm,
      ...subjectGrades.final
    ];

    if (allGrades.length === 0) return '0.0';
    return (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1);
  }

  function getGradeColor(grade: number): string {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 75) return 'text-blue-600';
    if (grade >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl gradient-text font-bold">Загрузка оценок...</p>
        </div>
      </StudentLayout>
    );
  }

  const subjectGrades = groupGradesBySubject();

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            📊 Мои оценки
          </h1>
          <p className="text-gray-600">Успеваемость по всем предметам</p>
        </div>

        {/* Общий средний балл (GPA) */}
        <div className="ferris-card p-6 text-center shadow-colorful">
          <div className="text-6xl mb-2">🎯</div>
          <h2 className="text-2xl font-bold mb-2">Общий средний балл (GPA)</h2>
          <div className={`text-5xl font-bold ${getGradeColor(gpa)}`}>
            {gpa}
          </div>
          <div className="mt-4 flex justify-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>90-100: Отлично</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>75-89: Хорошо</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>60-74: Удовл.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>&lt;60: Неуд.</span>
            </div>
          </div>
        </div>

        {/* Оценки по предметам */}
        {subjectGrades.length === 0 ? (
          <div className="ferris-card p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl text-gray-600">Оценки пока не выставлены</p>
            <p className="text-gray-500 mt-2">Ваши оценки появятся здесь, когда преподаватели их выставят</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {subjectGrades.map((subject, idx) => {
              const avg = calculateSubjectAverage(subject.grades);
              return (
                <div 
                  key={idx} 
                  className="ferris-card p-6 hover-lift"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-black">{subject.subject}</h3>
                      <p className="text-gray-600 text-sm">Преподаватель: {subject.teacher}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Средний балл</div>
                      <div className={`text-3xl font-bold ${getGradeColor(parseFloat(avg))}`}>
                        {avg}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {/* Лекции */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-2 font-bold">📚 Лекции</div>
                      <div className="flex flex-wrap gap-2">
                        {subject.grades.lecture.length > 0 ? (
                          subject.grades.lecture.map((grade, i) => (
                            <span key={i} className={`text-sm font-semibold ${getGradeColor(grade)}`}>
                              {grade}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </div>

                    {/* СРСП */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-2 font-bold">✍️ СРСП</div>
                      <div className="flex flex-wrap gap-2">
                        {subject.grades.srsp.length > 0 ? (
                          subject.grades.srsp.map((grade, i) => (
                            <span key={i} className={`text-sm font-semibold ${getGradeColor(grade)}`}>
                              {grade}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </div>

                    {/* СРС */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-2 font-bold">📝 СРС</div>
                      <div className="flex flex-wrap gap-2">
                        {subject.grades.srs.length > 0 ? (
                          subject.grades.srs.map((grade, i) => (
                            <span key={i} className={`text-sm font-semibold ${getGradeColor(grade)}`}>
                              {grade}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </div>

                    {/* Рубежный */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-2 font-bold">📊 Рубежный</div>
                      <div className="flex flex-wrap gap-2">
                        {subject.grades.midterm.length > 0 ? (
                          subject.grades.midterm.map((grade, i) => (
                            <span key={i} className={`text-sm font-semibold ${getGradeColor(grade)}`}>
                              {grade}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </div>

                    {/* Экзамен */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-2 font-bold">🎓 Экзамен</div>
                      <div className="flex flex-wrap gap-2">
                        {subject.grades.final.length > 0 ? (
                          subject.grades.final.map((grade, i) => (
                            <span key={i} className={`text-sm font-semibold ${getGradeColor(grade)}`}>
                              {grade}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Прогресс бар */}
                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                        style={{ width: `${parseFloat(avg)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Статистика */}
        {grades.length > 0 && (
          <div className="ferris-card p-6">
            <h2 className="text-2xl font-bold gradient-text mb-4">📈 Статистика</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">{grades.length}</div>
                <div className="text-sm text-gray-600">Всего оценок</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">
                  {grades.filter(g => g.grade >= 90).length}
                </div>
                <div className="text-sm text-gray-600">Отлично (90+)</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">
                  {grades.filter(g => g.grade >= 75 && g.grade < 90).length}
                </div>
                <div className="text-sm text-gray-600">Хорошо (75-89)</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600">{subjectGrades.length}</div>
                <div className="text-sm text-gray-600">Предметов</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
