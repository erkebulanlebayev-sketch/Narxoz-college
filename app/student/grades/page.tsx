'use client';

import StudentLayout from '@/components/StudentLayout';

export default function GradesPage() {
  const subjects = [
    {
      name: 'Математический анализ',
      teacher: 'Иванов И.И.',
      grades: {
        lecture: [95, 88, 92, 90],
        srsp: [85, 90, 88],
        srs: [92, 87],
        midterm: 88,
        final: null
      }
    },
    {
      name: 'Программирование',
      teacher: 'Петрова А.С.',
      grades: {
        lecture: [100, 95, 98, 92],
        srsp: [95, 92, 90],
        srs: [98, 95],
        midterm: 95,
        final: null
      }
    },
    {
      name: 'Английский язык',
      teacher: 'Смирнова О.В.',
      grades: {
        lecture: [85, 88, 90, 87],
        srsp: [88, 85, 90],
        srs: [87, 89],
        midterm: 86,
        final: null
      }
    },
    {
      name: 'Физика',
      teacher: 'Козлов В.П.',
      grades: {
        lecture: [78, 82, 85, 80],
        srsp: [80, 85, 82],
        srs: [83, 81],
        midterm: 82,
        final: null
      }
    }
  ];

  const calculateAverage = (grades: any) => {
    const allGrades = [
      ...grades.lecture,
      ...grades.srsp,
      ...grades.srs,
      ...(grades.midterm ? [grades.midterm] : []),
      ...(grades.final ? [grades.final] : [])
    ];
    return (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 75) return 'text-blue-600';
    if (grade >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalAverage = (
    subjects.reduce((sum, subject) => sum + parseFloat(calculateAverage(subject.grades)), 0) / subjects.length
  ).toFixed(2);

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            📊 Мои оценки
          </h1>
          <p className="text-gray-600">Успеваемость по всем предметам</p>
        </div>

        {/* Общий средний балл */}
        <div className="glass-card p-6 text-center">
          <div className="text-6xl mb-2">🎯</div>
          <h2 className="text-2xl font-bold mb-2">Общий средний балл</h2>
          <div className={`text-5xl font-bold ${getGradeColor(parseFloat(totalAverage))}`}>
            {totalAverage}
          </div>
          <div className="mt-4 flex justify-center gap-4 text-sm">
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
          </div>
        </div>

        {/* Оценки по предметам */}
        <div className="grid gap-6">
          {subjects.map((subject, idx) => {
            const avg = calculateAverage(subject.grades);
            return (
              <div key={idx} className="glass-card p-6 hover:scale-[1.02] transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold gradient-text">{subject.name}</h3>
                    <p className="text-gray-600 text-sm">Преподаватель: {subject.teacher}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Средний балл</div>
                    <div className={`text-3xl font-bold ${getGradeColor(parseFloat(avg))}`}>
                      {avg}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Лекции */}
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-2">📚 Лекции</div>
                    <div className="flex flex-wrap gap-2">
                      {subject.grades.lecture.map((grade, i) => (
                        <span key={i} className={`text-sm font-semibold ${getGradeColor(grade)}`}>
                          {grade}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* СРСП */}
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-2">✍️ СРСП</div>
                    <div className="flex flex-wrap gap-2">
                      {subject.grades.srsp.map((grade, i) => (
                        <span key={i} className={`text-sm font-semibold ${getGradeColor(grade)}`}>
                          {grade}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* СРС */}
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-2">📝 СРС</div>
                    <div className="flex flex-wrap gap-2">
                      {subject.grades.srs.map((grade, i) => (
                        <span key={i} className={`text-sm font-semibold ${getGradeColor(grade)}`}>
                          {grade}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Экзамены */}
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-2">🎓 Экзамены</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Рубежный:</span>
                        <span className={`font-semibold ${getGradeColor(subject.grades.midterm)}`}>
                          {subject.grades.midterm}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Итоговый:</span>
                        <span className="text-gray-400">
                          {subject.grades.final || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Прогресс бар */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
                      style={{ width: `${parseFloat(avg)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}
