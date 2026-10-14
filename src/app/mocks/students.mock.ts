import { GRADES, Student } from '../core/models/student.models';

// Fictitious fixtures, never records of actual pupils or families.
const NAMES = [
  ['Lucía', 'Fernández', '5.º Primaria', 'A'], ['Diego', 'Ramírez', '2.º Secundaria', 'B'],
  ['Valentina', 'Torres', '6.º Primaria', 'A'], ['Mateo', 'González', '4.º Secundaria', 'C'],
  ['Sofía', 'Rojas', '3.º Primaria', 'B'], ['Sebastián', 'Flores', '1.º Secundaria', 'A'],
  ['Camila', 'Vásquez', '2.º Primaria', 'A'], ['Gabriel', 'Díaz', '3.º Secundaria', 'B'],
  ['Isabella', 'Mendoza', '1.º Primaria', 'C'], ['Nicolás', 'Castillo', '5.º Secundaria', 'A'],
  ['Valeria', 'Pérez', '4.º Primaria', 'B'], ['Adrián', 'Sánchez', '5.º Primaria', 'B'],
  ['Mariana', 'Ruiz', '6.º Primaria', 'C'], ['Joaquín', 'Morales', '2.º Secundaria', 'A'],
  ['Antonella', 'Silva', '3.º Primaria', 'A'], ['Leonardo', 'Herrera', '1.º Secundaria', 'C'],
  ['Daniela', 'Medina', '4.º Primaria', 'A'], ['Samuel', 'Cruz', '3.º Secundaria', 'A'],
  ['Renata', 'Reyes', '2.º Primaria', 'B'], ['Emiliano', 'Ortiz', '4.º Secundaria', 'B'],
  ['Alessia', 'Vargas', '1.º Primaria', 'A'], ['Thiago', 'Navarro', '5.º Secundaria', 'C'],
  ['Paula', 'Salazar', '5.º Primaria', 'C'], ['Andrés', 'León', '6.º Primaria', 'B'],
];

export function createMockStudents(): Student[] {
  return NAMES.map(([firstName, lastName, grade, section], index) => {
    const gradeIndex = GRADES.indexOf(grade as typeof GRADES[number]);
    return {
      id: `EST-${String(index + 1).padStart(4, '0')}`, firstName, lastName,
      dni: String(80000001 + index), birthDate: `${2019 - gradeIndex}-03-15`, grade, section,
      status: index === 11 || index === 20 ? 'Inactivo' : 'Activo',
      guardianName: `Andrea ${lastName}`, guardianRelationship: 'Madre',
      guardianPhone: `900000${String(index + 1).padStart(3, '0')}`, guardianEmail: `familia${index + 1}@example.com`,
      history: gradeIndex > 0 ? [{ year: 2025, grade: GRADES[gradeIndex - 1], section, result: 'Promovido' }] : [],
    };
  });
}
