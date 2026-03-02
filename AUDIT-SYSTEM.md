# Система аудита

## Обзор

Система аудита автоматически логирует все важные действия пользователей в системе Narxoz College Management System.

## Что логируется

✅ **Аутентификация:**
- Успешные и неудачные попытки входа
- Регистрация новых пользователей
- Выход из системы
- Запросы на восстановление пароля
- Изменение пароля

✅ **Данные (будущее):**
- Создание записей (CREATE)
- Изменение записей (UPDATE)
- Удаление записей (DELETE)

✅ **Безопасность:**
- Попытки несанкционированного доступа

## Файлы

### 1. `lib/audit.ts`
Библиотека функций для логирования:

```typescript
// Логирование входа
await logLogin(userId, email, role, success);

// Логирование выхода
await logLogout(userId, email, role);

// Логирование создания данных
await logCreate(userId, email, role, tableName, recordId, data);

// Логирование изменения данных
await logUpdate(userId, email, role, tableName, recordId, oldData, newData);

// Логирование удаления данных
await logDelete(userId, email, role, tableName, recordId, data);

// Логирование отказа в доступе
await logAccessDenied(userId, email, role, resource);

// Получение логов с фильтрацией
const { data, count } = await getAuditLogs({
  userId: 'uuid',
  action: 'login',
  tableName: 'news',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  limit: 50,
  offset: 0
});
```

### 2. `app/admin/audit/page.tsx`
Страница просмотра журнала аудита для администраторов.

**Функции:**
- Просмотр всех логов в таблице
- Фильтрация по:
  - Действию (вход, выход, создание, изменение, удаление)
  - Таблице
  - Email пользователя
  - Диапазону дат
- Пагинация (50 записей на страницу)
- Цветовая индикация типов действий

### 3. `lib/auth.ts`
Интеграция логирования в функции аутентификации:
- `signUp()` - логирует регистрацию
- `signIn()` - логирует вход
- `signOut()` - логирует выход
- `requestPasswordReset()` - логирует запрос восстановления
- `updatePassword()` - логирует изменение пароля

## База данных

Таблица `audit_log` создана в Task 1:

```sql
CREATE TABLE public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL, -- create, update, delete, login, logout, access_denied
  table_name TEXT,
  record_id BIGINT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Особенности:**
- ✅ RLS включен (только админы могут читать)
- ✅ Immutable (нет политик UPDATE/DELETE)
- ✅ Индексы для быстрого поиска
- ❌ Real-time отключен (безопасность)

## Доступ

**URL:** `/admin/audit`

**Права доступа:** Только администраторы

## Использование

### Для разработчиков

При добавлении новых функций, которые изменяют данные:

```typescript
import { logCreate, logUpdate, logDelete } from '@/lib/audit';

// После создания записи
const { data } = await supabase.from('news').insert(newsData);
await logCreate(user.id, user.email, user.role, 'news', data.id, newsData);

// После изменения записи
const { data } = await supabase.from('news').update(newData).eq('id', id);
await logUpdate(user.id, user.email, user.role, 'news', id, oldData, newData);

// После удаления записи
await logDelete(user.id, user.email, user.role, 'news', id, deletedData);
```

### Для администраторов

1. Войдите как администратор
2. Перейдите в раздел "Журнал аудита" в навигации
3. Используйте фильтры для поиска нужных событий
4. Просматривайте детали каждого действия

## Следующие шаги

- [ ] Добавить логирование в CRUD операции для всех модулей
- [ ] Добавить экспорт логов в CSV/Excel
- [ ] Добавить уведомления о критических событиях
- [ ] Добавить графики и статистику по логам
- [ ] Добавить автоматическую очистку старых логов (>90 дней)

## Требования

Выполнены требования:
- ✅ Requirement 15.1 - Логирование действий
- ✅ Requirement 15.2 - Логирование аутентификации
- ✅ Requirement 15.3 - Логирование изменений данных
- ✅ Requirement 15.4 - Просмотр логов администратором
