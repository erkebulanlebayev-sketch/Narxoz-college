-- ============================================
-- ВКЛЮЧЕНИЕ REAL-TIME ДЛЯ ВСЕХ ТАБЛИЦ
-- Выполните этот скрипт в Supabase SQL Editor
-- ============================================

-- Включить real-time для всех таблиц системы
-- Проверяем существование таблицы перед добавлением

DO $$
BEGIN
  -- news
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'news') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.news;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;

  -- schedule
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'schedule') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;

  -- shop_products
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'shop_products') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.shop_products;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;

  -- grades
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'grades') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.grades;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;

  -- library_books
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'library_books') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.library_books;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;

  -- materials
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'materials') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.materials;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;

  -- settings
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'settings') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;

  -- students
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'students') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;

  -- teachers
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'teachers') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;

END $$;

-- Проверить какие таблицы существуют в базе
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('news', 'schedule', 'shop_products', 'grades', 'library_books', 'materials', 'settings', 'students', 'teachers')
ORDER BY tablename;

-- Проверить какие таблицы включены в real-time
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- Готово! Все существующие таблицы теперь синхронизируются в реальном времени! 🚀
