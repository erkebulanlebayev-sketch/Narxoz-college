'use client';

import UniversalLayout from '@/components/UniversalLayout';

export default function AdminSettingsPage() {
  return (
    <UniversalLayout role="admin">
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Настройки системы</h1>
          <p className="text-gray-600">Управление параметрами системы</p>
        </div>

        <div className="space-y-6">
          <div className="ferris-card rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Общие настройки</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название учебного заведения</label>
                <input 
                  type="text" 
                  defaultValue="Narxoz College"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email администратора</label>
                <input 
                  type="email" 
                  defaultValue="admin@narxoz.kz"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Часовой пояс</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                  <option>UTC+6 (Алматы)</option>
                  <option>UTC+5 (Актау)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="ferris-card rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Настройки оценок</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Минимальный проходной балл</p>
                  <p className="text-sm text-gray-600">Минимальная оценка для зачета</p>
                </div>
                <input 
                  type="number" 
                  defaultValue="50"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Максимальный балл</p>
                  <p className="text-sm text-gray-600">Максимальная оценка</p>
                </div>
                <input 
                  type="number" 
                  defaultValue="100"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="ferris-card rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Уведомления</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-500" />
                <span>Email уведомления о новых студентах</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-500" />
                <span>Уведомления об изменениях в расписании</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-amber-500" />
                <span>Еженедельные отчеты</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all">
              Отмена
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all">
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </UniversalLayout>
  );
}
