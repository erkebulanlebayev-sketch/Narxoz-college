-- ============================================
-- COMPLETE DATABASE SCHEMA MIGRATION
-- Narxoz College Management System
-- ============================================
-- This script creates all missing tables with RLS policies,
-- real-time replication, and performance indexes
-- ============================================

-- ============================================
-- TABLE: News Articles
-- ============================================
CREATE TABLE IF NOT EXISTS public.news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: Schedule
-- ============================================
CREATE TABLE IF NOT EXISTS public.schedule (
  id BIGSERIAL PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  teacher_id BIGINT REFERENCES public.teachers(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  room TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: Library Books
-- ============================================
CREATE TABLE IF NOT EXISTS public.library_books (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved')),
  borrowed_by BIGINT REFERENCES public.students(id) ON DELETE SET NULL,
  borrowed_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: Materials (Enhanced)
-- ============================================
CREATE TABLE IF NOT EXISTS public.materials (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('notes', 'homework', 'projects', 'exams', 'teaching')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  uploader_name TEXT NOT NULL,
  uploader_role TEXT NOT NULL CHECK (uploader_role IN ('student', 'teacher')),
  group_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: Settings
-- ============================================
CREATE TABLE IF NOT EXISTS public.settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: Audit Log
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'login', 'logout', 'access_denied')),
  table_name TEXT,
  record_id BIGINT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- News indexes
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON public.news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_author ON public.news(author_id);

-- Schedule indexes
CREATE INDEX IF NOT EXISTS idx_schedule_day ON public.schedule(day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedule_teacher ON public.schedule(teacher_id);
CREATE INDEX IF NOT EXISTS idx_schedule_group ON public.schedule(group_name);
CREATE INDEX IF NOT EXISTS idx_schedule_time ON public.schedule(start_time);

-- Library books indexes
CREATE INDEX IF NOT EXISTS idx_library_category ON public.library_books(category);
CREATE INDEX IF NOT EXISTS idx_library_status ON public.library_books(status);
CREATE INDEX IF NOT EXISTS idx_library_borrowed_by ON public.library_books(borrowed_by);
CREATE INDEX IF NOT EXISTS idx_library_title ON public.library_books(title);
CREATE INDEX IF NOT EXISTS idx_library_author ON public.library_books(author);

-- Materials indexes
CREATE INDEX IF NOT EXISTS idx_materials_subject ON public.materials(subject);
CREATE INDEX IF NOT EXISTS idx_materials_category ON public.materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_uploader ON public.materials(uploader_id);
CREATE INDEX IF NOT EXISTS idx_materials_group ON public.materials(group_name);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON public.materials(created_at DESC);

-- Settings indexes
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_table ON public.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.audit_log(created_at DESC);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: News
-- ============================================

-- Everyone can read published news
CREATE POLICY "news_select_policy" ON public.news
  FOR SELECT USING (published = true OR EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  ));

-- Only admins can insert news
CREATE POLICY "news_insert_policy" ON public.news
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Only admins can update news
CREATE POLICY "news_update_policy" ON public.news
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Only admins can delete news
CREATE POLICY "news_delete_policy" ON public.news
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: Schedule
-- ============================================

-- Everyone can read schedule
CREATE POLICY "schedule_select_policy" ON public.schedule
  FOR SELECT USING (true);

-- Only admins can insert schedule
CREATE POLICY "schedule_insert_policy" ON public.schedule
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Only admins can update schedule
CREATE POLICY "schedule_update_policy" ON public.schedule
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Only admins can delete schedule
CREATE POLICY "schedule_delete_policy" ON public.schedule
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: Library Books
-- ============================================

-- Everyone can read library books
CREATE POLICY "library_select_policy" ON public.library_books
  FOR SELECT USING (true);

-- Only admins can insert books
CREATE POLICY "library_insert_policy" ON public.library_books
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Only admins can update books
CREATE POLICY "library_update_policy" ON public.library_books
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Only admins can delete books
CREATE POLICY "library_delete_policy" ON public.library_books
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: Materials
-- ============================================

-- Everyone can read materials
CREATE POLICY "materials_select_policy" ON public.materials
  FOR SELECT USING (true);

-- Teachers and students can insert materials
CREATE POLICY "materials_insert_policy" ON public.materials
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('teacher', 'student', 'admin')
    )
  );

-- Users can update their own materials
CREATE POLICY "materials_update_policy" ON public.materials
  FOR UPDATE USING (
    uploader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Users can delete their own materials
CREATE POLICY "materials_delete_policy" ON public.materials
  FOR DELETE USING (
    uploader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: Settings
-- ============================================

-- Everyone can read settings
CREATE POLICY "settings_select_policy" ON public.settings
  FOR SELECT USING (true);

-- Only admins can modify settings
CREATE POLICY "settings_admin_policy" ON public.settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: Audit Log
-- ============================================

-- Only admins can read audit log
CREATE POLICY "audit_select_policy" ON public.audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- System can insert audit log entries (no user restriction)
CREATE POLICY "audit_insert_policy" ON public.audit_log
  FOR INSERT WITH CHECK (true);

-- No one can update or delete audit log entries (integrity)
-- (No UPDATE or DELETE policies = denied by default)

-- ============================================
-- TRIGGERS: Auto-update timestamps
-- ============================================

-- Create or replace the update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_schedule_updated_at ON public.schedule;
CREATE TRIGGER update_schedule_updated_at
  BEFORE UPDATE ON public.schedule
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_library_updated_at ON public.library_books;
CREATE TRIGGER update_library_updated_at
  BEFORE UPDATE ON public.library_books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ENABLE REAL-TIME REPLICATION
-- ============================================

-- Add all tables to real-time publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule;
ALTER PUBLICATION supabase_realtime ADD TABLE public.library_books;
ALTER PUBLICATION supabase_realtime ADD TABLE public.materials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
-- Note: audit_log is intentionally excluded from real-time for security

-- ============================================
-- INITIAL DATA: Settings
-- ============================================

-- Insert default grade submission window setting
INSERT INTO public.settings (key, value, description)
VALUES (
  'grade_submission_window',
  '{"enabled": true, "deadline": null, "message": "Grade submission is currently open"}'::jsonb,
  'Controls when teachers can submit grades'
)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- COMMENTS for Documentation
-- ============================================

COMMENT ON TABLE public.news IS 'News articles and announcements';
COMMENT ON TABLE public.schedule IS 'Class schedule entries';
COMMENT ON TABLE public.library_books IS 'Library book catalog with availability tracking';
COMMENT ON TABLE public.materials IS 'Teaching materials and student submissions';
COMMENT ON TABLE public.settings IS 'System configuration settings';
COMMENT ON TABLE public.audit_log IS 'Audit trail for all significant system actions';

COMMENT ON COLUMN public.schedule.day_of_week IS '0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday, 6=Sunday';
COMMENT ON COLUMN public.library_books.status IS 'available, occupied, or reserved';
COMMENT ON COLUMN public.materials.uploader_role IS 'student or teacher';
COMMENT ON COLUMN public.audit_log.action IS 'create, update, delete, login, logout, or access_denied';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Uncomment to verify tables were created
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('news', 'schedule', 'library_books', 'materials', 'settings', 'audit_log');

-- Uncomment to verify RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('news', 'schedule', 'library_books', 'materials', 'settings', 'audit_log');

-- Uncomment to verify real-time is enabled
-- SELECT schemaname, tablename FROM pg_publication_tables 
-- WHERE pubname = 'supabase_realtime';

