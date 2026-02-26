'use client';

import { useState, useEffect } from 'react';
import StudentLayout from '@/components/StudentLayout';
import { supabase, Material } from '@/lib/supabase';

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
    title: '',
    description: '',
    category: 'notes' as 'notes' | 'homework' | 'projects' | 'exams',
    subject: '',
    tags: '',
    file: null as File | null
  });

  useEffect(() => {
    loadCurrentUser();
    loadMaterials();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadMyMaterials();
    }
  }, [currentUserId]);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      const { data: userData } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();
      if (userData) {
        setCurrentUserName(userData.name);
      }
    }
  };

  const loadMaterials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setMaterials(data);
    }
    setLoading(false);
  };

  const loadMyMaterials = async () => {
    if (!currentUserId) return;
    
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('author_id', currentUserId)
      .order('created_at', { ascending: false });
    
    if (data) {
      setMyMaterials(data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Проверка размера файла (50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('Файл слишком большой! Максимальный размер: 50MB');
        return;
      }
      
      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !currentUserId || !currentUserName) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setUploading(true);

    try {
      // Генерируем уникальное имя файла
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `materials/${currentUserId}/${fileName}`;

      // Загружаем файл в Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('materials')
        .upload(filePath, uploadForm.file);

      if (uploadError) {
        throw uploadError;
      }

      // Парсим теги
      const tags = uploadForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Сохраняем метаданные в базу данных
      const { data: materialData, error: dbError } = await supabase
        .from('materials')
        .insert({
          title: uploadForm.title,
          description: uploadForm.description,
          category: uploadForm.category,
          subject: uploadForm.subject,
          tags,
          file_name: uploadForm.file.name,
          file_path: filePath,
          file_size: uploadForm.file.size,
          file_type: uploadForm.file.type,
          author_id: currentUserId,
          author_name: currentUserName
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      alert('Материал успешно загружен!');
      setShowUploadModal(false);
      setUploadForm({
        title: '',
        description: '',
        category: 'notes',
        subject: '',
        tags: '',
        file: null
      });

      // Обновляем списки
      loadMaterials();
      loadMyMaterials();

    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Ошибка загрузки: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (material: Material) => {
    try {
      // Получаем публичный URL файла
      const { data } = supabase.storage
        .from('materials')
        .getPublicUrl(material.file_path);

      if (data.publicUrl) {
        // Открываем файл в новой вкладке
        window.open(data.publicUrl, '_blank');

        // Увеличиваем счетчик загрузок
        await supabase
          .from('materials')
          .update({ downloads: material.downloads + 1 })
          .eq('id', material.id);

        // Обновляем локальное состояние
        loadMaterials();
        if (currentUserId === material.author_id) {
          loadMyMaterials();
        }
      }
    } catch (error: any) {
      console.error('Download error:', error);
      alert('Ошибка при скачивании файла');
    }
  };

  const handleDelete = async (materialId: string, filePath: string) => {
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

      alert('Материал успешно удален');
      loadMaterials();
      loadMyMaterials();

    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Ошибка при удалении материала');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return '1 день назад';
    if (diffDays < 7) return `${diffDays} дня назад`;
    if (diffDays < 14) return '1 неделю назад';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недели назад`;
    return date.toLocaleDateString('ru-RU');
  };

  const categories = [
    { id: 'all', name: 'Все', icon: '📚' },
    { id: 'notes', name: 'Конспекты', icon: '📝' },
    { id: 'homework', name: 'Домашки', icon: '✍️' },
    { id: 'projects', name: 'Проекты', icon: '💻' },
    { id: 'exams', name: 'Экзамены', icon: '🎓' }
  ];

  const filteredMaterials = materials.filter(m => 
    selectedCategory === 'all' || m.category === selectedCategory
  );

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-black bg-clip-text text-transparent mb-2">
            🔄 Обменник знаниями
          </h1>
          <p className="text-gray-600">Делитесь материалами и помогайте друг другу</p>
        </div>

        {/* Табы */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg'
                : 'ferris-card hover:scale-105'
            }`}
          >
            📚 Все материалы
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'my'
                ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg'
                : 'ferris-card hover:scale-105'
            }`}
          >
            📤 Мои загрузки
          </button>
        </div>

        {activeTab === 'all' && (
          <>
            {/* Категории */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-white text-red-600 shadow-md'
                      : 'ferris-card hover:scale-105'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* Список материалов */}
            {loading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-600">Загрузка материалов...</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="ferris-card p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold mb-2">Материалов пока нет</h3>
                <p className="text-gray-600">Будьте первым, кто загрузит материал!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredMaterials.map(material => (
                  <div key={material.id} className="ferris-card p-6 hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold gradient-text mb-2">{material.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{material.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {material.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>👤 {material.author_name}</span>
                          <span>📚 {material.subject}</span>
                          <span>🕒 {getTimeAgo(material.created_at)}</span>
                          <span>📦 {(material.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center gap-1 text-yellow-500 mb-2">
                          <span className="text-2xl">⭐</span>
                          <span className="text-xl font-bold">{material.rating.toFixed(1)}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          📥 {material.downloads} скачиваний
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleDownload(material)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        📥 Скачать
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'my' && (
          <div className="space-y-6">
            {/* Кнопка загрузки */}
            <div className="ferris-card p-8 text-center">
              <div className="text-6xl mb-4">📤</div>
              <h3 className="text-2xl font-bold mb-2">Загрузите свои материалы</h3>
              <p className="text-gray-600 mb-4">Помогите другим студентам и заработайте репутацию</p>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-red-600 to-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                ➕ Загрузить материал
              </button>
            </div>

            {/* Мои материалы */}
            {myMaterials.length === 0 ? (
              <div className="ferris-card p-12 text-center">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-2xl font-bold mb-2">У вас пока нет загруженных материалов</h3>
                <p className="text-gray-600">Загрузите свой первый материал!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {myMaterials.map(material => (
                  <div key={material.id} className="ferris-card p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold gradient-text mb-2">{material.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{material.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {material.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📚 {material.subject}</span>
                          <span>🕒 {getTimeAgo(material.created_at)}</span>
                          <span>📦 {(material.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center gap-1 text-yellow-500 mb-2">
                          <span>⭐</span>
                          <span className="font-bold">{material.rating.toFixed(1)}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          📥 {material.downloads}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={() => handleDownload(material)}
                        className="px-4 py-2 ferris-card hover:scale-105 transition-all"
                      >
                        📥 Скачать
                      </button>
                      <button 
                        onClick={() => handleDelete(material.id, material.file_path)}
                        className="px-4 py-2 ferris-card hover:scale-105 transition-all text-red-600"
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Модальное окно загрузки */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold gradient-text">📤 Загрузить материал</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Название материала *
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Например: Конспект по Математическому анализу"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Описание *
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                  placeholder="Опишите содержание материала..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Категория *
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as 'notes' | 'homework' | 'projects' | 'exams' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="notes">📝 Конспекты</option>
                    <option value="homework">✍️ Домашки</option>
                    <option value="projects">💻 Проекты</option>
                    <option value="exams">🎓 Экзамены</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Предмет *
                  </label>
                  <input
                    type="text"
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Математика"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Теги (через запятую)
                </label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="интегралы, производные, пределы"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Файл *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-5xl mb-3">📁</div>
                    {uploadForm.file ? (
                      <div>
                        <p className="text-green-600 font-semibold">{uploadForm.file.name}</p>
                        <p className="text-sm text-gray-500">{(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB</p>
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

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Отмена
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadForm.title || !uploadForm.description || !uploadForm.subject || !uploadForm.file || uploading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? '⏳ Загрузка...' : '📤 Загрузить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
