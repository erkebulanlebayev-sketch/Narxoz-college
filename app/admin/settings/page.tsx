'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';

interface GradeSubmissionSetting {
  enabled: boolean;
  deadline?: string;
  message?: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gradeSettings, setGradeSettings] = useState<GradeSubmissionSetting>({
    enabled: true,
    deadline: undefined,
    message: 'Выставление оценок открыто'
  });

  useEffect(() => {
    loadSettings();

    // Real-time подписка на изменения настроек
    const channel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        () => {
          console.log('✅ Настройки обновлены через Realtime!');
          loadSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadSettings() {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'grade_submission_window')
        .single();

      if (error) throw error;

      if (data) {
        setGradeSettings(data.value as GradeSubmissionSetting);
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .update({
          value: gradeSettings
        })
        .eq('key', 'grade_submission_window');

      if (error) throw error;

      alert('✅ Настройки сохранены! Изменения применены для всех учителей.');
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    } finally {
      setSaving(false);
    }
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">⚙️ Настройки системы</span>
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Управление параметрами системы
          </p>
        </div>

        {/* Настройки выставления оценок */}
        <div className="ferris-card p-6 shadow-colorful mb-6">
          <h2 className="text-2xl font-bold gradient-text mb-4">
            📊 Контроль выставления оценок
          </h2>
          <p className="text-gray-600 mb-6">
            Управляйте временем, когда учителя могут выставлять оценки студентам
          </p>

          <div className="space-y-6">
            {/* Переключатель включения/выключения */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    Статус выставления оценок
                  </h3>
                  <p className="text-sm text-gray-600">
                    {gradeSettings.enabled 
                      ? 'Учителя могут выставлять оценки' 
                      : 'Выставление оценок заблокировано'}
                  </p>
                </div>
                <button
                  onClick={() => setGradeSettings({ ...gradeSettings, enabled: !gradeSettings.enabled })}
                  className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                    gradeSettings.enabled 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform ${
                      gradeSettings.enabled ? 'translate-x-12' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className={`px-4 py-3 rounded-lg ${
                gradeSettings.enabled 
                  ? 'bg-green-50 border-2 border-green-200' 
                  : 'bg-red-50 border-2 border-red-200'
              }`}>
                <p className={`font-bold ${
                  gradeSettings.enabled ? 'text-green-700' : 'text-red-700'
                }`}>
                  {gradeSettings.enabled ? '✅ Открыто' : '🚫 Закрыто'}
                </p>
              </div>
            </div>

            {/* Дедлайн */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                📅 Дедлайн (опционально)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Установите дату и время, после которых выставление оценок будет автоматически закрыто
              </p>
              <input
                type="datetime-local"
                value={gradeSettings.deadline || ''}
                onChange={(e) => setGradeSettings({ ...gradeSettings, deadline: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              {gradeSettings.deadline && (
                <div className="mt-3 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <p className="text-blue-700 font-medium">
                    ⏰ Дедлайн: {new Date(gradeSettings.deadline).toLocaleString('ru-RU')}
                  </p>
                </div>
              )}
            </div>

            {/* Сообщение */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                💬 Сообщение для учителей
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Это сообщение будет отображаться учителям при попытке выставить оценку
              </p>
              <textarea
                value={gradeSettings.message || ''}
                onChange={(e) => setGradeSettings({ ...gradeSettings, message: e.target.value })}
                rows={3}
                placeholder="Например: Выставление оценок закрыто до следующей недели"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>

            {/* Кнопка сохранения */}
            <div className="flex gap-4">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '⏳ Сохранение...' : '💾 Сохранить настройки'}
              </button>
              <button
                onClick={loadSettings}
                className="px-6 btn-secondary"
              >
                🔄 Сбросить
              </button>
            </div>
          </div>
        </div>

        {/* Информация */}
        <div className="ferris-card p-6 bg-blue-50 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-2">
            ℹ️ Как это работает
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li>• Когда выставление оценок <strong>открыто</strong>, учителя могут свободно ставить оценки</li>
            <li>• Когда выставление оценок <strong>закрыто</strong>, учителя видят сообщение и не могут ставить оценки</li>
            <li>• Дедлайн автоматически закроет выставление оценок в указанное время</li>
            <li>• Все изменения применяются мгновенно для всех учителей благодаря real-time синхронизации</li>
          </ul>
        </div>
      </div>
    </UniversalLayout>
  );
}
