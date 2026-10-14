import { Injectable, inject, signal } from '@angular/core';
import { Student } from '../models/student.models';
import { AttendanceRecord, AttendanceStatus, AttendanceStats } from '../models/attendance.models';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly notifications = inject(NotificationService);
  private readonly records = signal<AttendanceRecord[]>([]);
  readonly attendance = this.records.asReadonly();
  recordsFor(students: readonly Student[], date: string): AttendanceRecord[] {
    const existing = this.records().filter(record => record.date === date);
    const currentIds = new Set(existing.map(record => record.studentId));
    const seeded = students.filter(student => !currentIds.has(student.id)).map((student, index) => ({
      id: `ASI-${student.id}-${date}`, studentId: student.id, date,
      status: this.seedStatus(index), note: '', updatedAt: new Date().toISOString(),
    }));
    return [...existing, ...seeded];
  }

  save(student: Student, date: string, status: AttendanceStatus, note = ''): AttendanceRecord {
    const current = this.records().find(record => record.studentId === student.id && record.date === date);
    const record: AttendanceRecord = current
      ? { ...current, status, note: note.trim(), updatedAt: new Date().toISOString() }
      : { id: `ASI-${student.id}-${date}`, studentId: student.id, date, status, note: note.trim(), updatedAt: new Date().toISOString() };
    this.records.update(items => current ? items.map(item => item.id === current.id ? record : item) : [...items, record]);
    if (status === 'Ausente' || status === 'Tardanza') this.notifications.addAttendanceNotice(student.id, `${student.firstName} ${student.lastName}`, status, date);
    return record;
  }

  remove(studentId: string, date: string): void { this.records.update(items => items.filter(item => !(item.studentId === studentId && item.date === date))); }

  stats(records: readonly AttendanceRecord[]): AttendanceStats {
    const total = records.length, present = records.filter(r => r.status === 'Presente').length;
    const absent = records.filter(r => r.status === 'Ausente').length, late = records.filter(r => r.status === 'Tardanza').length, excused = records.filter(r => r.status === 'Justificado').length;
    return { total, present, absent, late, excused, completion: total ? Math.round((present + absent + late + excused) / total * 100) : 0 };
  }

  private seedStatus(index: number): AttendanceStatus { return index % 13 === 0 ? 'Ausente' : index % 9 === 0 ? 'Tardanza' : index % 17 === 0 ? 'Justificado' : 'Presente'; }
}
