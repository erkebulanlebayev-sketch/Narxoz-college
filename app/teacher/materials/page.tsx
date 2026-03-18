'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { Upload, FileText, Download, Trash2, Plus, X, Search } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  description: string;
  subject: string;
  material_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
  teacher_id: number;
}

const typeLabels: Record<string, string> = {
  lecture: 'Лекция', assignment: 'Задание', test: 'Тест', exam: 'Экзамен'
};

const typeColors: Record<string, string> = {
  lecture: 'text-blue-400', assignment: 'text-yellow-400', test: 'text-purple-400', exam: 'text-red-400'
};

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', subject: '', material_type: 'lecture', file: null as File | null
  });

  useEffect(() => {
    loadMaterials();
    const channel = supabase
      .channel('teacher-materials-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'materials' }, loadMaterials)
      .subscribe();
    const interval = setInterval(loadMaterials, 10000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, []);

  async function loadMaterials() {
    try {
      const user = await getCurrentUser();
      const { data: teacherData } = await supabase
        .from('teachers').select('id').eq('email', user?.email).single();
      if (!teacherData) { setLoading(false); return; }
      const { data } = await supabase
        .from('materials').select('*')
        .eq('teacher_id', teacherData.id)
        .order('created_at', { ascending: false });
      setMaterials(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.file) { alert('Выберите файл'); return; }
    setUploading(true);
    try {
      const user = await getCurrentUser();
      const { data: teacherData } = await supabase
        .from('teachers').select('id').eq('email', user?.email).single();
      if (!teacherData) { alert('Учитель не найден'); return; }
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `teacher-materials/${teacherData.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('materials').upload(filePath, formData.file);
      if (uploadError) throw uploadError;
      const { error: dbError } = await supabase.from('materials').insert([{
        title: formData.title, description: formData.description,
        subject: formData.subject, material_type: formData.material_type,
        file_name: formData.file.name, file_path: filePath,
        file_size: formData.file.size, file_type: formData.file.type,
        teacher_id: teacherData.id
      }]);
      if (dbError) throw dbError;
      setFormData({ title: '', description: '', subject: '', material_type: 'lecture', file: null });
      setShowModal(false);
      loadMaterials();
    } catch (e: any) { alert('Ошибка: ' + e.message); }
    finally { setUploading(false); }
  }

  async function handleDownload(material: Material) {
    const { data } = supabase.storage.from('materials').getPublicUrl(material.file_path);
    if (data.publicUrl) window.open(data.publicUrl, '_blank');
  }

  async function handleDelete(id: string, filePath: string) {
    if (!confirm('Удалить материал?')) return;
    await supabase.storage.from('materials').remove([filePath]);
    await supabase.from('materials').delete().eq('id', id);
    loadMaterials();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.size <= 50 * 1024 * 1024) setFormData(f => ({ ...f, file }));
  }

  const subjects = ['all', ...Array.from(new Set(materials.map(m => m.subject)))];
  const filtered = materials.filter(m => selectedSubject === 'all' || m.subject === selectedSubject);

  return (
    <DarkLayout role="teacher">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

        {/* HEADER */}
        <div className="flex items-end justify-between border-b border-white/5 pb-8">
          <div>
            <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-3">Narxoz College</p>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
              Материалы
            </h1>
            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">{materials.length} файлов загружено</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
          >
            <Plus size={14} /> Добавить
          </button>
        </div>

        {/* SUBJECT FILTER */}
        {subjects.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {subjects.map(s => (
              <button key={s} onClick={() => setSelectedSubject(s)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  selectedSubject === s
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-white'
                }`}
              >
                {s === 'all' ? 'Все' : s}
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
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-black italic uppercase text-xl tracking-tighter">Нет материалов</p>
            <p className="text-xs text-gray-700 mt-2 uppercase tracking-widest font-bold">Загрузите первый файл</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((m, i) => (
              <motion.div key={m.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group relative p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-5">
                  <FileText size={20} className="text-red-500" />
                </div>

                <div className="flex-1 mb-4">
                  <p className={`font-mono text-[9px] tracking-widest uppercase mb-2 ${typeColors[m.material_type] || 'text-gray-500'}`}>
                    {typeLabels[m.material_type] || m.material_type} · {m.subject}
                  </p>
                  <h3 className="font-black italic uppercase text-base tracking-tight leading-tight mb-1">{m.title}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{m.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[9px] font-mono text-gray-700">{(m.file_size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-[9px] font-mono text-gray-700">{new Date(m.created_at).toLocaleDateString('ru-RU')}</p>
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
        )}

      </motion.div>

      {/* UPLOAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[28px] p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-red-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-1">Загрузка</p>
                <h2 className="font-black italic uppercase text-2xl tracking-tighter">
                  Новый материал
                </h2>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <input type="text" placeholder="Название материала" value={formData.title}
                onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} required
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/40 transition-all"
              />
              <textarea placeholder="Описание" value={formData.description} rows={2}
                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} required
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/40 transition-all resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Предмет" value={formData.subject}
                  onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))} required
                  className="px-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/40 transition-all"
                />
                <select value={formData.material_type}
                  onChange={e => setFormData(f => ({ ...f, material_type: e.target.value }))}
                  className="px-4 py-3 bg-[#0a0a0a] border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-red-600/40 transition-all"
                >
                  <option value="lecture">Лекция</option>
                  <option value="assignment">Задание</option>
                  <option value="test">Тест</option>
                  <option value="exam">Экзамен</option>
                </select>
              </div>

              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragOver ? 'border-red-600/50 bg-red-600/5' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <input type="file" id="file-upload" className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file && file.size <= 50 * 1024 * 1024) setFormData(f => ({ ...f, file }));
                    else if (file) alert('Файл слишком большой (макс. 50MB)');
                  }}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload size={28} className="mx-auto mb-3 text-gray-600" />
                  {formData.file ? (
                    <div>
                      <p className="text-red-500 font-black italic uppercase text-sm">{formData.file.name}</p>
                      <p className="text-gray-600 text-xs mt-1">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Перетащите или нажмите</p>
                      <p className="text-gray-700 text-xs mt-1">PDF, DOC, PPT, ZIP — макс. 50MB</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-white/10 text-gray-400 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all">
                  Отмена
                </button>
                <button type="submit" disabled={uploading}
                  className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-widest transition-all">
                  {uploading ? 'Загрузка...' : 'Загрузить'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DarkLayout>
  );
}