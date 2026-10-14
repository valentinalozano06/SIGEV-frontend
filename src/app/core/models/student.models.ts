export const GRADES = ['1.º Primaria', '2.º Primaria', '3.º Primaria', '4.º Primaria', '5.º Primaria', '6.º Primaria', '1.º Secundaria', '2.º Secundaria', '3.º Secundaria', '4.º Secundaria', '5.º Secundaria'] as const;
export const SECTIONS = ['A', 'B', 'C'] as const;
export type StudentStatus = 'Activo' | 'Inactivo';
export interface AcademicRecord { year: number; grade: string; section: string; result: string; }
export interface StudentInput {
  firstName: string; lastName: string; dni: string; birthDate: string;
  grade: string; section: string; status: StudentStatus;
  guardianName: string; guardianRelationship: string; guardianPhone: string; guardianEmail: string;
}
export interface Student extends StudentInput { id: string; history: AcademicRecord[]; }
export interface StudentQuery { search: string; grade: string; section: string; status: string; }
export function normalized(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}
export function filterStudents(students: readonly Student[], query: StudentQuery): Student[] {
  const words = normalized(query.search).split(/\s+/).filter(Boolean);
  return students.filter(student => {
    const text = normalized(`${student.firstName} ${student.lastName} ${student.dni} ${student.id}`);
    return words.every(word => text.includes(word)) && (!query.grade || student.grade === query.grade)
      && (!query.section || student.section === query.section) && (!query.status || student.status === query.status);
  });
}
