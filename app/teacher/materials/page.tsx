'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DarkLayout from '@/components/DarkLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { Upload, FileText, Download, Trash2, Plus, X } from 'lucide-react';

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

      const { error: uploadError } = await supabase.storage
        .from('materials').upload(filePath, formData.file);
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Учебные <span className="text-red-600">Материалы</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">{materials.length} файлов</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
          >
            <Plus size={14} /> Добавить
          </button>
        </div>

        {/* Subject filter */}
        {subjects.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {subjects.map(s => (
              <button key={s}
                onClick={() => setSelectedSubject(s)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  selectedSubject === s
                    ? 'bg-red-600/10 border-red-600/30 text-red-500'
                    : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {s === 'all' ? 'Все' : s}
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
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold uppercase text-sm tracking-widest">Нет материалов</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((m, i) => (
              <motion.div key={m.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black italic uppercase text-sm tracking-tight truncate">{m.title}</h3>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                          {typeLabels[m.material_type] || m.material_type}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mb-2 line-clamp-1">{m.description}</p>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-gray-600">
                        <span>{m.subject}</span>
                        <span>·</span>
                        <span>{(m.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>·</span>
                        <span>{new Date(m.created_at).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleDownload(m)}
                      className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
                      <Download size={14} />
                    </button>
                    <button onClick={() => handleDelete(m.id, m.file_path)}
                      className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-red-500 hover:border-red-600/30 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black italic uppercase text-lg tracking-tight">
                Новый <span className="text-red-600">Материал</span>
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <input type="text" placeholder="Название материала" value={formData.title}
                onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50"
              />
              <textarea placeholder="Описание" value={formData.description} rows={2}
                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Предмет" value={formData.subject}
                  onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))} required
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50"
                />
                <select value={formData.material_type}
                  onChange={e => setFormData(f => ({ ...f, material_type: e.target.value }))}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-600/50"
                >
                  <option value="lecture">Лекция</option>
                  <option value="assignment">Задание</option>
                  <option value="test">Тест</option>
                  <option value="exam">Экзамен</option>
                </select>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
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
                  <Upload size={24} className="mx-auto mb-2 text-gray-600" />
                  {formData.file ? (
                    <div>
                      <p className="text-red-500 font-bold text-sm">{formData.file.name}</p>
                      <p className="text-gray-600 text-xs">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-400 text-sm font-bold">Перетащите файл или нажмите</p>
                      <p className="text-gray-600 text-xs mt-1">PDF, DOC, PPT, ZIP — макс. 50MB</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all">
                  Отмена
                </button>
                <button type="submit" disabled={uploading}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-widest transition-all">
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
