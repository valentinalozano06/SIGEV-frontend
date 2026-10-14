import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideBell, LucideCheck, LucideClipboardCheck, LucideMessageCircle, LucidePencil, LucideSearch } from '@lucide/angular';
import { AttendanceService } from '../../core/services/attendance.service';
import { AlertService } from '../../core/services/alert.service';
import { AuthService } from '../../core/services/auth.service';
import { StudentsService } from '../../core/services/students.service';
import { AttendanceStatus } from '../../core/models/attendance.models';
import { GRADES, SECTIONS, Student } from '../../core/models/student.models';
import { PanelComponent } from '../../shared/panel.component';
import { StatCardComponent } from '../../shared/stat-card.component';
import { ModalComponent } from '../../shared/modal.component';

@Component({ selector: 'app-attendance', standalone: true, imports: [CommonModule, RouterLink, PanelComponent, StatCardComponent, ModalComponent, LucideBell, LucideCheck, LucideClipboardCheck, LucideMessageCircle, LucidePencil, LucideSearch], templateUrl: './attendance.component.html', styleUrl: './attendance.component.scss' })
export class AttendanceComponent {
  private readonly studentsService = inject(StudentsService); private readonly attendance = inject(AttendanceService); private readonly auth = inject(AuthService); private readonly alerts = inject(AlertService);
  readonly grades = GRADES; readonly sections = SECTIONS; readonly statuses: AttendanceStatus[] = ['Presente', 'Ausente', 'Tardanza', 'Justificado'];
  readonly query = signal({ date: new Date().toISOString().slice(0, 10), grade: '', section: '', search: '' });
  readonly students = computed(() => this.studentsService.students().filter(s => s.status === 'Activo').filter(s => { const q = this.query(); const text = `${s.firstName} ${s.lastName} ${s.dni} ${s.id}`.toLowerCase(); return (!q.grade || s.grade === q.grade) && (!q.section || s.section === q.section) && (!q.search || text.includes(q.search.toLowerCase().trim())); }));
  readonly records = computed(() => this.attendance.recordsFor(this.studentsService.students(), this.query().date)); readonly stats = computed(() => this.attendance.stats(this.records()));
  readonly canEdit = computed(() => ['Administrador', 'Docente', 'Auxiliar'].includes(this.auth.currentUser()?.role ?? ''));
  readonly noteStudent = signal<Student | null>(null); readonly noteDraft = signal('');
  recordFor(id: string) { return this.records().find(r => r.studentId === id); } percentage(value: number) { return this.stats().total ? Math.round(value / this.stats().total * 100) : 0; }
  trackStudent(_index: number, student: Student) { return student.id; }
  setQuery(key: 'date'|'grade'|'section'|'search', value: string) { this.query.update(q => ({ ...q, [key]: value })); } resetFilters() { this.query.update(q => ({ ...q, grade: '', section: '', search: '' })); }
  async changeStatus(student: Student, value: string) { if (!this.canEdit() || !this.statuses.includes(value as AttendanceStatus)) return; const status = value as AttendanceStatus; if (status === 'Ausente' || status === 'Tardanza') { if (!await this.alerts.confirm(`Registrar ${status.toLowerCase()}`, `Se notificará al apoderado de ${student.firstName} ${student.lastName}.`, 'Registrar')) return; } this.attendance.save(student, this.query().date, status); await this.alerts.success('Asistencia actualizada', `${student.firstName} ${student.lastName}: ${status}.`); }
  openNote(student: Student) { this.noteStudent.set(student); this.noteDraft.set(this.recordFor(student.id)?.note ?? ''); }
  closeNote() { this.noteStudent.set(null); this.noteDraft.set(''); }
  noteTitle() { return this.recordFor(this.noteStudent()?.id ?? '')?.note ? 'Editar observación' : 'Nueva observación'; }
  async saveObservation(note: string) { const student = this.noteStudent(); if (!student || !this.canEdit()) return; this.attendance.save(student, this.query().date, this.recordFor(student.id)?.status ?? 'Presente', note); this.closeNote(); await this.alerts.success('Observación guardada', `La nota de ${student.firstName} ${student.lastName} fue actualizada.`); }
  async deleteObservation() { const student = this.noteStudent(); const previousNote = this.recordFor(student?.id ?? '')?.note ?? ''; if (!student || !previousNote) return; this.closeNote(); await new Promise(resolve => setTimeout(resolve, 0)); const confirmed = await this.alerts.confirm('Eliminar observación', 'La asistencia permanecerá registrada y solo se quitará el comentario.', 'Eliminar'); if (!confirmed) { this.noteStudent.set(student); this.noteDraft.set(previousNote); return; } this.attendance.save(student, this.query().date, this.recordFor(student.id)?.status ?? 'Presente', ''); await this.alerts.success('Observación eliminada', 'La asistencia sigue registrada.'); }
  async markAll(status: AttendanceStatus) { if (!this.canEdit()) return; if (!await this.alerts.confirm('Actualizar lista visible', `Se marcarán ${this.students().length} estudiantes como ${status.toLowerCase()}.`, 'Aplicar')) return; this.students().forEach(s => this.attendance.save(s, this.query().date, status)); await this.alerts.success('Lista actualizada', 'Los cambios se guardaron en la sesión actual.'); }
}
