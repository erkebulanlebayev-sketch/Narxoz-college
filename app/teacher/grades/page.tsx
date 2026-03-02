'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

interface Student {
  id: number;
  name: string;
  group_name: string;
  email: string;
}

interface Grade {
  id: number;
  student_id: number;
  subject: string;
  grade_type: string;
  grade: number;
  comment?: string;
  created_at: string;
  students?: { name: string; group_name: string };
}

export default function TeacherGradesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [canSubmitGrades, setCanSubmitGrades] = useState(true);
  const [settingsMessage, setSettingsMessage] = useState('');
  const [formData, setFormData] = useState({
    student_id: '',
    subject: '',
    grade_type: 'lecture',
    grade: 0,
    comment: ''
  });

  useEffect(() => {
    loadData();
    checkGradeSubmissionSettings();

    // Real-time подписка на оценки
    const gradesChannel = supabase
      .channel('teacher-grades-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'grades' },
        () => {
          console.log('✅ Оценки обновлены через Realtime!');
          loadGrades();
        }
      )
      .subscribe();

    // Real-time подписка на настройки
    const settingsChannel = supabase
      .channel('teacher-settings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        () => {
          console.log('✅ Настройки обновлены через Realtime!');
          checkGradeSubmissionSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gradesChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  async function checkGradeSubmissionSettings() {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'grade_submission_window')
        .single();

      if (error) throw error;

      const settings = data?.value as any;
      setCanSubmitGrades(settings?.enabled || false);
      setSettingsMessage(settings?.message || 'Выставление оценок закрыто');
    } catch (error) {
      console.error('Ошибка проверки настроек:', error);
    }
  }

  async function loadData() {
    await Promise.all([loadStudents(), loadGrades()]);
    setLoading(false);
  }

  async function loadStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, group_name, email')
        .order('name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Ошибка загрузки студентов:', error);
    }
  }

  async function loadGrades() {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          students (name, group_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setGrades(data || []);
    } catch (error) {
      console.error('Ошибка загрузки оценок:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Проверка настроек
    if (!canSubmitGrades) {
      alert(`🚫 ${settingsMessage}`);
      return;
    }

    try {
      const user = await getCurrentUser();
      
      // Получить ID учителя
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('id')
        .eq('email', user?.email)
        .single();

      if (!teacherData) {
        alert('Ошибка: учитель не найден');
        return;
      }

      const { error } = await supabase
        .from('grades')
        .insert([{
          student_id: Number(formData.student_id),
          teacher_id: teacherData.id,
          subject: formData.subject,
          grade_type: formData.grade_type,
          grade: Number(formData.grade),
          comment: formData.comment || null
        }]);

      if (error) throw error;

      alert('✅ Оценка выставлена!');
      setFormData({
        student_id: '',
        subject: '',
        grade_type: 'lecture',
        grade: 0,
        comment: ''
      });
      setShowModal(false);
      loadGrades();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
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
      <div className="animate-fadeIn">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              📊 Управление оценками
            </h1>
            <p className="text-gray-600">Выставление оценок студентам</p>
          </div>
          <button
            onClick={() => {
              if (!canSubmitGrades) {
                alert(`🚫 ${settingsMessage}`);
                return;
              }
              setShowModal(true);
            }}
            className={`btn-primary ${!canSubmitGrades ? 'opacity-50' : ''}`}
          >
            ➕ Выставить оценку
          </button>
        </div>

        {/* Статус выставления оценок */}
        <div className={`ferris-card p-4 mb-6 ${
          canSubmitGrades 
            ? 'bg-green-50 border-2 border-green-200' 
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          <p className={`font-bold ${
            canSubmitGrades ? 'text-green-700' : 'text-red-700'
          }`}>
            {canSubmitGrades ? '✅ Выставление оценок открыто' : `🚫 ${settingsMessage}`}
          </p>
        </div>

        {/* Последние оценки */}
        <div className="ferris-card p-6 shadow-colorful">
          <h2 className="text-2xl font-bold gradient-text mb-4">
            📝 Последние выставленные оценки
          </h2>
          <div className="space-y-3">
            {grades.map((grade, index) => (
              <div
                key={grade.id}
                className="bg-white p-4 rounded-xl border-2 border-gray-100 hover:border-green-300 transition-all"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {grade.students?.name || 'Студент'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {grade.students?.group_name} • {grade.subject} • {grade.grade_type}
                    </p>
                    {grade.comment && (
                      <p className="text-gray-500 text-sm mt-1">💬 {grade.comment}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(grade.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <div className="text-3xl font-black gradient-text">
                    {grade.grade}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {grades.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Оценки пока не выставлены</p>
            </div>
          )}
        </div>

        {/* Модальное окно */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold gradient-text mb-4">
                ➕ Выставить оценку
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Студент
                  </label>
                  <select
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    required
                  >
                    <option value="">Выберите студента</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.group_name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Предмет
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Математика"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Тип оценки
                    </label>
                    <select
                      value={formData.grade_type}
                      onChange={(e) => setFormData({ ...formData, grade_type: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    >
                      <option value="lecture">Лекция</option>
                      <option value="srsp">СРСП</option>
                      <option value="srs">СРС</option>
                      <option value="midterm">Рубежный</option>
                      <option value="final">Экзамен</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Оценка (0-100)
                  </label>
                  <input
                    type="number"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Комментарий (опционально)
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={3}
                    placeholder="Дополнительная информация..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    ❌ Отмена
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    ✅ Выставить оценку
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
