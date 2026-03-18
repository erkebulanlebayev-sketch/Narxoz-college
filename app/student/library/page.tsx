'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Library, Search, BookOpen, Download } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn?: string;
  pages?: number;
  available: boolean;
  created_at: string;
}

export default function StudentLibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  useEffect(() => {
    loadBooks();
    const channel = supabase
      .channel('student-library-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'library_books' }, loadBooks)
      .subscribe();
    const interval = setInterval(loadBooks, 10000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, []);

  async function loadBooks() {
    try {
      const { data } = await supabase.from('library_books').select('*').order('title');
      setBooks(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const categories = ['Все', ...Array.from(new Set(books.map(b => b.category)))];
  const filtered = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'Все' || b.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <DarkLayout role="student">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

        {/* HEADER */}
        <div className="border-b border-white/5 pb-8">
          <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-3">Narxoz College</p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Библиотека
          </h1>
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-600">
            <span>{books.length} книг</span>
            <span className="text-green-500">{books.filter(b => b.available).length} доступно</span>
            <span className="text-red-500">{books.filter(b => !b.available).length} занято</span>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Поиск по названию или автору..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/40 transition-all"
          />
        </div>

        {/* CATEGORY TABS */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 text-gray-700">
            <Library size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-black italic uppercase text-xl tracking-tighter">
              {searchQuery || selectedCategory !== 'Все' ? 'Книги не найдены' : 'Библиотека пуста'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((book, i) => (
              <motion.div key={book.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group relative p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col"
              >
                {/* Status dot */}
                <div className={`absolute top-5 right-5 w-2 h-2 rounded-full ${book.available ? 'bg-green-500' : 'bg-red-500'}`} />

                <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-5">
                  <BookOpen size={20} className="text-red-500" />
                </div>

                <div className="mb-4 flex-1">
                  <p className="text-red-600 font-mono text-[9px] tracking-widest uppercase mb-2">{book.category}</p>
                  <h3 className="font-black italic uppercase text-base tracking-tight leading-tight mb-1">{book.title}</h3>
                  <p className="text-gray-500 text-xs font-mono">{book.author}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${book.available ? 'text-green-500' : 'text-red-500'}`}>
                      {book.available ? '● Доступна' : '○ Занята'}
                    </span>
                    {book.pages && <p className="text-[9px] text-gray-700 font-mono mt-0.5">{book.pages} стр.</p>}
                  </div>
                  <button
                    disabled={!book.available}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      book.available
                        ? 'border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600'
                        : 'border-white/5 text-gray-700 cursor-not-allowed'
                    }`}
                  >
                    <Download size={11} />
                    {book.available ? 'Читать' : 'Занята'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </motion.div>
    </DarkLayout>
  );
}