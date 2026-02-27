-- Схема базы данных с real-time синхронизацией
-- Запустите этот скрипт в Supabase SQL Editor

-- ============================================
-- ТАБЛИЦА: Товары магазина
-- ============================================
CREATE TABLE IF NOT EXISTS public.shop_products (
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

-- Включаем real-time для товаров
ALTER PUBLICATION supabase_realtime ADD TABLE public.shop_products;

-- ============================================
-- ТАБЛИЦА: Студенты
-- ============================================
CREATE TABLE IF NOT EXISTS public.students (
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

-- Включаем real-time для студентов
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;

-- ============================================
-- ТАБЛИЦА: Преподаватели
-- ============================================
CREATE TABLE IF NOT EXISTS public.teachers (
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

-- Включаем real-time для преподавателей
ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;

-- ============================================
-- ТАБЛИЦА: Оценки
-- ============================================
CREATE TABLE IF NOT EXISTS public.grades (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  grade_type TEXT NOT NULL, -- 'lecture', 'srsp', 'srs', 'midterm', 'final'
  grade INTEGER NOT NULL CHECK (grade >= 0 AND grade <= 100),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включаем real-time для оценок
ALTER PUBLICATION supabase_realtime ADD TABLE public.grades;

-- ============================================
-- ТАБЛИЦА: Группы
-- ============================================
CREATE TABLE IF NOT EXISTS public.groups (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  course INTEGER NOT NULL,
  curator TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включаем real-time для групп
ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;

-- ============================================
-- ИНДЕКСЫ для производительности
-- ============================================
CREATE INDEX IF NOT EXISTS idx_students_group ON public.students(group_name);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON public.grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_teacher ON public.grades(teacher_id);
CREATE INDEX IF NOT EXISTS idx_shop_products_category ON public.shop_products(category);

-- ============================================
-- RLS (Row Level Security) Политики
-- ============================================

-- Включаем RLS
ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Политики для товаров (все могут читать, только админ может изменять)
CREATE POLICY "Все могут видеть товары" ON public.shop_products
  FOR SELECT USING (true);

CREATE POLICY "Только админ может добавлять товары" ON public.shop_products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Только админ может обновлять товары" ON public.shop_products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Только админ может удалять товары" ON public.shop_products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Политики для студентов
CREATE POLICY "Все могут видеть студентов" ON public.students
  FOR SELECT USING (true);

CREATE POLICY "Админ может управлять студентами" ON public.students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Политики для преподавателей
CREATE POLICY "Все могут видеть преподавателей" ON public.teachers
  FOR SELECT USING (true);

CREATE POLICY "Админ может управлять преподавателями" ON public.teachers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Политики для оценок
CREATE POLICY "Студенты видят свои оценки" ON public.grades
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Учителя могут ставить оценки" ON public.grades
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Учителя могут обновлять оценки" ON public.grades
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Учителя могут удалять оценки" ON public.grades
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('teacher', 'admin')
    )
  );

-- Политики для групп
CREATE POLICY "Все могут видеть группы" ON public.groups
  FOR SELECT USING (true);

CREATE POLICY "Админ может управлять группами" ON public.groups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- ФУНКЦИИ для автоматического обновления
-- ============================================

-- Функция обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_shop_products_updated_at BEFORE UPDATE ON public.shop_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ТЕСТОВЫЕ ДАННЫЕ
-- ============================================

-- Добавляем группы
INSERT INTO public.groups (name, full_name, course, curator) VALUES
  ('ИС-21-1', 'Информационные системы 21-1', 3, 'Иванов И.И.'),
  ('ПО-21-1', 'Программное обеспечение 21-1', 3, 'Петрова А.С.'),
  ('ИС-22-1', 'Информационные системы 22-1', 2, 'Сидоров П.К.')
ON CONFLICT (name) DO NOTHING;

-- Добавляем начальные товары
INSERT INTO public.shop_products (name, category, price, image, description, in_stock, rating, reviews) VALUES
  ('Толстовка Narxoz', 'merch', 15000, '👕', 'Стильная толстовка с логотипом колледжа', true, 4.8, 24),
  ('Футболка Narxoz', 'merch', 8000, '👔', 'Хлопковая футболка с принтом', true, 4.6, 18),
  ('Кепка Narxoz', 'merch', 5000, '🧢', 'Бейсболка с вышитым логотипом', true, 4.7, 15),
  ('Рюкзак студента', 'merch', 12000, '🎒', 'Вместительный рюкзак для учебы', true, 4.9, 32),
  ('Набор ручек', 'stationery', 2000, '🖊️', 'Набор из 10 шариковых ручек', true, 4.5, 45),
  ('Блокнот А5', 'stationery', 1500, '📓', 'Блокнот в клетку, 96 листов', true, 4.6, 28)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.shop_products IS 'Товары магазина Narxoz Shop';
COMMENT ON TABLE public.students IS 'Информация о студентах';
COMMENT ON TABLE public.teachers IS 'Информация о преподавателях';
COMMENT ON TABLE public.grades IS 'Оценки студентов';
COMMENT ON TABLE public.groups IS 'Учебные группы';
