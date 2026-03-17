'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, BookOpen, Briefcase } from 'lucide-react';
import { notFound } from 'next/navigation';
import { use } from 'react';

const SPECS: Record<string, any> = {
  'programmnoe-obespechenie': {
    id: "06130100", full: "Программное обеспечение",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200",
    duration: "3 года 10 месяцев", form: "Очная",
    desc: "Специальность готовит разработчиков программного обеспечения, способных создавать веб-приложения, мобильные системы и корпоративное ПО. Студенты изучают современные языки программирования, базы данных, алгоритмы и принципы разработки.",
    subjects: ["Python", "JavaScript", "Базы данных", "Алгоритмы", "Веб-разработка", "Мобильная разработка", "Сети и безопасность", "Проектирование ПО"],
    careers: ["Frontend-разработчик", "Backend-разработчик", "Fullstack-разработчик", "Системный аналитик", "QA-инженер"],
    skills: ["Написание чистого кода", "Работа в команде (Git)", "Проектирование архитектуры", "Тестирование ПО", "Работа с API"],
  },
  'pravovedenie': {
    id: "04210100", full: "Правоведение",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200",
    duration: "2 года 10 месяцев", form: "Очная",
    desc: "Подготовка юристов широкого профиля для работы в государственных органах, частных компаниях и юридических фирмах. Глубокое изучение законодательства Республики Казахстан и международного права.",
    subjects: ["Гражданское право", "Уголовное право", "Трудовое право", "Конституционное право", "Административное право", "Семейное право", "Нотариат", "Юридическая этика"],
    careers: ["Юрист", "Помощник адвоката", "Нотариус", "Юрисконсульт", "Специалист по кадрам"],
    skills: ["Составление договоров", "Правовой анализ", "Судебное представительство", "Работа с НПА", "Деловая переписка"],
  },
  'uchet-i-audit': {
    id: "04140100", full: "Учет и аудит",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200",
    duration: "2 года 10 месяцев", form: "Очная",
    desc: "Бухгалтерский учёт, финансовая отчётность и аудит предприятий. Студенты осваивают работу с 1С, международные стандарты финансовой отчётности и налоговое законодательство РК.",
    subjects: ["Бухгалтерский учёт", "Налогообложение", "МСФО", "Финансовый анализ", "Аудит", "1С: Бухгалтерия", "Управленческий учёт", "Экономика предприятия"],
    careers: ["Бухгалтер", "Аудитор", "Финансовый аналитик", "Налоговый консультант", "Главный бухгалтер"],
    skills: ["Ведение бухучёта", "Составление отчётности", "Работа в 1С", "Налоговое планирование", "Финансовый анализ"],
  },
  'menedzhment': {
    id: "04130100", full: "Менеджмент",
    img: "https://images.unsplash.com/photo-1454165833767-027ffea9e778?q=80&w=1200",
    duration: "2 года 10 месяцев", form: "Очная",
    desc: "Управление организациями, проектами и командами. Стратегическое планирование, маркетинг и основы предпринимательства. Подготовка руководителей среднего звена для бизнеса.",
    subjects: ["Управление проектами", "Стратегический менеджмент", "HR-менеджмент", "Бизнес-планирование", "Маркетинг", "Финансы для менеджеров", "Деловые коммуникации", "Лидерство"],
    careers: ["Менеджер проектов", "Руководитель отдела", "Бизнес-аналитик", "Предприниматель", "Офис-менеджер"],
    skills: ["Управление командой", "Планирование", "Переговоры", "Принятие решений", "Тайм-менеджмент"],
  },
  'marketing': {
    id: "04140100", full: "Маркетинг",
    img: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1200",
    duration: "2 года 10 месяцев", form: "Очная",
    desc: "Цифровой маркетинг, брендинг и продвижение товаров и услуг. SMM, контент-маркетинг, аналитика и работа с рекламными платформами. Актуальные инструменты интернет-маркетинга.",
    subjects: ["Digital-маркетинг", "SMM", "Брендинг", "Маркетинговый анализ", "Контент-маркетинг", "SEO/SEM", "Email-маркетинг", "Маркетинговые исследования"],
    careers: ["SMM-специалист", "Маркетолог", "Контент-менеджер", "Бренд-менеджер", "Таргетолог"],
    skills: ["Ведение соцсетей", "Создание контента", "Аналитика данных", "Работа с рекламой", "Копирайтинг"],
  },
  'bankovskoe-delo': {
    id: "04120100", full: "Банковское дело",
    img: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=1200",
    duration: "2 года 10 месяцев", form: "Очная",
    desc: "Банковские операции, кредитование и финансовые рынки. Подготовка специалистов для работы в банках, страховых компаниях и финансовых организациях Республики Казахстан.",
    subjects: ["Банковские операции", "Кредитование", "Финансовые рынки", "Валютные операции", "Банковское законодательство", "Риск-менеджмент", "Страхование", "Инвестиции"],
    careers: ["Банковский специалист", "Кредитный менеджер", "Финансовый консультант", "Специалист по валютным операциям", "Риск-менеджер"],
    skills: ["Банковские операции", "Кредитный анализ", "Работа с клиентами", "Финансовое планирование", "Управление рисками"],
  },
};

export default function SpecPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const spec = SPECS[slug];
  if (!spec) notFound();

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <Link href="/#specs" className="fixed top-6 left-6 z-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
        <ArrowLeft size={14} /> Назад
      </Link>

      <div className="relative h-[60vh] overflow-hidden">
        <img src={spec.img} className="w-full h-full object-cover opacity-40" alt={spec.full} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="absolute bottom-12 left-8 md:left-16 right-8 md:right-16">
          <p className="text-red-600 font-mono text-xs mb-4 tracking-widest">{spec.id}</p>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">{spec.full}</h1>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4">
          {[
            { icon: Clock, label: 'Срок обучения', value: spec.duration },
            { icon: Users, label: 'Форма обучения', value: spec.form },
            { icon: BookOpen, label: 'Дисциплин', value: spec.subjects.length + ' предметов' },
            { icon: Briefcase, label: 'Профессий', value: spec.careers.length + ' направлений' },
          ].map(({ icon: Icon, label, value }: any) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <Icon size={18} className="text-red-600" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">{label}</p>
                <p className="text-sm font-black text-white">{value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 mb-4">О специальности</p>
          <p className="text-gray-300 text-lg leading-relaxed">{spec.desc}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 mb-6">Дисциплины</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {spec.subjects.map((s: string, i: number) => (
              <motion.div key={s} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-600/30 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">{s}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 mb-6">Кем работать</p>
            <div className="space-y-3">
              {spec.careers.map((c: string, i: number) => (
                <div key={c} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-red-600 font-mono text-xs">0{i + 1}</span>
                  <span className="font-black uppercase tracking-tighter text-sm">{c}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 mb-6">Навыки</p>
            <div className="space-y-3">
              {spec.skills.map((s: string, i: number) => (
                <div key={s} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-red-600 font-mono text-xs">0{i + 1}</span>
                  <span className="font-black uppercase tracking-tighter text-sm">{s}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
          <a href="https://wa.me/77273132028" target="_blank" rel="noopener noreferrer"
            className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white text-center font-black italic uppercase tracking-tighter text-lg rounded-2xl transition-colors">
            Поступить на специальность
          </a>
          <Link href="/"
            className="flex-1 py-4 border border-white/10 hover:border-white/20 text-white text-center font-black italic uppercase tracking-tighter text-lg rounded-2xl transition-colors">
            Другие специальности
          </Link>
        </motion.div>
      </div>
    </div>
  );
}