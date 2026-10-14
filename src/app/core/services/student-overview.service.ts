import { Injectable, computed, inject } from '@angular/core';
import { StudentsService } from './students.service';
@Injectable({providedIn:'root'})
export class StudentOverviewService {
  private readonly data = inject(StudentsService);
  readonly summary = computed(() => {
    const records = this.data.students(), total = records.length;
    const primary = records.filter(student => student.grade.includes('Primaria')).length;
    const active = records.filter(student => student.status === 'Activo').length;
    return {total, primary, secondary:total-primary, active, inactive:total-active,
      primaryPercent:total ? Math.round(primary/total*100) : 0,
      activePercent:total ? Math.round(active/total*100) : 0,
      inactivePercent:total ? Math.round((total-active)/total*100) : 0};
  });
  readonly recent = computed(() => this.data.students().slice(0,5));
}
