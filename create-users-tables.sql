-- ============================================
-- СОЗДАНИЕ ТАБЛИЦ STUDENTS И TEACHERS
-- ============================================

-- Создать таблицу students если не существует
CREATE TABLE IF NOT EXISTS public.students (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  group_name TEXT NOT NULL,
  gpa DECIMAL(3,2) DEFAULT 0.00,
  attendance INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создать таблицу teachers если не существует
CREATE TABLE IF NOT EXISTS public.teachers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  subject TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включить RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Удалить старые политики если есть
DROP POLICY IF EXISTS "students_select_policy" ON public.students;
DROP POLICY IF EXISTS "students_insert_policy" ON public.students;
DROP POLICY IF EXISTS "students_update_policy" ON public.students;
DROP POLICY IF EXISTS "students_delete_policy" ON public.students;

DROP POLICY IF EXISTS "teachers_select_policy" ON public.teachers;
DROP POLICY IF EXISTS "teachers_insert_policy" ON public.teachers;
DROP POLICY IF EXISTS "teachers_update_policy" ON public.teachers;
DROP POLICY IF EXISTS "teachers_delete_policy" ON public.teachers;

-- ========== STUDENTS POLICIES ==========
CREATE POLICY "students_select_policy" ON public.students
  FOR SELECT USING (true);

CREATE POLICY "students_insert_policy" ON public.students
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'student')
  );

CREATE POLICY "students_update_policy" ON public.students
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "students_delete_policy" ON public.students
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ========== TEACHERS POLICIES ==========
CREATE POLICY "teachers_select_policy" ON public.teachers
  FOR SELECT USING (true);

CREATE POLICY "teachers_insert_policy" ON public.teachers
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'teacher')
  );

CREATE POLICY "teachers_update_policy" ON public.teachers
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "teachers_delete_policy" ON public.teachers
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Включить Real-time для students
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
    RAISE NOTICE '✅ Real-time включен для students';
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '✅ Real-time уже включен для students';
  END;
END $$;

-- Включить Real-time для teachers
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;
    RAISE NOTICE '✅ Real-time включен для teachers';
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '✅ Real-time уже включен для teachers';
  END;
END $$;

-- Создать индексы для производительности
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_students_group ON public.students(group_name);
CREATE INDEX IF NOT EXISTS idx_teachers_email ON public.teachers(email);

-- Показать результат
SELECT 'students' as table_name, COUNT(*) as count FROM public.students
UNION ALL
SELECT 'teachers' as table_name, COUNT(*) as count FROM public.teachers;

-- Показать структуру таблиц
SELECT 'students' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'students' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'teachers' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'teachers' AND table_schema = 'public'
ORDER BY ordinal_position;
