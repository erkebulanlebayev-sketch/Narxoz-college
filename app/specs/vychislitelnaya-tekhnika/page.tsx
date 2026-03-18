'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
});

export default function VychislitelnayaTekhnikalPage() {
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
        <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600"
          className="absolute inset-0 w-full h-full object-cover opacity-20" alt="IT Networks" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/70 to-transparent" />
        <div className="relative z-10 max-w-5xl">
          <motion.p {...fade(0.1)} className="text-red-600 font-bold tracking-[0.6em] uppercase text-[9px] mb-6">
            Создавай инфраструктуру, которая двигает мир. Управляй данными, вычислениями и процессами.
          </motion.p>
          <motion.h1 {...fade(0.2)} className="text-[7vw] md:text-[5vw] font-black italic uppercase tracking-tighter leading-[0.85] mb-8">
            Вычислительная<br />техника и<br />информационные<br />сети
          </motion.h1>
          <motion.p {...fade(0.35)} className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed mb-10">
            Выпускники «Вычислительной техники и информационных сетей» могут работать системными администраторами, специалистами по сетевой безопасности, инженерами по обслуживанию и настройке компьютерных систем и многими другими профессионалами в сфере информационных технологий.
          </motion.p>
          <motion.div {...fade(0.45)} className="flex flex-wrap gap-4">
            {[
              { label: 'Код специальности', value: '06120100' },
              { label: 'Срок обучения', value: '3 года 10 месяцев' },
              { label: 'Квалификация', value: 'Оператор компьютерного аппаратного обеспечения' },
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
              <p>Занимается вопросами информационных технологий, связанными с поиском, сбором, хранением, преобразованием и использованием информации в самых различных сферах человеческой деятельности. Это прежде всего — сфера высоких технологий. Владение информационными технологиями, можно сказать, норма нашего времени.</p>
              <p>Специальность «Вычислительная техника и информационные сети» — это отличная возможность для тех, кто интересуется технологиями, компьютерами и тем, как работают современные информационные системы. В мире, где почти все процессы связаны с данными и сетью, специалисты в этой области становятся настоящими архитекторами цифровой среды.</p>
              <p>Обучаясь на этой специальности, вы узнаете, как строятся и функционируют вычислительные системы, как создавать и поддерживать компьютерные сети, а также как обеспечивать безопасность информации. Вы научитесь работать с различными видами компьютерного оборудования, программным обеспечением, а также освоите методы создания и управления информационными системами.</p>
              <p>Кроме того, студенты этой специальности обучаются проектированию, настройке и обслуживанию локальных и глобальных сетей, изучают основы программирования, а также методы защиты информации от внешних угроз. Это востребованная и динамично развивающаяся сфера, где каждый день появляются новые технологии и решения.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[400px] rounded-[32px] overflow-hidden border border-white/5">
              <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800" className="w-full h-full object-cover opacity-50" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-red-600 font-mono text-xs tracking-widest mb-2">3W06120101</p>
                <p className="font-black italic uppercase text-2xl tracking-tighter">Оператор КАО</p>
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
              { n: "01", t: "IT-стартапы и компании по разработке ПО", d: "Системное администрирование и IT-поддержка" },
              { n: "02", t: "Провайдеры облачных услуг и ЦОД", d: "Управление серверной инфраструктурой и сетями" },
              { n: "03", t: "Банки, страховые и телекоммуникационные компании", d: "Сетевая безопасность и IT-инфраструктура" },
              { n: "04", t: "Компании по внедрению IT-решений", d: "Настройка и обслуживание корпоративных систем" },
              { n: "05", t: "Государственные и частные организации", d: "Работа с большими данными и цифровизация" },
              { n: "06", t: "Медицина, образование, промышленность", d: "IT-поддержка отраслевых информационных систем" },
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
              "Высокий спрос на специалистов по IT-инфраструктуре в любых сферах",
              "Возможность работать с новейшими технологиями, включая облачные вычисления и большие данные",
              "Большие перспективы карьерного роста в сфере администрирования и системной интеграции",
              "Важность IT-специалистов в обеспечении безопасности и бесперебойности бизнес-процессов",
              "Универсальность профессии, позволяющая работать в различных отраслях: от банков до здравоохранения",
              "Отличная база для продолжения обучения в вузе по направлениям: IT, кибербезопасность, сетевые технологии",
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
              Готов стать<br />IT-специалистом?
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
            <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800" className="w-full h-full object-cover opacity-50" alt="" />
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
          © 2026 Economic College Narxoz · Вычислительная техника и информационные сети · 06120100
        </p>
      </footer>
    </div>
  );
}
