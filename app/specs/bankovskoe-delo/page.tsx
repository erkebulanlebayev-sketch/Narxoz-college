'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
});

export default function BankovskoeDeloPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-red-600 overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4 flex justify-between items-center bg-black/20">
        <Link href="/" className="font-black italic text-xl tracking-tighter uppercase">
          Narxoz <span className="text-red-600">College</span>
        </Link>
        <Link href="/#specs" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={12} /> Специальности
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-end pb-20 pt-32 px-6 md:px-16 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=1600"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt="Banking"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/70 to-transparent" />
        <div className="relative z-10 max-w-5xl">
          <motion.p {...fade(0.1)} className="text-red-600 font-bold tracking-[0.6em] uppercase text-[9px] mb-6">
            Деньги · Доверие · Технологии — всё это твоя будущая профессия
          </motion.p>
          <motion.h1 {...fade(0.2)} className="text-[13vw] md:text-[9vw] font-black italic uppercase tracking-tighter leading-[0.85] mb-8">
            Банковское<br /><span className="text-white/15">и страховое</span><br />дело
          </motion.h1>
          <motion.p {...fade(0.35)} className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed mb-10">
            Выпускники данной специальности осуществляют управленческую, предпринимательскую, коммерческую деятельность на предприятиях всех форм собственности и сфер деятельности, финансовых органах, страховых, банковских организациях, на рынке ценных бумаг.
          </motion.p>
          <motion.div {...fade(0.45)} className="flex flex-wrap gap-4">
            <div className="px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Код специальности</p>
              <p className="font-black text-white">04120100</p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Срок обучения</p>
              <p className="font-black text-white">2 года 10 месяцев</p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Квалификация</p>
              <p className="font-black text-white">Менеджер по банковским операциям</p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Форма обучения</p>
              <p className="font-black text-white">Очная</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* СФЕРА ДЕЯТЕЛЬНОСТИ */}
      <section className="relative z-20 bg-[#030303] py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-4">01</p>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-12">
              Сфера<br /><span className="text-white/15">деятельности</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-5 text-gray-400 text-base leading-relaxed">
              <p>Экономисты по финансовой работе занимаются управлением и организацией финансов, проведением денежно-кредитной и фискальной политики на микро- и макро уровнях.</p>
              <p>Специалисты данного профиля должны проводить анализ финансового состояния компании, способствовать увеличению доходов, минимизации затрат и рисков, удовлетворять потребности рынка в предоставлении качественных финансовых услуг.</p>
              <p>В мире, где финансовые процессы играют ключевую роль в развитии экономики, специалисты в области банковского и страхового дела становятся настоящими архитекторами стабильности и роста.</p>
              <p>Полученные знания позволяют выпускникам уверенно работать в ведущих банках, страховых компаниях, инвестиционных и консалтинговых фирмах.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[400px] rounded-[32px] overflow-hidden border border-white/5">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800" className="w-full h-full object-cover opacity-50" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-red-600 font-mono text-xs tracking-widest mb-2">4S04120103</p>
                <p className="font-black italic uppercase text-2xl tracking-tighter">Менеджер по<br />банковским операциям</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ГДЕ РАБОТАТЬ */}
      <section className="relative z-20 bg-[#030303] py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-4">02</p>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-16">
              Где ты<br /><span className="text-white/15">сможешь работать</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { n: "01", t: "Государственные органы", d: "Республиканского и территориального уровня" },
              { n: "02", t: "Министерство финансов", d: "Финансовый контроль и бюджетное планирование" },
              { n: "03", t: "Банки", d: "Коммерческие и государственные банки РК" },
              { n: "04", t: "Инвестиционные фонды", d: "Управление активами и портфельные инвестиции" },
              { n: "05", t: "Страховые компании", d: "Страхование жизни, имущества и бизнеса" },
              { n: "06", t: "Бюджетные организации", d: "Учреждения и организации государственного сектора" },
            ].map((item, i) => (
              <motion.div key={item.n}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-red-600/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.06)] transition-all group">
                <p className="text-red-600 font-mono text-xs mb-4 tracking-widest">{item.n}</p>
                <h3 className="font-black italic uppercase tracking-tighter text-lg mb-2 group-hover:text-red-500 transition-colors">{item.t}</h3>
                <p className="text-gray-600 text-sm">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ДИСЦИПЛИНЫ */}
      <section className="relative z-20 bg-[#030303] py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-4">03</p>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-16">
              Что<br /><span className="text-white/15">изучаешь</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Банковские операции", "Кредитование", "Финансовые рынки", "Валютные операции", "Банковское законодательство", "Риск-менеджмент", "Страхование", "Инвестиции", "Бухгалтерский учёт", "Налогообложение", "Финансовый анализ", "Экономика"].map((s, i) => (
              <motion.div key={s}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-600/30 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">{s}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ПОЧЕМУ ВЫБИРАЮТ */}
      <section className="relative z-20 bg-[#030303] py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-4">04</p>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-16">
              Почему<br /><span className="text-white/15">выбирают</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Высокий и стабильный спрос на рынке труда",
              "Возможность карьерного роста до руководителя офиса или риск-менеджера",
              "Гибкие навыки: подойдут для работы в любой сфере, где есть деньги",
              "Опыт общения, аналитики, юридической грамотности — универсальный багаж",
              "Отличная база для продолжения обучения в вузе по направлениям: финансы, экономика, юриспруденция, госуправление",
              "Стажировки в ведущих банках и финансовых организациях Казахстана",
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-4 p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                <span className="text-red-600 font-mono text-xs mt-0.5 shrink-0">0{i + 1}</span>
                <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-20 bg-[#030303] py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-4">Поступление 2026</p>
            <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-6">
              Готов стать<br />финансистом?
            </h2>
            <p className="text-gray-500 text-base mb-8">Свяжись с приёмной комиссией — ответим на все вопросы и поможем с документами.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://wa.me/77273132028" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black italic uppercase tracking-tighter text-base rounded-2xl transition-colors">
                Написать в WhatsApp <ArrowUpRight size={16} />
              </a>
              <Link href="/#specs"
                className="flex items-center justify-center px-8 py-4 border border-white/10 hover:border-white/20 text-white font-black italic uppercase tracking-tighter text-base rounded-2xl transition-colors">
                Другие специальности
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-80 h-80 rounded-[32px] overflow-hidden border border-white/5 relative shrink-0">
            <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800" className="w-full h-full object-cover opacity-50" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Narxoz College</p>
              <p className="font-black italic uppercase text-xl tracking-tighter">Алматы, 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 bg-black py-12 px-6 md:px-16 border-t border-white/5 text-center">
        <p className="text-[9px] text-gray-800 font-bold uppercase tracking-[0.5em]">
          © 2026 Economic College Narxoz · Банковское и страховое дело · 04120100
        </p>
      </footer>
    </div>
  );
}