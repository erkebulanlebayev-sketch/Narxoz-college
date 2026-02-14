import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  group_id?: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface Subject {
  id: string;
  name: string;
  teacher_id: string;
}

export interface Auditory {
  id: string;
  name: string;
  capacity: number;
}

export interface Schedule {
  id: string;
  group_id: string;
  subject_id: string;
  teacher_id: string;
  auditory_id: string;
  day: string;
  time: string;
}

export type GradeType = 'lecture' | 'srsp' | 'srs' | 'session';

export interface Grade {
  id: string;
  student_id: string;
  subject_id: string;
  grade_type: GradeType;
  grade: number;
  date: string;
}
