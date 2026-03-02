-- ============================================
-- ПОЛНОЕ ИСПРАВЛЕНИЕ ВСЕХ RLS ПОЛИТИК
-- Удаляет ВСЕ старые политики и создает новые правильные
-- ============================================

-- ========== NEWS ==========
-- Удалить ВСЕ политики для news
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'news') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.news';
    END LOOP;
END $$;

-- Создать правильные политики
CREATE POLICY "news_select_policy" ON public.news
  FOR SELECT USING (
    published = true OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "news_insert_policy" ON public.news
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "news_update_policy" ON public.news
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "news_delete_policy" ON public.news
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ========== SHOP_PRODUCTS ==========
-- Удалить ВСЕ политики для shop_products
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'shop_products') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.shop_products';
    END LOOP;
END $$;

-- Создать правильные политики
CREATE POLICY "shop_products_select_policy" ON public.shop_products
  FOR SELECT USING (true);

CREATE POLICY "shop_products_insert_policy" ON public.shop_products
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "shop_products_update_policy" ON public.shop_products
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "shop_products_delete_policy" ON public.shop_products
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ========== SCHEDULE ==========
-- Удалить ВСЕ политики для schedule
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'schedule') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.schedule';
    END LOOP;
END $$;

-- Создать правильные политики
CREATE POLICY "schedule_select_policy" ON public.schedule
  FOR SELECT USING (true);

CREATE POLICY "schedule_insert_policy" ON public.schedule
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "schedule_update_policy" ON public.schedule
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "schedule_delete_policy" ON public.schedule
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ========== STUDENTS ==========
-- Удалить ВСЕ политики для students
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'students') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.students';
    END LOOP;
END $$;

-- Создать правильные политики
CREATE POLICY "students_select_policy" ON public.students
  FOR SELECT USING (true);

CREATE POLICY "students_insert_policy" ON public.students
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "students_update_policy" ON public.students
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "students_delete_policy" ON public.students
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ========== TEACHERS ==========
-- Удалить ВСЕ политики для teachers
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'teachers') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.teachers';
    END LOOP;
END $$;

-- Создать правильные политики
CREATE POLICY "teachers_select_policy" ON public.teachers
  FOR SELECT USING (true);

CREATE POLICY "teachers_insert_policy" ON public.teachers
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "teachers_update_policy" ON public.teachers
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "teachers_delete_policy" ON public.teachers
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ========== GRADES ==========
-- Удалить ВСЕ политики для grades
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'grades') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.grades';
    END LOOP;
END $$;

-- Создать правильные политики
CREATE POLICY "grades_select_policy" ON public.grades
  FOR SELECT USING (true);

CREATE POLICY "grades_insert_policy" ON public.grades
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'teacher')
  );

CREATE POLICY "grades_update_policy" ON public.grades
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'teacher')
  );

CREATE POLICY "grades_delete_policy" ON public.grades
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'teacher')
  );

-- ========== SETTINGS ==========
-- Удалить ВСЕ политики для settings (если таблица существует)
DO $$
DECLARE
    r RECORD;
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'settings') THEN
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'settings') LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.settings';
        END LOOP;
        
        -- Создать правильные политики
        EXECUTE 'CREATE POLICY "settings_select_policy" ON public.settings FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "settings_insert_policy" ON public.settings FOR INSERT WITH CHECK ((auth.jwt() -> ''user_metadata'' ->> ''role'') = ''admin'')';
        EXECUTE 'CREATE POLICY "settings_update_policy" ON public.settings FOR UPDATE USING ((auth.jwt() -> ''user_metadata'' ->> ''role'') = ''admin'')';
        EXECUTE 'CREATE POLICY "settings_delete_policy" ON public.settings FOR DELETE USING ((auth.jwt() -> ''user_metadata'' ->> ''role'') = ''admin'')';
    END IF;
END $$;

-- Показать все текущие политики
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Готово!
SELECT '✅ ВСЕ RLS политики пересозданы с правильным методом auth.jwt()!' as result;
