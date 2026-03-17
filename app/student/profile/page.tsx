'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCurrentUser } from '@/lib/auth';
import DarkLayout from '@/components/DarkLayout';
import { QrCode, Trophy, BarChart2 } from 'lucide-react';

const achievements = [
  { title: 'Отличник учебы', icon: '🏆', date: '2023' },
  { title: 'Победитель олимпиады', icon: '🥇', date: '2023' },
  { title: 'Лучший проект', icon: '💡', date: '2022' },
];

const stats = [
  { label: 'Средний балл', value: '3.8' },
  { label: 'Посещаемость', value: '92%' },
  { label: 'Сдано работ', value: '45' },
  { label: 'Рейтинг', value: '#3' },
];

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const initials = user?.user_metadata?.name
    ? user.user_metadata.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'ST';

  return (
    <DarkLayout role="student">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Мой <span className="text-red-600">Профиль</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">Личная информация и достижения</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Digital ID Card */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-start gap-5 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center font-black text-red-500 text-2xl flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-black italic uppercase text-xl tracking-tight truncate">
                    {user?.user_metadata?.name || 'Студент'}
                  </h2>
                  <p className="text-gray-500 text-sm font-mono truncate mt-1">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 rounded-lg bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase tracking-widest">
                      Студент
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      ИС-21-1
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <QrCode size={24} className="text-gray-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Студенческий билет', value: '2021001234' },
                  { label: 'Телефон', value: '+7 (777) ***-**-**' },
                  { label: 'Дата рождения', value: '15.03.2003' },
                  { label: 'Год поступления', value: '2021' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-mono text-gray-600 mb-1">{item.label}</p>
                    <p className="font-black text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={14} className="text-red-500" />
              <h3 className="font-black italic uppercase text-sm tracking-widest">Достижения</h3>
            </div>
            <div className="space-y-3">
              {achievements.map((a, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                >
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="font-bold text-sm">{a.title}</p>
                    <p className="text-[10px] font-mono text-gray-600">{a.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Academic stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={14} className="text-red-500" />
            <h3 className="font-black italic uppercase text-sm tracking-widest">Академическая успеваемость</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-2xl font-black text-red-500 mb-1">{s.value}</p>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DarkLayout>
  );
}
