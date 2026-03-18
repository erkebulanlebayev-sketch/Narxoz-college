'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { Mail, Phone, BookOpen, LogOut, Save } from 'lucide-react';

export default function TeacherProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      setUser(u);
      if (u?.email) {
        const { data } = await supabase.from('teachers').select('*').eq('email', u.email).single();
        if (data) {
          setTeacher(data);
          setName(data.name || u.user_metadata?.name || '');
          setPhone(data.phone || '');
        } else {
          setName(u.user_metadata?.name || '');
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      if (teacher?.id) {
        await supabase.from('teachers').update({ name, phone }).eq('id', teacher.id);
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  const initials = name?.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() || 'П';
  const subjects: string[] = teacher?.subjects || [];

  return (
    <DarkLayout role="teacher">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

        {/* HEADER */}
        <div className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-3">Teacher Portal</p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            Профиль
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT — Avatar card */}
            <div className="p-8 rounded-[28px] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center gap-6">
              <div className="w-24 h-24 rounded-[24px] bg-red-600/10 border border-red-600/20 flex items-center justify-center text-3xl font-black italic text-red-500">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-black italic uppercase tracking-tighter">{name || 'Преподаватель'}</h2>
                <p className="text-gray-600 text-xs font-mono mt-1">{user?.email}</p>
                <span className="inline-block mt-3 px-3 py-1 rounded-full border border-red-600/20 text-red-500 text-[9px] font-black uppercase tracking-widest">
                  Преподаватель
                </span>
              </div>
              {subjects.length > 0 && (
                <div className="w-full pt-4 border-t border-white/5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-3">Предметы</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {subjects.map((s: string, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/10 text-gray-500 hover:text-red-500 hover:border-red-600/30 text-[11px] font-black uppercase tracking-widest transition-all">
                <LogOut size={14} /> Выйти
              </button>
            </div>

            {/* RIGHT — Info */}
            <div className="lg:col-span-2 space-y-4">

              {/* Name */}
              <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-3">ФИО</p>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-transparent text-white text-lg font-black italic uppercase tracking-tighter focus:outline-none border-b border-white/10 focus:border-red-600/40 pb-2 transition-all placeholder-gray-700"
                  placeholder="Введите ФИО" />
              </div>

              {/* Email */}
              <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Mail size={12} className="text-gray-600" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Email</p>
                </div>
                <p className="text-sm font-mono text-gray-400">{user?.email}</p>
              </div>

              {/* Phone */}
              <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Phone size={12} className="text-gray-600" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Телефон</p>
                </div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full bg-transparent text-white text-sm font-mono focus:outline-none border-b border-white/10 focus:border-red-600/40 pb-2 transition-all placeholder-gray-700" />
              </div>

              {/* Department */}
              {teacher?.department && (
                <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={12} className="text-gray-600" />
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Кафедра</p>
                  </div>
                  <p className="text-sm font-bold text-gray-300">{teacher.department}</p>
                </div>
              )}

              {/* Save */}
              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-widest transition-all">
                <Save size={14} />
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>

          </div>
        )}

      </motion.div>
    </DarkLayout>
  );
}