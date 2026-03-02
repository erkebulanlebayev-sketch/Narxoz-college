'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { getAuditLogs, AuditAction } from '@/lib/audit';

interface AuditLog {
  id: number;
  user_email: string;
  user_role: string;
  action: AuditAction;
  table_name?: string;
  record_id?: number;
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  created_at: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    action: '' as AuditAction | '',
    tableName: '',
    userEmail: '',
    startDate: '',
    endDate: ''
  });

  const pageSize = 50;

  useEffect(() => {
    loadLogs();
  }, [currentPage, filters]);

  async function loadLogs() {
    setLoading(true);
    try {
      const { data, error, count } = await getAuditLogs({
        action: filters.action || undefined,
        tableName: filters.tableName || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      });

      if (error) throw error;

      setLogs(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      alert('Ошибка загрузки логов');
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  const actionColors: Record<AuditAction, string> = {
    login: 'bg-green-100 text-green-800',
    logout: 'bg-gray-100 text-gray-800',
    create: 'bg-blue-100 text-blue-800',
    update: 'bg-yellow-100 text-yellow-800',
    delete: 'bg-red-100 text-red-800',
    access_denied: 'bg-red-200 text-red-900'
  };

  const actionLabels: Record<AuditAction, string> = {
    login: 'Вход',
    logout: 'Выход',
    create: 'Создание',
    update: 'Изменение',
    delete: 'Удаление',
    access_denied: 'Доступ запрещен'
  };

  return (
    <UniversalLayout role="admin">
      <div className="mb-8 animate-fadeIn text-center">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">📋 Журнал аудита</span>
        </h1>
        <p className="text-gray-600 text-lg font-medium">
          История всех действий в системе
        </p>
      </div>

      {/* Фильтры */}
      <div className="ferris-card p-6 mb-6 shadow-colorful">
        <h2 className="text-xl font-bold gradient-text mb-4">🔍 Фильтры</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Действие
            </label>
            <select
              value={filters.action}
              onChange={(e) => {
                setFilters({ ...filters, action: e.target.value as AuditAction | '' });
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            >
              <option value="">Все действия</option>
              <option value="login">Вход</option>
              <option value="logout">Выход</option>
              <option value="create">Создание</option>
              <option value="update">Изменение</option>
              <option value="delete">Удаление</option>
              <option value="access_denied">Доступ запрещен</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Таблица
            </label>
            <input
              type="text"
              value={filters.tableName}
              onChange={(e) => {
                setFilters({ ...filters, tableName: e.target.value });
                setCurrentPage(1);
              }}
              placeholder="Название таблицы"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email пользователя
            </label>
            <input
              type="text"
              value={filters.userEmail}
              onChange={(e) => {
                setFilters({ ...filters, userEmail: e.target.value });
                setCurrentPage(1);
              }}
              placeholder="user@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Дата от
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => {
                setFilters({ ...filters, startDate: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Дата до
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => {
                setFilters({ ...filters, endDate: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({
                  action: '',
                  tableName: '',
                  userEmail: '',
                  startDate: '',
                  endDate: ''
                });
                setCurrentPage(1);
              }}
              className="btn-secondary w-full"
            >
              ❌ Сбросить
            </button>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="ferris-card p-4 mb-6 shadow-colorful">
        <p className="text-gray-700 font-medium">
          Найдено записей: <span className="gradient-text font-bold text-xl">{totalCount}</span>
        </p>
      </div>

      {/* Таблица логов */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl gradient-text font-bold">Загрузка...</p>
        </div>
      ) : (
        <>
          <div className="ferris-card overflow-x-auto shadow-colorful">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Дата/Время</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Пользователь</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Роль</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Действие</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Таблица</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ID записи</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">IP адрес</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm">
                      {new Date(log.created_at).toLocaleString('ru-RU')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{log.user_email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="badge">{log.user_role}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${actionColors[log.action]}`}>
                        {actionLabels[log.action]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{log.table_name || '-'}</td>
                    <td className="px-4 py-3 text-sm">{log.record_id || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{log.ip_address || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Назад
              </button>
              <span className="text-gray-700 font-medium">
                Страница {currentPage} из {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперед →
              </button>
            </div>
          )}
        </>
      )}

      {logs.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-600 text-lg">Нет записей в журнале</p>
        </div>
      )}
    </UniversalLayout>
  );
}
