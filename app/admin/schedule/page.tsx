'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Calendar, Plus, Pencil, Trash2, X, MapPin, Users, Clock } from 'lucide-react';

interface Schedule {
  id: number;
  day: number;
  start_time: string;
  end_time: string;
  subject: string;
  teacher_id?: number;
  group_name: string;
  room: string;
}

interface Teacher { id: number; name: string; }

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

const emptyForm = {
  day_of_week: 0, start_time: '09:00', end_time: '10:30',
  subject: '', teacher_id: '', group_name: '', room: ''
};

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Schedule | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel('schedule-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule' }, loadData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function loadData() {
    try {
      const { data: scheduleData } = await supabase
        .from('schedule').select('*').order('day').order('start_time');
      setSchedule(scheduleData || []);
      const { data: teachersData } = await supabase
        .from('teachers').select('id, name').order('name');
      setTeachers(teachersData || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = {
        day: Number(formData.day_of_week),
        start_time: formData.start_time, end_time: formData.end_time,
        subject: formData.subject,
        teacher_id: formData.teacher_id ? Number(formData.teacher_id) : null,
        group_name: formData.group_name, room: formData.room
      };
      if (editingItem) {
        const { error } = await supabase.from('schedule').update(data).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('schedule').insert([data]);
        if (error) throw error;
      }
      setFormData(emptyForm);
      setShowModal(false);
      setEditingItem(null);
      loadData();
    } catch (e: any) { alert('Ошибка: ' + e.message); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить занятие?')) return;
    const { error } = await supabase.from('schedule').delete().eq('id', id);
    if (error) alert('Ошибка: ' + error.message);
    else loadData();
  }

  function handleEdit(item: Schedule) {
    setEditingItem(item);
    setFormData({
      day_of_week: item.day, start_time: item.start_time, end_time: item.end_time,
      subject: item.subject, teacher_id: item.teacher_id?.toString() || '',
      group_name: item.group_name, room: item.room
    });
    setShowModal(true);
  }

  const daySchedule = schedule.filter(s => s.day === activeDay);
  const activeDays = days.map((_, i) => schedule.some(s => s.day === i));

  return (
    <DarkLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Управление <span className="text-red-600">Расписанием</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">{schedule.length} занятий всего</p>
          </div>
          <button
            onClick={() => { setEditingItem(null); setFormData(emptyForm); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
          >
            <Plus size={14} /> Добавить
          </button>
        </div>

        {/* Day tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((day, i) => (
            <button key={i} onClick={() => setActiveDay(i)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                activeDay === i
                  ? 'bg-red-600/10 border-red-600/30 text-red-500'
                  : activeDays[i]
                  ? 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                  : 'border-white/5 text-gray-700'
              }`}
            >
              {day.slice(0, 3)}
              {activeDays[i] && <span className="ml-1 text-xs opacity-60">({schedule.filter(s => s.day === i).length})</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : daySchedule.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold uppercase text-sm tracking-widest">Нет занятий в этот день</p>
          </div>
        ) : (
          <div className="space-y-3">
            {daySchedule.map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center gap-1 font-mono text-sm font-bold text-white">
                        <Clock size={12} className="text-red-500" />
                        {item.start_time} — {item.end_time}
                      </span>
                    </div>
                    <h3 className="font-black italic uppercase text-base tracking-tight mb-2">{item.subject}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                      <span className="flex items-center gap-1"><Users size={11} />{item.group_name}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} />Ауд. {item.room}</span>
                      {item.teacher_id && (
                        <span>{teachers.find(t => t.id === item.teacher_id)?.name || '—'}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(item)}
                      className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-red-500 hover:border-red-600/30 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black italic uppercase text-lg tracking-tight">
                {editingItem ? 'Редактировать' : 'Новое'} <span className="text-red-600">Занятие</span>
              </h2>
              <button onClick={() => { setShowModal(false); setEditingItem(null); }}
                className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">День недели</label>
                  <select value={formData.day_of_week}
                    onChange={e => setFormData(f => ({ ...f, day_of_week: Number(e.target.value) }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-600/50"
                  >
                    {days.map((day, i) => <option key={i} value={i}>{day}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Начало</label>
                  <input type="time" value={formData.start_time}
                    onChange={e => setFormData(f => ({ ...f, start_time: e.target.value }))} required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-600/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Конец</label>
                  <input type="time" value={formData.end_time}
                    onChange={e => setFormData(f => ({ ...f, end_time: e.target.value }))} required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-600/50"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Предмет</label>
                  <input type="text" value={formData.subject}
                    onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))} required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Группа</label>
                  <input type="text" value={formData.group_name} placeholder="ИС-21-1"
                    onChange={e => setFormData(f => ({ ...f, group_name: e.target.value }))} required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Аудитория</label>
                  <input type="text" value={formData.room} placeholder="301"
                    onChange={e => setFormData(f => ({ ...f, room: e.target.value }))} required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Преподаватель (опционально)</label>
                  <select value={formData.teacher_id}
                    onChange={e => setFormData(f => ({ ...f, teacher_id: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-600/50"
                  >
                    <option value="">Не выбран</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingItem(null); }}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all">
                  Отмена
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-black uppercase tracking-widest transition-all">
                  {editingItem ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DarkLayout>
  );
}
