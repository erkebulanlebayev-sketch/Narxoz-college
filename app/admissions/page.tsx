'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, FileText, Instagram, Phone } from 'lucide-react';

const specs = [
  { full: "Программное обеспечение", slug: "programmnoe-obespechenie" },
  { full: "Правоведение", slug: "pravovedenie" },
  { full: "Учет и аудит", slug: "uchet-i-audit" },
  { full: "Менеджмент", slug: "menedzhment" },
  { full: "Маркетинг", slug: "marketing" },
  { full: "Банковское дело", slug: "bankovskoe-delo" },
  { full: "Вычислительная техника и информационные сети", slug: "vychislitelnaya-tekhnika" },
];

const contacts = [
  { type: 'phone', display: '+7 707 660 1635', href: 'https://wa.me/77076601635' },
  { type: 'phone', display: '+7 705 175 3609', href: 'https://wa.me/77051753609' },
  { type: 'phone', display: '+7 707 300 6808', href: 'https://wa.me/77073006808' },
  { type: 'instagram', display: '@mqulet', href: 'https://www.instagram.com/mqulet?igsh=d2p2NmNjaWQ5NHB3' },
  { type: 'instagram', display: '@dosjanserik', href: 'https://www.instagram.com/dosjanserik?igsh=aHZjY3IzeGxka2dt' },
  { type: 'instagram', display: '@leo_erkebulan', href: 'https://www.instagram.com/leo_erkebulan?igsh=aW5wanM0OTc1MmNz&utm_source=qr' },
];

const docs = [
  'Заявление',
  'Документ об образовании',
  'Медицинская справка 075-У с флюорографией',
  'Карта прививок по форме 063-У (паспорт здоровья)',
  'Копия свидетельства о рождении, ИИН',
  '6 фотокарточек 3×4',
  'Копия удостоверения личности одного из родителей',
];

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4 flex items-center gap-6 bg-black/20">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={14} /> Главная
        </Link>
        <div className="font-black italic text-xl tracking-tighter uppercase">
          Narxoz <span className="text-red-600">College</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-4">Narxoz College • 2026</p>
            <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-6">
              Приемная <br /><span className="text-white/10">Комиссия</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-xl uppercase tracking-widest font-medium">
              Всё что нужно знать для поступления в колледж Нархоз
            </p>
          </motion.div>
        </div>
      </section>

      {/* СРОКИ И ФОРМЫ */}
      <section id="terms" className="py-24 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-10 rounded-[28px] bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Clock size={18} className="text-red-600" />
              <span className="text-red-600 font-bold text-xs uppercase tracking-widest">Сроки обучения</span>
            </div>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">На базе 9 классов</p>
                <p className="text-2xl font-black italic">2 года 10 месяцев</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">На базе 11 классов</p>
                <p className="text-2xl font-black italic">1 год 10 месяцев</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-10 rounded-[28px] bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={18} className="text-red-600" />
              <span className="text-red-600 font-bold text-xs uppercase tracking-widest">Формы и языки</span>
            </div>
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Форма обучения</p>
              <p className="text-xl font-black italic">Очная</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Языки обучения</p>
              <div className="flex gap-3 flex-wrap">
                {['Казахский', 'Русский', 'Английский'].map(lang => (
                  <span key={lang} className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider">{lang}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ДОКУМЕНТЫ */}
      <section id="docs" className="py-24 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <FileText size={18} className="text-red-600" />
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Документы</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {docs.map((doc, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <span className="text-red-600 font-black text-sm mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-sm font-medium text-gray-300">{doc}</p>
              </motion.div>
            ))}
          </div>
          <div className="p-10 rounded-[28px] bg-red-600/5 border border-red-600/20">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-red-500">Перевод из другого учебного заведения</h3>
            <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
              <p>1. Получите в своём колледже документ — <span className="text-white font-bold">«Транскрипт»</span> (документ со всеми пройденными дисциплинами).</p>
              <p>2. Придите с транскриптом в колледж Нархоз для расчёта возможности перевода.</p>
              <p>3. При положительном ответе вам выдадут <span className="text-white font-bold">«Письмо-запрос»</span> — с ним идёте в свой колледж за документами.</p>
              <p>4. Получив документы, приходите к нам для подачи на поступление.</p>
            </div>
          </div>
        </div>
      </section>

      {/* СПЕЦИАЛЬНОСТИ */}
      <section id="specs" className="py-24 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-12">Специальности</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specs.map((spec, i) => (
              <Link href={`/specs/${spec.slug}`} key={i}>
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-600/40 hover:bg-red-600/5 transition-all duration-300 cursor-pointer">
                  <p className="text-xs font-black italic uppercase tracking-tight group-hover:text-red-500 transition-colors">{spec.full}</p>
                  <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-2 font-bold group-hover:text-gray-400 transition-colors">Подробнее →</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contacts" className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">Контакты</h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-12">Приемная комиссия — нажмите чтобы открыть</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((c, i) => (
              <motion.a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-600/40 hover:bg-red-600/5 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-red-600/20 border border-white/5 group-hover:border-red-600/30 flex items-center justify-center transition-all shrink-0">
                  {c.type === 'phone'
                    ? <Phone size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    : <Instagram size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                  }
                </div>
                <div>
                  <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold mb-1">
                    {c.type === 'phone' ? 'WhatsApp' : 'Instagram'}
                  </p>
                  <p className="text-base font-black">{c.display}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6 md:px-12 text-center">
        <p className="text-[9px] text-gray-800 font-bold uppercase tracking-[0.5em]">
          © 2026 Economic College Narxoz • Made for Future
        </p>
      </footer>

    </div>
  );
}