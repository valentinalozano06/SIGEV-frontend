import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { GRADES, SECTIONS, Student, StudentInput } from '../models/student.models';
import { createMockStudents } from '../../mocks/students.mock';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private readonly auth = inject(AuthService);
  private readonly records = signal<Student[]>(createMockStudents());
  readonly students = this.records.asReadonly();
  private sequence = 25;

  save(input: StudentInput, id?: string): Student {
    this.requireAdministrator();
    const cleaned: StudentInput = {
      firstName: input.firstName.trim(), lastName: input.lastName.trim(), dni: input.dni.trim(), birthDate: input.birthDate.trim(),
      grade: input.grade.trim(), section: input.section.trim(), status: input.status,
      guardianName: input.guardianName.trim(), guardianRelationship: input.guardianRelationship.trim(),
      guardianPhone: input.guardianPhone.trim(), guardianEmail: input.guardianEmail.trim(),
    };
    if (!cleaned.firstName || !cleaned.lastName || !/^\d{8}$/.test(cleaned.dni)) throw new Error('Revisa los nombres y el DNI de 8 dígitos.');
    if (!cleaned.birthDate || !Number.isFinite(Date.parse(cleaned.birthDate)) || cleaned.birthDate > new Date().toISOString().slice(0, 10)) throw new Error('La fecha de nacimiento no es válida.');
    if (!(GRADES as readonly string[]).includes(cleaned.grade) || !(SECTIONS as readonly string[]).includes(cleaned.section) || !['Activo', 'Inactivo'].includes(cleaned.status)) throw new Error('Revisa el grado, la sección y el estado.');
    if (!cleaned.guardianName || !['Madre', 'Padre', 'Apoderado'].includes(cleaned.guardianRelationship) || !/^9\d{8}$/.test(cleaned.guardianPhone) || (cleaned.guardianEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.guardianEmail))) throw new Error('Revisa los datos del apoderado.');
    if (this.records().some(student => student.dni === cleaned.dni && student.id !== id)) throw new Error('Ya existe un estudiante con este DNI.');
    const existing = id ? this.records().find(student => student.id === id) : undefined;
    if (id && !existing) throw new Error('El estudiante ya no está disponible.');
    const student: Student = { ...cleaned, id: existing?.id ?? `EST-${String(this.sequence++).padStart(4, '0')}`, history: existing?.history ?? [] };
    this.records.update(records => existing ? records.map(record => record.id === id ? student : record) : [student, ...records]);
    return student;
  }

  remove(id: string): void {
    this.requireAdministrator();
    if (!this.records().some(student => student.id === id)) throw new Error('El estudiante ya no está disponible.');
    this.records.update(records => records.filter(student => student.id !== id));
  }

  private requireAdministrator(): void {
    // Frontend behavior only. The future REST backend must authorize every write.
    if (this.auth.currentUser()?.role !== 'Administrador') throw new Error('Tu cuenta solo puede consultar estudiantes.');
  }
}
