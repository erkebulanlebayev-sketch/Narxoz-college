'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
});

export default function UchetIAuditPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-red-600 overflow-x-hidden">

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
        <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600"
          className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Accounting" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/70 to-transparent" />
        <div className="relative z-10 max-w-5xl">
          <motion.p {...fade(0.1)} className="text-red-600 font-bold tracking-[0.6em] uppercase text-[9px] mb-6">
            Цифры не лгут. Особенно в руках профессионала.
          </motion.p>
          <motion.h1 {...fade(0.2)} className="text-[10vw] md:text-[7vw] font-black italic uppercase tracking-tighter leading-[0.85] mb-8">
            Учёт<br />и аудит
          </motion.h1>
          <motion.p {...fade(0.35)} className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed mb-10">
            Выпускники этой специальности востребованы в самых различных сферах — от малых и крупных предприятий до крупных аудиторских и консалтинговых компаний. Они способны не только контролировать и анализировать финансовые потоки, но и помогать компаниям оптимизировать свои ресурсы, повышать прозрачность и минимизировать риски.
          </motion.p>
          <motion.div {...fade(0.45)} className="flex flex-wrap gap-4">
            {[
              { label: 'Код специальности', value: '04140100' },
              { label: 'Срок обучения', value: '2 года 10 месяцев' },
              { label: 'Квалификация', value: 'Бухгалтер (4S04110102)' },
              { label: 'Форма обучения', value: 'Очная' },
            ].map(item => (
              <div key={item.label} className="px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/10">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">{item.label}</p>
                <p className="font-black text-white">{item.value}</p>
              </div>
            ))}
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
              <p>Специальность «Учёт и аудит» ориентирована на подготовку квалифицированных специалистов в области бухгалтерского учёта, экономического анализа и аудита. В современном бизнесе правильный учёт и грамотный аудит — это основа финансовой стабильности и прозрачности.</p>
              <p>Специальность «Учёт и аудит» открывает перед вами захватывающий мир финансового контроля, где каждый бухгалтер и аудитор становится важной частью системы, обеспечивающей честность и эффективность в работе организаций.</p>
              <p>Обучение на этой специальности охватывает широкий спектр знаний: от теории бухгалтерского учёта и налогообложения до практических аспектов проведения аудиторских проверок и анализа финансовых отчётов. Вы изучите методы формирования финансовых отчётов, принципы работы с налоговыми и бухгалтерскими регламентами, а также освоите современные программы и инструменты для автоматизации учёта и аудита.</p>
              <p>Студенты специальности «Учёт и аудит» получают ценные навыки анализа финансовых данных, выявления ошибок и нарушений, а также разработки рекомендаций по улучшению финансовой деятельности организаций.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[400px] rounded-[32px] overflow-hidden border border-white/5">
              <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800" className="w-full h-full object-cover opacity-50" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-red-600 font-mono text-xs tracking-widest mb-2">4S04110102</p>
                <p className="font-black italic uppercase text-2xl tracking-tighter">Бухгалтер</p>
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
              { n: "01", t: "Промышленные, торговые, строительные, IT-компании", d: "Ведение бухгалтерского учёта и финансовой отчётности" },
              { n: "02", t: "Аудиторские и консалтинговые фирмы", d: "Независимый аудит и финансовое консультирование" },
              { n: "03", t: "Финансовые департаменты и бухгалтерии", d: "Частные и государственные структуры" },
              { n: "04", t: "Банки, страховые и инвестиционные компании", d: "Финансовый контроль и внутренний аудит" },
              { n: "05", t: "Государственный сектор", d: "Налоговые органы, казначейство, счётный комитет" },
              { n: "06", t: "Международные компании", d: "Учёт по МСФО и международные стандарты аудита" },
            ].map((item, i) => (
              <motion.div key={item.n}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-red-600/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.06)] transition-all group">
                <p className="text-red-600 font-mono text-xs mb-4 tracking-widest">{item.n}</p>
                <h3 className="font-black italic uppercase tracking-tighter text-base mb-2 group-hover:text-red-500 transition-colors">{item.t}</h3>
                <p className="text-gray-600 text-sm">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ПОЧЕМУ ВЫБИРАЮТ */}
      <section className="relative z-20 bg-[#030303] py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-4">03</p>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-16">
              Почему<br /><span className="text-white/15">выбирают</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Востребована и понятна рынку: выпускников охотно берут с первых курсов",
              "Высокий уровень доверия: от твоих цифр зависит бизнес",
              "Возможность карьерного роста до CFO или главного бухгалтера",
              "Лёгкий переход в смежные сферы: аудит, экономика, финансовый менеджмент, консалтинг",
              "Универсальная профессия — применима в любой сфере деятельности",
              "Цифровизация учёта открывает новые возможности: 1С, SAP, облачные системы",
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
              Готов стать<br />бухгалтером?
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
            <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800" className="w-full h-full object-cover opacity-50" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Narxoz College</p>
              <p className="font-black italic uppercase text-xl tracking-tighter">Алматы, 2026</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-20 bg-black py-12 px-6 md:px-16 border-t border-white/5 text-center">
        <p className="text-[9px] text-gray-800 font-bold uppercase tracking-[0.5em]">
          © 2026 Economic College Narxoz · Учёт и аудит · 04140100
        </p>
      </footer>
    </div>
  );
}
