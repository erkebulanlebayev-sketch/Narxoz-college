'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const timeline = [
  {
    year: '2002',
    date: '17 мая',
    text: 'По приказу Министерства образования и науки РК №01-05/53 был образован Экономический Колледж-Лицей в городе Талгар. Первым директором назначен кандидат технических наук, профессор КазЭУ Сальменбаев Н.А.',
  },
  {
    year: '2005',
    date: '25 июня',
    text: 'Решением совета директоров АО «КазЭУ им.Т.Рыскулова» открылся филиал в Алматы.',
  },
  {
    year: '2006',
    date: '29 мая',
    text: 'Принято решение о переносе головного корпуса колледжа по адресу: г.Алматы, 10 мкр, дом 7А. Учреждение в г.Талгаре преобразовано в филиал, а алматинский филиал — в самостоятельное учреждение.',
  },
  {
    year: '2013',
    date: '25 ноября',
    text: 'Закрыт филиал колледжа в г.Талгар (ул.Лермонтова, 40). Создана дочерняя организация — Учреждение «Талгарский экономический колледж».',
  },
  {
    year: '2015',
    date: 'Январь',
    text: 'Очередная реорганизация: учреждение переименовано в «Экономический колледж Нового Экономического университета имени Турара Рыскулова».',
  },
  {
    year: '2016',
    date: 'Апрель',
    text: 'Колледж получает современное название — «Экономический колледж Университета Нархоз».',
  },
  {
    year: '2026',
    date: 'Сегодня',
    text: 'Экономический колледж Университета Нархоз функционирует в г.Алматы, готовя квалифицированных специалистов по 7 специальностям в соответствии с государственными и международными стандартами.',
    current: true,
  },
];

