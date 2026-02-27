'use client';

import { useState, useEffect } from 'react';
import UniversalLayout from '@/components/UniversalLayout';
import { getAuditLogs, AuditLogEntry, AuditAction } from '@/lib/audit';

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedAction, setSelectedAction] = useState<AuditAction | 'all'>('all');
  const [selectedTable, setSelectedTable] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadAuditLogs();
  }, [currentPage, searchEmail, selectedAction, selectedTable, startDate, endDate]);

  async function loadAuditLogs() {
    setLoading(true);
    try {
      const filters: any = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };

      if (searchEmail) filters.userEmail = searchEmail;
      if (selectedAction !== 'all') filters.action = selectedAction;
      if (selectedTable !== 'all') filters.tableName = selectedTable;
      if (startDate) filters.startDate = new Date(startDate).toISOString();
      if (endDate) filters.endDate = new Date(endDate).toISOString();

      const { data, error, count } = await getAuditLogs(filters);

      if (error) {
        console.error('Failed to load audit logs:', error);
        return;
      }

      setLogs(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setSearchEmail('');
    setSelectedAction('all');
    setSelectedTable('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  }

  const getActionColor = (action: AuditAction) => {
    switch(action) {
      case 'login': return 'bg-green-100 text-green-700';
      case 'logout': return 'bg-blue-100 text-blue-700';
      case 'create': return 'bg-purple-100 text-purple-700';
      case 'update': return 'bg-yellow-100 text-yellow-700';
      case 'delete': return 'bg-red-100 text-red-700';
      case 'access_denied': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'student': return 'bg-blue-50 text-blue-700';
      case 'teacher': return 'bg-green-50 text-green-700';
      case 'admin': return 'bg-amber-50 text-amber-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <UniversalLayout role="admin">
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Журнал аудита</h1>
          <p className="text-gray-600">Всего записей: {totalCount}</p>
        </div>

        {/* Filters */}
        <div className="ferris-card rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Фильтры</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Поиск по email</label>
              <input
                type="text"
                value={searchEmail}
                onChange={(e) => {
                  setSearchEmail(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="user@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Действие</label>
              <select
                value={selectedAction}
                onChange={(e) => {
                  setSelectedAction(e.target.value as AuditAction | 'all');
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Все действия</option>
                <option value="login">Вход</option>
                <option value="logout">Выход</option>
                <option value="create">Создание</option>
                <option value="update">Обновление</option>
                <option value="delete">Удаление</option>
                <option value="access_denied">Отказ в доступе</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Таблица</label>
              <select
                value={selectedTable}
                onChange={(e) => {
                  setSelectedTable(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Все таблицы</option>
                <option value="students">Студенты</option>
                <option value="teachers">Преподаватели</option>
                <option value="grades">Оценки</option>
                <option value="schedule">Расписание</option>
                <option value="news">Новости</option>
                <option value="shop_products">Магазин</option>
                <option value="library_books">Библиотека</option>
                <option value="materials">Материалы</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Дата начала</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Дата окончания</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="ferris-card rounded-xl p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              <p className="mt-4 text-gray-600">Загрузка...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Записи не найдены</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">Дата и время</th>
                      <th className="text-left py-3 px-4 font-semibold">Пользователь</th>
                      <th className="text-left py-3 px-4 font-semibold">Роль</th>
                      <th className="text-left py-3 px-4 font-semibold">Действие</th>
                      <th className="text-left py-3 px-4 font-semibold">Таблица</th>
                      <th className="text-left py-3 px-4 font-semibold">ID записи</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm">
                          {log.created_at ? formatDate(log.created_at) : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="font-medium">{log.user_email}</div>
                          {log.ip_address && (
                            <div className="text-xs text-gray-500">IP: {log.ip_address}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${getRoleColor(log.user_role)}`}>
                            {log.user_role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{log.table_name || '-'}</td>
                        <td className="py-3 px-4 text-sm">{log.record_id || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Страница {currentPage} из {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Назад
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Вперед →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </UniversalLayout>
  );
}
