import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideUserCheck, LucideUserMinus, LucideX, LucidePlus, LucideSearch, LucideUsers, LucideEye, LucidePencil, LucideTrash2, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';
import { StudentsService } from '../../core/services/students.service';
import { GRADES, SECTIONS, Student, StudentQuery, StudentStatus, filterStudents } from '../../core/models/student.models';
import { ModalComponent } from '../../shared/modal.component';

import { StudentOverviewService } from '../../core/services/student-overview.service';
import { StatCardComponent } from '../../shared/stat-card.component';
import { PanelComponent } from '../../shared/panel.component';
import { StudentQrComponent } from '../../shared/student-qr.component';

const nonBlank = (control: AbstractControl) => String(control.value ?? '').trim() ? null : { required: true };
const birthDate = (control: AbstractControl) => !control.value || (Number.isFinite(Date.parse(control.value)) && control.value <= new Date().toISOString().slice(0, 10)) ? null : { date: true };

@Component({
  selector: 'app-students', standalone: true,
  imports: [StatCardComponent, PanelComponent, StudentQrComponent, LucideUserCheck, LucideUserMinus, LucideX, CommonModule, ReactiveFormsModule, ModalComponent, LucidePlus, LucideSearch, LucideUsers, LucideEye, LucidePencil, LucideTrash2, LucideChevronLeft, LucideChevronRight],
  templateUrl: './students.component.html', styleUrl: './students.component.scss',
})
export class StudentsComponent {
  protected readonly data = inject(StudentsService);
  protected readonly overview = inject(StudentOverviewService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  protected readonly canManage = computed(() => this.auth.currentUser()?.role === 'Administrador');
  protected readonly grades = GRADES;
  protected readonly sections = SECTIONS;
  protected readonly today = new Date().toISOString().slice(0, 10);
  protected readonly query = signal<StudentQuery>({ search: '', grade: '', section: '', status: '' });
  protected readonly activeFilters = computed(() => {
    const labels: Record<keyof StudentQuery, string> = { search: 'Búsqueda', grade: 'Grado', section: 'Sección', status: 'Estado' };
    return (Object.keys(labels) as (keyof StudentQuery)[]).filter(key => this.query()[key]).map(key => ({ key, label: labels[key], value: this.query()[key] }));
  });
  protected readonly filtered = computed(() => filterStudents(this.data.students(), this.query()));
  protected readonly pageSize = signal(10);
  private readonly requestedPage = signal(1);
  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));
  protected readonly page = computed(() => Math.min(this.requestedPage(), this.pageCount()));
  protected readonly rows = computed(() => this.filtered().slice((this.page() - 1) * this.pageSize(), this.page() * this.pageSize()));
  protected readonly first = computed(() => this.filtered().length ? (this.page() - 1) * this.pageSize() + 1 : 0);
  protected readonly last = computed(() => Math.min(this.page() * this.pageSize(), this.filtered().length));
  protected readonly activeCount = computed(() => this.data.students().filter(student => student.status === 'Activo').length);
  protected readonly mode = signal<'create' | 'edit' | 'profile' | 'delete' | null>(null);
  protected readonly selected = signal<Student | null>(null);
  protected readonly notice = signal('');
  protected readonly error = signal('');
  protected readonly dialogTitle = computed(() => ({ create: 'Registrar estudiante', edit: 'Editar estudiante', profile: 'Perfil del estudiante', delete: 'Eliminar estudiante' })[this.mode() ?? 'create']);
  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', [nonBlank, Validators.maxLength(60)]], lastName: ['', [nonBlank, Validators.maxLength(80)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], birthDate: ['', [Validators.required, birthDate]],
    grade: ['', Validators.required], section: ['', Validators.required], status: ['Activo' as StudentStatus, Validators.required],
    guardianName: ['', [nonBlank, Validators.maxLength(120)]], guardianRelationship: ['Madre', Validators.required],
    guardianPhone: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]], guardianEmail: ['', [Validators.email, Validators.maxLength(120)]],
  });

  protected setFilter(key: keyof StudentQuery, value: string): void {
    this.query.update(query => ({ ...query, [key]: value })); this.requestedPage.set(1);
  }
  protected clearFilters(): void { this.query.set({ search: '', grade: '', section: '', status: '' }); this.requestedPage.set(1); }
  protected changePage(delta: number): void { this.requestedPage.set(Math.min(this.pageCount(), Math.max(1, this.page() + delta))); }
  protected resizePage(value: string): void { this.pageSize.set(Number(value)); this.requestedPage.set(1); }
  protected initials(student: Student): string { return `${student.firstName[0]}${student.lastName[0]}`; }
  protected invalid(field: keyof typeof this.form.controls): boolean { return this.form.controls[field].touched && this.form.controls[field].invalid; }
  protected open(mode: 'create' | 'edit' | 'profile' | 'delete', student: Student | null = null): void {
    if (mode !== 'profile' && !this.canManage()) return;
    this.error.set(''); this.selected.set(student);
    this.form.reset({ firstName: '', lastName: '', dni: '', birthDate: '', grade: '', section: '', status: 'Activo', guardianName: '', guardianRelationship: 'Madre', guardianPhone: '', guardianEmail: '' });
    if (student) this.form.patchValue(student);
    this.mode.set(mode);
  }
  protected close(): void { this.mode.set(null); this.error.set(''); }
  protected save(): void {
    if (!this.canManage()) return;
    this.error.set('');
    this.form.patchValue(Object.fromEntries(Object.entries(this.form.getRawValue()).map(([key, value]) => [key, value.trim()])));
    this.form.markAllAsTouched();
    if (this.form.invalid) { this.error.set('Revisa los campos indicados.'); return; }
    try {
      const editing = this.mode() === 'edit';
      this.data.save(this.form.getRawValue(), editing ? this.selected()?.id : undefined);
      if (!editing) this.clearFilters();
      this.close(); this.notice.set(editing ? 'Cambios guardados en esta sesión.' : 'Estudiante registrado en esta sesión.');
    } catch (error) { this.error.set(error instanceof Error ? error.message : 'No se pudo guardar el estudiante.'); }
  }
  protected remove(): void {
    const student = this.selected();
    if (!student || !this.canManage()) return;
    try { this.data.remove(student.id); this.close(); this.notice.set('Estudiante eliminado de esta sesión.'); }
    catch (error) { this.error.set(error instanceof Error ? error.message : 'No se pudo eliminar.'); }
  }
}
