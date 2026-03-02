-- ============================================
-- МИНИМАЛЬНЫЙ СКРИПТ - ТОЛЬКО НОВОСТИ
-- Запустите этот скрипт первым для проверки
-- ============================================

-- Создать таблицу news
CREATE TABLE IF NOT EXISTS public.news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID,
  author_name TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включить RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Все могут читать опубликованные новости
DROP POLICY IF EXISTS "news_read" ON public.news;
CREATE POLICY "news_read" ON public.news FOR SELECT USING (published = true);

-- Админы могут всё
DROP POLICY IF EXISTS "news_admin" ON public.news;
CREATE POLICY "news_admin" ON public.news FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Включить Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;

-- Проверка
SELECT 'Таблица news готова!' as result;
SELECT COUNT(*) as news_count FROM public.news;
