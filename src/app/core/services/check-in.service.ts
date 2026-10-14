import { Injectable, inject, signal } from '@angular/core';
import { AttendanceService } from './attendance.service';
import { GuardianService } from './guardian.service';
import { NotificationService } from './notification.service';
import { CheckInEvent } from '../models/access.models';
import { Student } from '../models/student.models';
import { AttendanceStatus } from '../models/attendance.models';

@Injectable({ providedIn: 'root' })
export class CheckInService {
  private readonly attendance = inject(AttendanceService);
  private readonly guardians = inject(GuardianService);
  private readonly notifications = inject(NotificationService);
  private readonly events = signal<CheckInEvent[]>([]);
  readonly checkIns = this.events.asReadonly();
  readonly punctualityLimit = signal('08:00');

  capture(student: Student, at = new Date()): { event: CheckInEvent; duplicate: boolean } {
    const date = this.localDate(at); const time = at.toTimeString().slice(0, 5);
    const previous = this.events().find(event => event.studentId === student.id && event.date === date);
    if (previous) return { event: previous, duplicate: true };
    const status: AttendanceStatus = time > this.punctualityLimit() ? 'Tardanza' : 'Presente';
    const event: CheckInEvent = { id: `ING-${student.id}-${date}`, studentId: student.id, date, time, status, source: 'QR' };
    this.events.update(items => [event, ...items]);
    this.attendance.save(student, date, status);
    for (const item of this.guardians.guardiansFor(student)) if (item.relation.receivesAttendanceAlerts) this.notifications.addAttendanceEntryNotice(student.id, item.guardian.id, student.firstName + ' ' + student.lastName, status, date, time);
    return { event, duplicate: false };
  }

  private localDate(date: Date): string { const year = date.getFullYear(); const month = String(date.getMonth() + 1).padStart(2, '0'); const day = String(date.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`; }
}
