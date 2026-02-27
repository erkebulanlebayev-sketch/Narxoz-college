-- ============================================
-- ПОЛНАЯ ОЧИСТКА И НАСТРОЙКА БАЗЫ ДАННЫХ
-- Скопируйте весь этот код в Supabase SQL Editor и нажмите Run
-- ============================================

-- ШАГ 1: Удаляем все старые политики
DROP POLICY IF EXISTS "Все видят товары" ON public.shop_products;
DROP POLICY IF EXISTS "Все могут видеть товары" ON public.shop_products;
DROP POLICY IF EXISTS "Все могут видеть студентов" ON public.students;
DROP POLICY IF EXISTS "Все могут видеть преподавателей" ON public.teachers;
DROP POLICY IF EXISTS "Все могут видеть группы" ON public.groups;
DROP POLICY IF EXISTS "Видеть оценки" ON public.grades;
DROP POLICY IF EXISTS "Админ управляет товарами" ON public.shop_products;
DROP POLICY IF EXISTS "Админ управляет студентами" ON public.students;
DROP POLICY IF EXISTS "Админ управляет преподавателями" ON public.teachers;
DROP POLICY IF EXISTS "Учителя ставят оценки" ON public.grades;
DROP POLICY IF EXISTS "Админ управляет группами" ON public.groups;

-- ШАГ 2: Удаляем старые таблицы (ОСТОРОЖНО: удалит все данные!)
DROP TABLE IF EXISTS public.grades CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.teachers CASCADE;
DROP TABLE IF EXISTS public.shop_products CASCADE;
DROP TABLE IF EXISTS public.groups CASCADE;

-- ШАГ 3: Создаем таблицы заново
CREATE TABLE public.shop_products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.groups (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  course INTEGER NOT NULL,
  curator TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.students (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  group_name TEXT NOT NULL,
  gpa DECIMAL(3,2) DEFAULT 0,
  attendance INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.teachers (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  subjects TEXT[] NOT NULL,
  groups TEXT[] NOT NULL,
  experience INTEGER DEFAULT 0,
  degree TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.grades (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  grade_type TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade >= 0 AND grade <= 100),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ШАГ 4: Включаем RLS
ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- ШАГ 5: Создаем политики (все могут читать)
CREATE POLICY "shop_select_policy" ON public.shop_products FOR SELECT USING (true);
CREATE POLICY "students_select_policy" ON public.students FOR SELECT USING (true);
CREATE POLICY "teachers_select_policy" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "groups_select_policy" ON public.groups FOR SELECT USING (true);
CREATE POLICY "grades_select_policy" ON public.grades FOR SELECT USING (true);

-- ШАГ 6: Политики для записи (только админ и учителя)
CREATE POLICY "shop_admin_policy" ON public.shop_products FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "students_admin_policy" ON public.students FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "teachers_admin_policy" ON public.teachers FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "grades_teacher_policy" ON public.grades FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('teacher', 'admin')
);

CREATE POLICY "groups_admin_policy" ON public.groups FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- ШАГ 7: Включаем Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.shop_products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.grades;
ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;

-- ШАГ 8: Добавляем тестовые данные
INSERT INTO public.groups (name, full_name, course, curator) VALUES
  ('ИС-21-1', 'Информационные системы 21-1', 3, 'Иванов И.И.'),
  ('ПО-21-1', 'Программное обеспечение 21-1', 3, 'Петрова А.С.'),
  ('ИС-22-1', 'Информационные системы 22-1', 2, 'Сидоров П.К.');

INSERT INTO public.shop_products (name, category, price, image, description, in_stock, rating, reviews) VALUES
  ('Толстовка Narxoz', 'merch', 15000, '👕', 'Стильная толстовка с логотипом колледжа', true, 4.8, 24),
  ('Футболка Narxoz', 'merch', 8000, '👔', 'Хлопковая футболка с принтом', true, 4.6, 18),
  ('Кепка Narxoz', 'merch', 5000, '🧢', 'Бейсболка с вышитым логотипом', true, 4.7, 15),
  ('Рюкзак студента', 'merch', 12000, '🎒', 'Вместительный рюкзак для учебы', true, 4.9, 32);

-- ШАГ 9: Проверка - показать все товары
SELECT id, name, price, in_stock FROM shop_products ORDER BY id;
