import { Grade } from './supabase';

export function calculateGPA(grades: Grade[]): number {
  if (grades.length === 0) return 0;
  
  const total = grades.reduce((sum, grade) => sum + grade.grade, 0);
  return Number((total / grades.length).toFixed(2));
}

export function getGradesByType(grades: Grade[], type: string) {
  return grades.filter(g => g.grade_type === type);
}
