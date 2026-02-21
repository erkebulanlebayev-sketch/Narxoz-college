-- Настройка Supabase Storage для материалов обменника

-- Создаем bucket для материалов (если еще не создан)
-- Это нужно выполнить в Supabase Dashboard -> Storage
-- или через SQL:

INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- Политики доступа для bucket materials

-- Разрешаем всем аутентифицированным пользователям читать файлы
CREATE POLICY "Allow authenticated users to read materials"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'materials');

-- Разрешаем аутентифицированным пользователям загружать файлы
CREATE POLICY "Allow authenticated users to upload materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'materials');

-- Разрешаем пользователям удалять только свои файлы
CREATE POLICY "Allow users to delete own materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'materials' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Разрешаем пользователям обновлять только свои файлы
CREATE POLICY "Allow users to update own materials"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'materials' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
