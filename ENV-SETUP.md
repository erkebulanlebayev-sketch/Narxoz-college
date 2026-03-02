# Environment Variables - Настройка

## 📋 Необходимые переменные окружения

Для работы приложения нужно создать файл `.env.local` в корне проекта со следующими переменными:

### 1. NEXT_PUBLIC_SUPABASE_URL
**Описание:** URL вашего Supabase проекта  
**Где найти:** Supabase Dashboard → Settings → API → Project URL  
**Пример:** `https://zpycymatynwdbbvgsjab.supabase.co`

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
**Описание:** Публичный (anon) ключ для клиентских запросов  
**Где найти:** Supabase Dashboard → Settings → API → Project API keys → `anon` `public`  
**Пример:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`  
**Безопасность:** ✅ Безопасно использовать на клиенте (защищен RLS политиками)

### 3. SUPABASE_SERVICE_ROLE_KEY (опционально)
**Описание:** Service Role ключ для серверных операций  
**Где найти:** Supabase Dashboard → Settings → API → Project API keys → `service_role` `secret`  
**Пример:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`  
**Безопасность:** ⚠️ НИКОГДА не публикуйте этот ключ! Он обходит все RLS политики

### 4. DATABASE_URL (опционально)
**Описание:** Строка подключения к PostgreSQL базе данных  
**Где найти:** Supabase Dashboard → Settings → Database → Connection string → URI  
**Формат:** `postgres://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`  
**Использование:** Для прямых SQL запросов или миграций

## 🚀 Быстрая настройка

### Шаг 1: Скопируйте пример файла
```bash
copy .env.local.example .env.local
```

### Шаг 2: Откройте Supabase Dashboard
1. Перейдите на https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в Settings → API

### Шаг 3: Скопируйте значения
Замените значения в `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Шаг 4: Перезапустите сервер разработки
```bash
npm run dev
```

## 🔒 Безопасность

### ✅ Что МОЖНО публиковать:
- `NEXT_PUBLIC_SUPABASE_URL` - публичный URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - публичный ключ (защищен RLS)

### ❌ Что НЕЛЬЗЯ публиковать:
- `SUPABASE_SERVICE_ROLE_KEY` - обходит все RLS политики
- `DATABASE_URL` - содержит пароль базы данных
- Файл `.env.local` - уже добавлен в `.gitignore`

## 📝 Примечания

1. **Префикс NEXT_PUBLIC_**: Переменные с этим префиксом доступны на клиенте (в браузере)
2. **Без префикса**: Переменные доступны только на сервере (Node.js)
3. **Перезапуск**: После изменения `.env.local` нужно перезапустить `npm run dev`
4. **Production**: На Vercel/Netlify добавьте переменные через их панель управления

## 🔧 Проверка настройки

После настройки переменных, проверьте подключение:

1. Запустите приложение: `npm run dev`
2. Откройте http://localhost:4004
3. Попробуйте зарегистрироваться или войти
4. Проверьте консоль браузера на ошибки

Если видите ошибки типа "Invalid API key" или "Failed to fetch" - проверьте правильность ключей.

## 📚 Дополнительная информация

- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
