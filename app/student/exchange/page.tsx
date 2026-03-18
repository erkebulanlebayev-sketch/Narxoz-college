'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase, Material } from '@/lib/supabase';
import { Upload, FileText, Download, Trash2, Plus, X, ArrowLeftRight } from 'lucide-react';

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'notes', name: 'Конспекты' },
  { id: 'homework', name: 'Домашки' },
  { id: 'projects', name: 'Проекты' },
  { id: 'exams', name: 'Экзамены' },
];

export default function ExchangePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [myMaterials, setMyMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [uploadForm, setUploadForm] = useState({
    title: '', description: '', category: 'notes' as 'notes' | 'homework' | 'projects' | 'exams',
    subject: '', tags: '', file: null as File | null
  });

  useEffect(() => {
    loadCurrentUser();
    loadMaterials();
    const channel = supabase.channel('exchange-materials-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'materials' }, () => {
        loadMaterials();
        if (currentUserId) loadMyMaterials();
      }).subscribe();
    const interval = setInterval(() => {
      loadMaterials();
      if (currentUserId) loadMyMaterials();
    }, 10000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, []);

  useEffect(() => { if (currentUserId) loadMyMaterials(); }, [currentUserId]);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      const { data } = await supabase.from('users').select('name').eq('id', user.id).single();
      if (data) setCurrentUserName(data.name);
    }
  };

  const loadMaterials = async () => {
    setLoading(true);
    const { data } = await supabase.from('materials').select('*').order('created_at', { ascending: false });
    if (data) setMaterials(data);
    setLoading(false);
  };

  const loadMyMaterials = async () => {
    if (!currentUserId) return;
    const { data } = await supabase.from('materials').select('*').eq('author_id', currentUserId).order('created_at', { ascending: false });
    if (data) setMyMaterials(data);
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !currentUserId || !currentUserName) return;
    setUploading(true);
    try {
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `materials/${currentUserId}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('materials').upload(filePath, uploadForm.file);
      if (uploadError) throw uploadError;
      const tags = uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      const { error: dbError } = await supabase.from('materials').insert({
        title: uploadForm.title, description: uploadForm.description,
        category: uploadForm.category, subject: uploadForm.subject, tags,
        file_name: uploadForm.file.name, file_path: filePath,
        file_size: uploadForm.file.size, file_type: uploadForm.file.type,
        author_id: currentUserId, author_name: currentUserName
      });
      if (dbError) throw dbError;
      setShowUploadModal(false);
      setUploadForm({ title: '', description: '', category: 'notes', subject: '', tags: '', file: null });
      loadMaterials(); loadMyMaterials();
    } catch (e: any) { alert('Ошибка: ' + e.message); }
    finally { setUploading(false); }
  };

  const handleDownload = async (material: Material) => {
    const { data } = supabase.storage.from('materials').getPublicUrl(material.file_path);
    if (data.publicUrl) {
      window.open(data.publicUrl, '_blank');
      await supabase.from('materials').update({ downloads: material.downloads + 1 }).eq('id', material.id);
      loadMaterials();
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm('Удалить материал?')) return;
    await supabase.storage.from('materials').remove([filePath]);
    await supabase.from('materials').delete().eq('id', id);
    loadMaterials(); loadMyMaterials();
  };

  const getTimeAgo = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    if (diff === 0) return 'Сегодня';
    if (diff === 1) return '1 день назад';
    if (diff < 7) return `${diff} дня назад`;
    return new Date(d).toLocaleDateString('ru-RU');
  };

  const filtered = materials.filter(m => selectedCategory === 'all' || m.category === selectedCategory);

  return (
    <DarkLayout role="student">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

        {/* HEADER */}
        <div className="flex items-end justify-between border-b border-white/5 pb-8">
          <div>
            <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-3">Narxoz College</p>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
              Материалы
            </h1>
            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">{materials.length} файлов в базе</p>
          </div>
          <button onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
            <Plus size={14} /> Загрузить
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2">
          {[{ id: 'all', label: 'Все материалы' }, { id: 'my', label: 'Мои загрузки' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as 'all' | 'my')}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeTab === tab.id ? 'bg-red-600 border-red-600 text-white' : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-white'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'all' && (
          <>
            {/* CATEGORY FILTER */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-gray-600 hover:border-white/10 hover:text-gray-400'
                  }`}>
                  {cat.name}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-32 text-gray-700">
                <ArrowLeftRight size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-black italic uppercase text-xl tracking-tighter">Материалов пока нет</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((m, i) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="group p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col">
                    <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-5">
                      <FileText size={20} className="text-red-500" />
                    </div>
                    <div className="flex-1 mb-4">
                      <p className="text-red-600 font-mono text-[9px] tracking-widest uppercase mb-2">{m.category} · {m.subject}</p>
                      <h3 className="font-black italic uppercase text-base tracking-tight leading-tight mb-1">{m.title}</h3>
                      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">{m.description}</p>
                      {m.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {m.tags.slice(0, 3).map((tag: string, ti: number) => (
                            <span key={ti} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-gray-600">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[9px] font-mono text-gray-700">{m.author_name}</p>
                        <p className="text-[9px] font-mono text-gray-700">{getTimeAgo(m.created_at)}</p>
                      </div>
                      <button onClick={() => handleDownload(m)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                        <Download size={11} /> Скачать
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'my' && (
          myMaterials.length === 0 ? (
            <div className="text-center py-32 text-gray-700">
              <Upload size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-black italic uppercase text-xl tracking-tighter">Нет загруженных материалов</p>
              <button onClick={() => setShowUploadModal(true)}
                className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                Загрузить первый
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {myMaterials.map((m, i) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-5">
                    <FileText size={20} className="text-red-500" />
                  </div>
                  <div className="flex-1 mb-4">
                    <p className="text-red-600 font-mono text-[9px] tracking-widest uppercase mb-2">{m.category} · {m.subject}</p>
                    <h3 className="font-black italic uppercase text-base tracking-tight leading-tight mb-1">{m.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2">{m.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[9px] font-mono text-gray-700">{(m.file_size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="text-[9px] font-mono text-gray-700">{m.downloads} скачиваний</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleDownload(m)}
                        className="p-2.5 rounded-xl border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all">
                        <Download size={14} />
                      </button>
                      <button onClick={() => handleDelete(m.id, m.file_path)}
                        className="p-2.5 rounded-xl border border-white/10 text-gray-500 hover:text-red-500 hover:border-red-600/30 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}

      </motion.div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[28px] p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-1">Загрузка</p>
                <h2 className="font-black italic uppercase text-2xl tracking-tighter">Новый материал</h2>
              </div>
              <button onClick={() => setShowUploadModal(false)}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Название материала" value={uploadForm.title}
                onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/40 transition-all" />
              <textarea placeholder="Описание" value={uploadForm.description} rows={2}
                onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/40 transition-all resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Предмет" value={uploadForm.subject}
                  onChange={e => setUploadForm(f => ({ ...f, subject: e.target.value }))}
                  className="px-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/40 transition-all" />
                <select value={uploadForm.category} onChange={e => setUploadForm(f => ({ ...f, category: e.target.value as any }))}
                  className="px-4 py-3 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-red-600/40 transition-all">
                  <option value="notes">Конспекты</option>
                  <option value="homework">Домашки</option>
                  <option value="projects">Проекты</option>
                  <option value="exams">Экзамены</option>
                </select>
              </div>
              <input type="text" placeholder="Теги через запятую" value={uploadForm.tags}
                onChange={e => setUploadForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/40 transition-all" />
              <div className="border-2 border-dashed border-white/10 hover:border-white/20 rounded-2xl p-8 text-center transition-all">
                <input type="file" id="file-upload" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file && file.size <= 50 * 1024 * 1024) setUploadForm(f => ({ ...f, file }));
                    else if (file) alert('Файл слишком большой (макс. 50MB)');
                  }} />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload size={28} className="mx-auto mb-3 text-gray-600" />
                  {uploadForm.file ? (
                    <div>
                      <p className="text-red-500 font-black italic uppercase text-sm">{uploadForm.file.name}</p>
                      <p className="text-gray-600 text-xs mt-1">{(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Нажмите для выбора</p>
                      <p className="text-gray-700 text-xs mt-1">PDF, DOC, PPT, ZIP — макс. 50MB</p>
                    </div>
                  )}
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-white/10 text-gray-400 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all">
                  Отмена
                </button>
                <button onClick={handleUpload} disabled={!uploadForm.title || !uploadForm.subject || !uploadForm.file || uploading}
                  className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-widest transition-all">
                  {uploading ? 'Загрузка...' : 'Загрузить'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </DarkLayout>
  );
}