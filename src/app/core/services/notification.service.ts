import { Injectable, signal } from '@angular/core';
import { NotificationKind, SchoolNotification } from '../models/attendance.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly records = signal<SchoolNotification[]>([
    { id: 'NOT-0001', title: 'Bienvenido a SIGEV', message: 'Revisa desde aquí los comunicados y avisos de la institución.', kind: 'Institucional', createdAt: new Date().toISOString(), read: false },
  ]);
  readonly notifications = this.records.asReadonly();
  readonly unreadCount = () => this.records().filter(item => !item.read).length;

  add(input: Pick<SchoolNotification, 'title' | 'message' | 'kind'> & { studentId?: string; guardianId?: string }): SchoolNotification {
    const notification: SchoolNotification = { ...input, id: `NOT-${String(this.records().length + 1).padStart(4, '0')}`, createdAt: new Date().toISOString(), read: false };
    this.records.update(items => [notification, ...items]);
    return notification;
  }

  addAttendanceNotice(studentId: string, studentName: string, status: 'Ausente' | 'Tardanza', date: string): SchoolNotification {
    const label = status === 'Ausente' ? 'registró una inasistencia' : 'registró una tardanza';
    return this.add({ title: `Aviso de asistencia · ${studentName}`, message: `${studentName} ${label} el ${date}. Revisa el detalle en SIGEV.`, kind: 'Asistencia', studentId });
  }

  addAttendanceEntryNotice(studentId: string, guardianId: string, studentName: string, status: 'Presente' | 'Tardanza', date: string, time: string): SchoolNotification {
    const label = status === 'Tardanza' ? 'registró su ingreso con tardanza' : 'registró su ingreso';
    return this.add({ title: `Ingreso registrado · ${studentName}`, message: `${studentName} ${label} el ${date} a las ${time}.`, kind: 'Asistencia', studentId, guardianId });
  }

  markRead(id: string): void { this.records.update(items => items.map(item => item.id === id ? { ...item, read: true } : item)); }
  markAllRead(): void { this.records.update(items => items.map(item => ({ ...item, read: true }))); }
  remove(id: string): void { this.records.update(items => items.filter(item => item.id !== id)); }
  clear(): void { this.records.set([]); }
}
