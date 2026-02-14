-- Создание таблиц для системы управления колледжем

-- Удаляем существующие таблицы если есть (для чистой установки)
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS schedule CASCADE;
DROP TABLE IF EXISTS auditories CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS groups CASCADE;

-- Таблица групп
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица пользователей (расширение auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица учителей
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица предметов
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица аудиторий
CREATE TABLE auditories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  capacity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица расписания
CREATE TABLE schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  auditory_id UUID REFERENCES auditories(id) ON DELETE CASCADE,
  day VARCHAR(20) NOT NULL,
  time VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица оценок
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  grade_type VARCHAR(20) NOT NULL CHECK (grade_type IN ('lecture', 'srsp', 'srs', 'session')),
  grade INTEGER NOT NULL CHECK (grade >= 0 AND grade <= 100),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_group ON users(group_id);
CREATE INDEX idx_schedule_group ON schedule(group_id);
CREATE INDEX idx_schedule_teacher ON schedule(teacher_id);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_subject ON grades(subject_id);

-- Row Level Security (RLS) политики

-- Включаем RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditories ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Политики для users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Политики для schedule
CREATE POLICY "Students can view their group schedule" ON schedule
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND group_id = schedule.group_id
    )
  );

CREATE POLICY "Teachers can view their schedule" ON schedule
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teachers WHERE user_id = auth.uid() AND id = schedule.teacher_id
    )
  );

CREATE POLICY "Admins can manage schedule" ON schedule
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Политики для grades
CREATE POLICY "Students can view their grades" ON grades
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage grades for their subjects" ON grades
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM subjects s
      JOIN teachers t ON s.teacher_id = t.id
      WHERE s.id = grades.subject_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all grades" ON grades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Функция для автоматического расчета GPA
CREATE OR REPLACE FUNCTION calculate_student_gpa(student_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  avg_grade NUMERIC;
BEGIN
  SELECT AVG(grade) INTO avg_grade
  FROM grades
  WHERE student_id = student_uuid;
  
  RETURN COALESCE(ROUND(avg_grade, 2), 0);
END;
$$ LANGUAGE plpgsql;

-- Триггер для создания записи в users при регистрации
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