const achievements = [
  { label: 'Год основания', value: '2002' },
  { label: 'Специальностей', value: '7' },
  { label: 'Лет опыта', value: '24+' },
  { label: 'Город', value: 'Алматы' },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-red-600 overflow-x-hidden">

      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4 flex justify-between items-center bg-black/20">
        <Link href="/" className="font-black italic text-xl tracking-tighter uppercase">
          Narxoz <span className="text-red-600">College</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={12} /> На главную
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end pb-20 pt-32 px-6 md:px-16 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600"
          className="absolute inset-0 w-full h-full object-cover opacity-10" alt="College" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent" />
        <div className="relative z-10 max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-red-600 font-bold tracking-[0.6em] uppercase text-[9px] mb-6">
            2002 — 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[12vw] md:text-[8vw] font-black italic uppercase tracking-tighter leading-[0.85] mb-8">
            История<br /><span className="text-white/15">колледжа</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
            className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Более 20 лет Экономический колледж Университета Нархоз готовит квалифицированных специалистов для экономики Казахстана.
          </motion.p>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-20 bg-[#030303] py-16 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((a, i) => (
            <motion.div key={a.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 text-center">
              <p className="text-4xl md:text-5xl font-black italic text-red-600 tracking-tighter mb-2">{a.value}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">{a.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative z-20 bg-[#030303] py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-4">01</p>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-20">
              Хронология<br /><span className="text-white/15">событий</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[52px] top-0 bottom-0 w-px bg-white/5 hidden md:block" />

            <div className="space-y-8">
              {[...timeline].reverse().map((item, i) => (
                <motion.div key={item.year}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="flex gap-6 md:gap-10 items-start">
                  {/* year badge */}
                  <div className={`shrink-0 w-[88px] h-[88px] rounded-full flex flex-col items-center justify-center border font-black italic tracking-tighter text-center leading-tight
                    ${item.current
                      ? 'bg-red-600 border-red-600 text-white text-sm'
                      : 'bg-white/[0.04] border-white/10 text-white text-lg'}`}>
                    {item.current ? <><span className="text-[10px] font-black uppercase tracking-widest not-italic">Сегодня</span></> : item.year}
                  </div>
                  {/* content */}
                  <div className={`flex-1 p-6 rounded-[24px] border transition-all
                    ${item.current
                      ? 'bg-red-600/10 border-red-600/30'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                    {!item.current && (
                      <p className="text-red-600 font-mono text-xs tracking-widest mb-2">{item.date}</p>
                    )}
                    <p className="text-gray-300 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ПОЛНАЯ ИСТОРИЯ */}
      <section className="relative z-20 bg-[#030303] py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-4">02</p>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-16">
              О колледже<br /><span className="text-white/15">подробнее</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 text-gray-400 text-base leading-relaxed">
              <p>Экономический колледж Казахского экономического университета имени Турара Рыскулова был создан приказом Министерства образования и науки Республики Казахстан от 17 мая 2002 года № 01-05/53.</p>
              <p>Колледж был создан с целью повышения конкурентоспособности КазЭУ им.Т.Рыскулова на рынке образовательных услуг, организации подготовки учащейся молодёжи для поступления в данный Университет, выпуска специалистов экономического профиля среднего звена.</p>
              <p>Целью создания и деятельности колледжа является содействие развитию технического и профессионального, послесреднего образования в Республике Казахстан, удовлетворения социально-экономических потребностей республики в специалистах в соответствии с государственными и международными стандартами.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 text-gray-400 text-base leading-relaxed">
              <p>В колледже огромное внимание уделялось воспитательной работе. Функционировал Совет кураторов, который координировал организационную работу кураторов и помогал обучающимся в учебной деятельности и профессиональном самоопределении.</p>
              <p>Большое внимание уделялось профилактике и пропаганде здорового образа жизни. Обучающиеся участвовали в городских, районных, областных и республиканских соревнованиях, становясь призёрами международных турниров по вольной борьбе, каратэ, водному поло.</p>
              <p>С целью трудоустройства выпускников и установления связи с работодателями ежегодно колледж принимает участие в Ярмарках вакансий. Был создан «Центр по организации производственной практики, трудоустройству и связям с выпускниками».</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* РУКОВОДИТЕЛИ */}
      <section className="relative z-20 bg-[#030303] py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-4">03</p>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-16">
              История<br /><span className="text-white/15">руководителей</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                name: 'Сальменбаев Николай Ахметжанович',
                years: '2002–2005',
                note: 'Первый директор, к.т.н., профессор КазЭУ',
                img: 'https://collegenarxoz.kz/wp-content/uploads/2024/12/salmenbaev-e1734110802405-203x300.jpg',
                current: false,
              },
              {
                name: 'Маянлаева Гульмира Исмаиловна',
                years: '2005–2006',
                note: '',
                img: 'https://collegenarxoz.kz/wp-content/uploads/2024/11/majnlaeva-e1734110566263-300x300.jpeg',
                current: false,
              },
              {
                name: 'Есмуканов Карим Есмуканович',
                years: '2006–2010',
                note: '',
                img: 'https://collegenarxoz.kz/wp-content/uploads/2024/12/esmuhanov-scaled-e1734110472719-300x249.jpg',
                current: false,
              },
              {
                name: 'Абиров Жанибек Асылбекович',
                years: '2011–2016',
                note: '',
                img: 'https://collegenarxoz.kz/wp-content/uploads/2024/12/esmukanov-e1734110299794-300x283.jpg',
                current: false,
              },
              {
                name: 'Сатаев Санат Акылжанулы',
                years: '2017–2024',
                note: '',
                img: 'https://collegenarxoz.kz/wp-content/uploads/2024/11/team1-300x263.jpg',
                current: false,
              },
              {
                name: 'Абайдуллаев Мақсат Серікболұлы',
                years: '2024 — н.в.',
                note: 'Нынешний директор',
                img: 'https://collegenarxoz.kz/wp-content/uploads/2025/08/img_4588-scaled-e1754566199777-451x301.jpg',
                current: true,
              },
            ].map((person, i) => (
              <motion.div key={person.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group relative rounded-[20px] overflow-hidden border transition-all
                  ${person.current ? 'border-red-600/40 shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'border-white/5 hover:border-white/15'}`}>
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img src={person.img} alt={person.name}
                    className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  {person.current && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 rounded-lg">
                      <p className="text-[8px] font-black uppercase tracking-widest">Сейчас</p>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-red-600 font-mono text-[10px] tracking-widest mb-1">{person.years}</p>
                  <p className="font-black text-xs uppercase tracking-tighter leading-tight text-white">{person.name}</p>
                  {person.note && <p className="text-gray-600 text-[10px] mt-1 leading-tight">{person.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ЗАДАЧИ */}
      <section className="relative z-20 bg-[#030303] py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-red-600 font-bold tracking-[0.5em] uppercase text-[9px] mb-4">04</p>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-16">
              Миссия<br /><span className="text-white/15">и задачи</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Реализация образовательных профессиональных программ технического и профессионального образования',
              'Подготовка квалифицированных специалистов с техническим и профессиональным образованием',
              'Внедрение новых технологий обучения, информатизация деятельности колледжа',
              'Организация сотрудничества с организациями образования стран дальнего и ближнего зарубежья',
              'Формирование интеллектуально, физически и духовно развитого гражданина Республики Казахстан',
              'Обеспечение равного доступа всех участников образовательного процесса к лучшим образовательным ресурсам',
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

      <footer className="relative z-20 bg-black py-12 px-6 md:px-16 border-t border-white/5 text-center">
        <p className="text-[9px] text-gray-800 font-bold uppercase tracking-[0.5em]">
          © 2026 Economic College Narxoz · История колледжа · 2002–2026
        </p>
      </footer>
    </div>
  );
}
