'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

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
  teachers?: { name: string };
}

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    material_type: 'lecture',
    file: null as File | null
  });

  useEffect(() => {
    loadMaterials();

    // Real-time подписка на материалы
    const materialsChannel = supabase
      .channel('teacher-materials-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'materials' },
        () => {
          console.log('✅ Материалы обновлены через Realtime!');
          loadMaterials();
        }
      )
      .subscribe();

    // Fallback: обновление каждые 10 секунд
    const interval = setInterval(loadMaterials, 10000);

    return () => {
      supabase.removeChannel(materialsChannel);
      clearInterval(interval);
    };
  }, []);

  async function loadMaterials() {
    try {
      const user = await getCurrentUser();
      
      // Получить ID учителя
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('id')
        .eq('email', user?.email)
        .single();

      if (!teacherData) {
        setLoading(false);
        return;
      }

      // Загрузить материалы учителя
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          teachers (name)
        `)
        .eq('teacher_id', teacherData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки материалов:', error);
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.file) {
      alert('Выберите файл для загрузки');
      return;
    }

    setUploading(true);

    try {
      const user = await getCurrentUser();
      
      // Получить ID учителя
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('id')
        .eq('email', user?.email)
        .single();

      if (!teacherData) {
        alert('Ошибка: учитель не найден');
        return;
      }

      // Генерируем уникальное имя файла
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `teacher-materials/${teacherData.id}/${fileName}`;

      // Загружаем файл в Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // Сохраняем метаданные в базу данных
      const { error: dbError } = await supabase
        .from('materials')
        .insert([{
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          material_type: formData.material_type,
          file_name: formData.file.name,
          file_path: filePath,
          file_size: formData.file.size,
          file_type: formData.file.type,
          teacher_id: teacherData.id
        }]);

      if (dbError) throw dbError;

      alert('✅ Материал успешно загружен!');
      setFormData({
        title: '',
        description: '',
        subject: '',
        material_type: 'lecture',
        file: null
      });
      setShowModal(false);
      loadMaterials();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(material: Material) {
    try {
      const { data } = supabase.storage
        .from('materials')
        .getPublicUrl(material.file_path);

      if (data.publicUrl) {
        window.open(data.publicUrl, '_blank');
      }
    } catch (error: any) {
      alert('Ошибка при скачивании файла');
    }
  }

  async function handleDelete(materialId: string, filePath: string) {
    if (!confirm('Вы уверены, что хотите удалить этот материал?')) {
      return;
    }

    try {
      // Удаляем файл из Storage
      await supabase.storage
        .from('materials')
        .remove([filePath]);

      // Удаляем запись из базы данных
      await supabase
        .from('materials')
        .delete()
        .eq('id', materialId);

      alert('✅ Материал успешно удален');
      loadMaterials();
    } catch (error: any) {
      alert('❌ Ошибка: ' + error.message);
    }
  }

  const subjects = ['all', ...Array.from(new Set(materials.map(m => m.subject)))];
  const filteredMaterials = materials.filter(m => 
    selectedSubject === 'all' || m.subject === selectedSubject
  );

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'lecture': return '📚';
      case 'assignment': return '✍️';
      case 'test': return '📝';
      case 'exam': return '🎓';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'lecture': return 'from-blue-500 to-indigo-500';
      case 'assignment': return 'from-green-500 to-emerald-500';
      case 'test': return 'from-yellow-500 to-orange-500';
      case 'exam': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <UniversalLayout role="teacher">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl gradient-text font-bold">Загрузка...</p>
        </div>
      </UniversalLayout>
    );
  }

  return (
    <UniversalLayout role="teacher">
      <div className="animate-fadeIn">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              📚 Учебные материалы
            </h1>
            <p className="text-gray-600">Управление материалами и заданиями</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            ➕ Добавить материал
          </button>
        </div>

        {/* Фильтр по предмету */}
        {subjects.length > 1 && (
          <div className="ferris-card p-4 mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Фильтр по предмету
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            >
              <option value="all">Все предметы</option>
              {subjects.filter(s => s !== 'all').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Список материалов */}
        {filteredMaterials.length === 0 ? (
          <div className="ferris-card p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-bold mb-2">Материалы пока не загружены</h3>
            <p className="text-gray-600">Загрузите первый материал для студентов</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMaterials.map((material, index) => (
              <div
                key={material.id}
                className="ferris-card p-6 hover-lift"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-14 h-14 bg-gradient-to-r ${getTypeColor(material.material_type)} rounded-xl flex items-center justify-center text-3xl`}>
                      {getTypeIcon(material.material_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{material.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{material.description}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
                        <span>📚 {material.subject}</span>
                        <span>📅 {new Date(material.created_at).toLocaleDateString('ru-RU')}</span>
                        <span>💾 {(material.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>📄 {material.file_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(material)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-semibold"
                    >
                      📥 Скачать
                    </button>
                    <button
                      onClick={() => handleDelete(material.id, material.file_path)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-semibold"
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Модальное окно загрузки */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold gradient-text mb-4">
                ➕ Добавить материал
              </h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Название материала
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Лекция 1: Введение"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Краткое описание материала..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Предмет
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Математика"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Тип материала
                    </label>
                    <select
                      value={formData.material_type}
                      onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    >
                      <option value="lecture">📚 Лекция</option>
                      <option value="assignment">✍️ Задание</option>
                      <option value="test">📝 Тест</option>
                      <option value="exam">🎓 Экзамен</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Файл
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.size > 50 * 1024 * 1024) {
                            alert('Файл слишком большой! Максимальный размер: 50MB');
                            return;
                          }
                          setFormData({ ...formData, file });
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-5xl mb-3">📁</div>
                      {formData.file ? (
                        <div>
                          <p className="text-green-600 font-semibold">{formData.file.name}</p>
                          <p className="text-sm text-gray-500">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 font-semibold mb-1">Нажмите для выбора файла</p>
                          <p className="text-sm text-gray-500">PDF, DOC, DOCX, PPT, PPTX, TXT, ZIP (макс. 50MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    ❌ Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {uploading ? '⏳ Загрузка...' : '✅ Загрузить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </UniversalLayout>
  );
}
