'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef(null);
  const [checking, setChecking] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    async function checkUser() {
      const user = await getCurrentUser();
      if (user) {
        const role = user.user_metadata?.role;
        if (role === 'admin') router.push('/admin');
        else if (role === 'teacher') router.push('/teacher');
        else if (role === 'student') router.push('/student');
      }
      setChecking(false);
    }
    checkUser();
  }, [router]);

  const specs = [
    { id: "06130100", name: "Software", full: "Программное обеспечение", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600" },
    { id: "04210100", name: "Law", full: "Правоведение", img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600" },
    { id: "04140100", name: "Audit", full: "Учет и аудит", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600" },
    { id: "04130100", name: "Management", full: "Менеджмент", img: "https://images.unsplash.com/photo-1454165833767-027ffea9e778?q=80&w=600" },
    { id: "04140100", name: "Marketing", full: "Маркетинг", img: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=600" },
    { id: "04120100", name: "Finance", full: "Банковское дело", img: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=600" },
  ];

  if (checking) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-[#030303] text-white selection:bg-red-600 overflow-x-hidden">

      {/* HEADER */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4 flex justify-between items-center bg-black/20">
        <div className="flex items-center gap-8">
          <div className="font-black italic text-xl tracking-tighter uppercase">
            Narxoz <span className="text-red-600">College</span>
          </div>
          <div className="hidden lg:flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <Link href="#about" className="hover:text-white transition-colors">О нас</Link>
            <Link href="#specs" className="hover:text-white transition-colors">Специальности</Link>
            <Link href="#contacts" className="hover:text-white transition-colors text-red-600">Приемная комиссия</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-2 text-[10px] font-bold mr-4 text-gray-500 uppercase">
            <span className="text-white">RU</span> / <span>KZ</span>
          </div>
          <Link href="/login">
            <button className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">
              Войти
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center sticky top-0 z-10 pt-20">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="text-center px-4">
          <span className="text-red-600 font-bold tracking-[0.6em] uppercase text-[9px] mb-6 block opacity-80">
            Almaty • Digital Education
          </span>
          <h1 className="text-[16vw] md:text-[12vw] font-black italic tracking-tighter leading-[0.75]">
            DIGITAL <br /> <span className="text-white/10">CAMPUS</span>
          </h1>
          <p className="mt-8 text-gray-500 uppercase tracking-[0.3em] text-[10px] max-w-xl mx-auto font-medium">
            Новые стандарты профессионального образования в Казахстане
          </p>
        </motion.div>
      </section>

      {/* СПЕЦИАЛЬНОСТИ */}
      <section id="specs" className="relative z-20 bg-[#030303] py-32 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">Профессии</h2>
            <div className="text-red-600 font-mono text-sm hidden md:block tracking-widest">[ 06 / 2026 ]</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {specs.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative h-[350px] md:h-[450px] rounded-[32px] overflow-hidden border border-white/5 bg-white/[0.02]"
              >
                <img src={spec.img} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 group-hover:opacity-50 transition-all duration-1000" alt={spec.full} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                  <div>
                    <p className="text-red-600 font-mono text-xs mb-3 tracking-widest">{spec.id}</p>
                    <h3 className="text-3xl md:text-4xl font-black italic uppercase leading-none">{spec.full}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section id="about" className="relative z-20 bg-[#030303] py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-black italic mb-8 uppercase tracking-tighter">Преимущества</h2>
            <div className="grid gap-4">
              {[
                { t: "Экспертные преподаватели", d: "Высококвалифицированный состав практиков." },
                { t: "Партнёрские компании", d: "Стажировки в крупнейших IT и финансовых секторах." },
                { t: "Развитие Soft Skills", d: "Критическое мышление и лидерские качества." }
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-[24px] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
                  <h4 className="font-black uppercase italic text-sm text-red-600 mb-2 tracking-widest group-hover:translate-x-2 transition-transform">{item.t}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/77273132028"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full aspect-square max-w-[400px] bg-red-600 rounded-[40px] flex flex-col items-center justify-center text-white shadow-[0_0_80px_rgba(227,6,19,0.15)]"
            >
              <MessageCircle size={60} fill="white" />
              <span className="mt-6 font-black text-2xl uppercase italic tracking-tighter">Поступить в 2026</span>
              <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Приемная комиссия</div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacts" className="relative z-20 bg-black pt-32 pb-12 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
          <div>
            <h5 className="font-bold text-xs mb-8 text-white uppercase tracking-widest">О колледже</h5>
            <ul className="text-gray-500 text-xs space-y-4 uppercase font-bold tracking-tighter">
              <li className="hover:text-red-600 cursor-pointer transition-colors">История</li>
              <li className="hover:text-red-600 cursor-pointer transition-colors">Антикоррупция</li>
              <li className="hover:text-red-600 cursor-pointer transition-colors">Контакты</li>
              <li className="hover:text-red-600 cursor-pointer transition-colors">Выпускники</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-xs mb-8 text-white uppercase tracking-widest">Поступающим</h5>
            <ul className="text-gray-500 text-xs space-y-4 uppercase font-bold tracking-tighter">
              <li className="hover:text-red-600 cursor-pointer transition-colors">Правила приема</li>
              <li className="hover:text-red-600 cursor-pointer transition-colors">Приемная комиссия</li>
              <li className="hover:text-red-600 cursor-pointer transition-colors">Стоимость</li>
            </ul>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <h5 className="font-bold text-xs mb-8 text-white uppercase tracking-widest">Студентам</h5>
            <ul className="text-gray-500 text-xs space-y-4 uppercase font-bold tracking-tighter">
              <li className="hover:text-red-600 cursor-pointer transition-colors">Расписание</li>
              <li className="hover:text-red-600 cursor-pointer transition-colors">Экзамены</li>
              <li className="hover:text-red-600 cursor-pointer transition-colors">Digital ID</li>
            </ul>
          </div>
          <div className="col-span-2 lg:text-right flex flex-col lg:items-end">
            <div className="font-black italic text-4xl mb-6 tracking-tighter leading-none">
              NARXOZ <br /> <span className="text-red-600 text-2xl uppercase">College</span>
            </div>
            <div className="space-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
              <p>+7 (727) 313-20-28</p>
              <p>info@college-narxoz.kz</p>
              <p className="mt-4">Алматы, 10-й микрорайон 7А</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] text-gray-800 font-bold uppercase tracking-[0.5em]">
            © 2026 Economic College Narxoz • Made for Future
          </p>
        </div>
      </footer>

    </div>
  );
}
