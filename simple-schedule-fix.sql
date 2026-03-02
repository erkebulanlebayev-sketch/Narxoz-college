-- ============================================
-- ПРОСТОЕ ИСПРАВЛЕНИЕ SCHEDULE
-- Удаляет таблицу и создаёт заново с правильной структурой
-- ============================================

-- ВНИМАНИЕ: Это удалит все данные в таблице schedule!
DROP TABLE IF EXISTS public.schedule CASCADE;

-- Создать таблицу заново
CREATE TABLE public.schedule (
  id BIGSERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  subject TEXT NOT NULL,
  teacher_id INTEGER,
  group_name TEXT NOT NULL,
  room TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включить RLS
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;

-- Создать политики
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

-- Включить real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule;

-- Вставить тестовую запись
INSERT INTO public.schedule (day, start_time, end_time, subject, teacher_id, group_name, room)
VALUES 
  (0, '09:00', '10:30', 'Математика', NULL, 'ИС-21-1', '101'),
  (0, '11:00', '12:30', 'Программирование', NULL, 'ИС-21-1', '202');

-- Показать результат
SELECT * FROM public.schedule;

SELECT '✅ Таблица schedule пересоздана!' as result;
