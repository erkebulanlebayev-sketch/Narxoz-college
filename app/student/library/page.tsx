'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { Library, Search, BookOpen } from 'lucide-react';

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Электронная <span className="text-red-600">Библиотека</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">{books.length} книг в каталоге</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Всего книг', value: books.length, color: 'text-white' },
            { label: 'Доступно', value: books.filter(b => b.available).length, color: 'text-green-500' },
            { label: 'Занято', value: books.filter(b => !b.available).length, color: 'text-red-500' },
            { label: 'Категорий', value: categories.length - 1, color: 'text-gray-400' },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-mono text-gray-600 mt-1 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input type="text" placeholder="Поиск по названию или автору..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50"
          />
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-red-600/10 border-red-600/30 text-red-500'
                    : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Library size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold uppercase text-sm tracking-widest">
              {searchQuery || selectedCategory !== 'Все' ? 'Книги не найдены' : 'Библиотека пуста'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((book, i) => (
              <motion.div key={book.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black italic uppercase text-sm tracking-tight leading-tight mb-1">{book.title}</h3>
                    <p className="text-gray-500 text-xs font-mono truncate">{book.author}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    {book.category}
                  </span>
                  {book.pages && (
                    <span className="text-[10px] font-mono text-gray-600">{book.pages} стр.</span>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                  <span className={`text-[11px] font-black uppercase tracking-widest ${book.available ? 'text-green-500' : 'text-red-500'}`}>
                    {book.available ? '● Доступна' : '○ Занята'}
                  </span>
                  <button
                    disabled={!book.available}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      book.available
                        ? 'border-red-600/30 text-red-500 hover:bg-red-600/10'
                        : 'border-white/5 text-gray-700 cursor-not-allowed'
                    }`}
                  >
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
