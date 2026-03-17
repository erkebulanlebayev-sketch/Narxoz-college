'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Settings, Clock, MessageSquare, Save, RotateCcw } from 'lucide-react';

interface GradeSubmissionSetting {
  enabled: boolean;
  deadline?: string;
  message?: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gradeSettings, setGradeSettings] = useState<GradeSubmissionSetting>({
    enabled: true, message: 'Выставление оценок открыто'
  });

  useEffect(() => {
    loadSettings();
    const channel = supabase
      .channel('settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, loadSettings)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function loadSettings() {
    try {
      const { data } = await supabase
        .from('settings').select('*').eq('key', 'grade_submission_window').single();
      if (data) setGradeSettings(data.value as GradeSubmissionSetting);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('settings').update({ value: gradeSettings }).eq('key', 'grade_submission_window');
      if (error) throw error;
      alert('Настройки сохранены');
    } catch (e: any) { alert('Ошибка: ' + e.message); }
    finally { setSaving(false); }
  }

  return (
    <DarkLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Настройки <span className="text-red-600">Системы</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">Управление параметрами платформы</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Grade submission toggle */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black italic uppercase text-sm tracking-widest mb-1">
                    Выставление оценок
                  </h3>
                  <p className="text-gray-500 text-xs font-mono">
                    {gradeSettings.enabled ? 'Учителя могут ставить оценки' : 'Заблокировано'}
                  </p>
                </div>
                <button
                  onClick={() => setGradeSettings(s => ({ ...s, enabled: !s.enabled }))}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    gradeSettings.enabled ? 'bg-red-600' : 'bg-white/10'
                  }`}
                >
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    gradeSettings.enabled ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest ${
                gradeSettings.enabled
                  ? 'bg-red-600/10 border border-red-600/20 text-red-500'
                  : 'bg-white/5 border border-white/10 text-gray-500'
              }`}>
                {gradeSettings.enabled ? '● Открыто' : '○ Закрыто'}
              </div>
            </div>

            {/* Deadline */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-red-500" />
                <h3 className="font-black italic uppercase text-sm tracking-widest">Дедлайн</h3>
                <span className="text-gray-600 text-[10px] font-mono">(опционально)</span>
              </div>
              <p className="text-gray-500 text-xs mb-3 font-mono">
                После этого времени выставление оценок закроется автоматически
              </p>
              <input
                type="datetime-local"
                value={gradeSettings.deadline || ''}
                onChange={e => setGradeSettings(s => ({ ...s, deadline: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-600/50"
              />
              {gradeSettings.deadline && (
                <p className="mt-2 text-[11px] font-mono text-red-500">
                  Дедлайн: {new Date(gradeSettings.deadline).toLocaleString('ru-RU')}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={14} className="text-red-500" />
                <h3 className="font-black italic uppercase text-sm tracking-widest">Сообщение для учителей</h3>
              </div>
              <textarea
                value={gradeSettings.message || ''}
                onChange={e => setGradeSettings(s => ({ ...s, message: e.target.value }))}
                rows={3}
                placeholder="Например: Выставление оценок закрыто до следующей недели"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 resize-none"
              />
            </div>

            {/* Info block */}
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Settings size={13} className="text-gray-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Как это работает</span>
              </div>
              <ul className="space-y-1.5 text-[11px] font-mono text-gray-600">
                <li>· Когда открыто — учителя свободно ставят оценки</li>
                <li>· Когда закрыто — учителя видят сообщение и не могут ставить оценки</li>
                <li>· Дедлайн автоматически закроет выставление в указанное время</li>
                <li>· Изменения применяются мгновенно через real-time синхронизацию</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={saveSettings} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                <Save size={14} />
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={loadSettings}
                className="px-5 py-3 border border-white/10 text-gray-400 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </DarkLayout>
  );
}
