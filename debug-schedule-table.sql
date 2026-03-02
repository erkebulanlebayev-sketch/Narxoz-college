-- ============================================
-- ОТЛАДКА ТАБЛИЦЫ SCHEDULE
-- ============================================

-- Показать структуру таблицы
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'schedule'
ORDER BY ordinal_position;

-- Показать все записи
SELECT * FROM public.schedule LIMIT 10;

-- Показать количество записей
SELECT COUNT(*) as total_records FROM public.schedule;

-- Проверить RLS политики
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'schedule';

-- Попробовать вставить тестовую запись
INSERT INTO public.schedule (day, start_time, end_time, subject, group_name, room)
VALUES (0, '09:00', '10:30', 'Тестовый предмет', 'ИС-21-1', '101')
RETURNING *;

SELECT '✅ Отладка завершена!' as result;
