-- ============================================
-- ДОБАВЛЕНИЕ EMAIL В ТАБЛИЦЫ STUDENTS И TEACHERS
-- ============================================

-- Добавить email в students если нет
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'students' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.students ADD COLUMN email TEXT UNIQUE;
    RAISE NOTICE '✅ Колонка email добавлена в students';
  ELSE
    RAISE NOTICE '✅ Колонка email уже существует в students';
  END IF;
END $$;

-- Добавить email в teachers если нет
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'teachers' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.teachers ADD COLUMN email TEXT UNIQUE;
    RAISE NOTICE '✅ Колонка email добавлена в teachers';
  ELSE
    RAISE NOTICE '✅ Колонка email уже существует в teachers';
  END IF;
END $$;

-- Показать структуру таблиц
SELECT 'students' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;

SELECT 'teachers' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'teachers'
ORDER BY ordinal_position;

SELECT '✅ Email колонки добавлены!' as result;
