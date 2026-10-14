import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideUsers, LucideUserCheck, LucideCalendarCheck, LucideGraduationCap, LucideArrowUpRight, LucideClipboardCheck, LucideSearch } from '@lucide/angular';
import { AttendanceService } from '../../core/services/attendance.service';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { StudentOverviewService } from '../../core/services/student-overview.service';
import { StudentsService } from '../../core/services/students.service';
import { StatCardComponent } from '../../shared/stat-card.component';
import { PanelComponent } from '../../shared/panel.component';
@Component({selector:'app-dashboard',standalone:true,imports:[CommonModule,RouterLink,LucideUsers,LucideUserCheck,LucideCalendarCheck,LucideGraduationCap,LucideArrowUpRight,LucideClipboardCheck,LucideSearch,StatCardComponent,PanelComponent],templateUrl:'./dashboard.view.html',styleUrl:'./dashboard.component.scss'})
export class DashboardComponent {
  protected readonly auth = inject(AuthService);
  protected readonly data = inject(MockDataService);
  protected readonly overview = inject(StudentOverviewService);
  protected readonly students = inject(StudentsService);
  protected readonly attendance = inject(AttendanceService);
  protected readonly today = new Intl.DateTimeFormat('es-PE',{day:'numeric',month:'long',year:'numeric'}).format(new Date());
  protected readonly weekdays = ['Lun','Mar','Mié','Jue','Vie','Sáb'];
  protected readonly attendanceBars = [86,91,94,89,97,95];
  protected readonly average = Math.round(this.attendanceBars.reduce((sum,value) => sum+value,0)/this.attendanceBars.length);
  protected readonly todayStats = computed(() => this.attendance.stats(this.attendance.recordsFor(this.students.students(), new Date().toISOString().slice(0, 10))));
  protected readonly distribution = computed(() => {
    const summary = this.overview.summary();
    return summary.total ? `conic-gradient(#286a7c 0 ${summary.primaryPercent}%, #d1b575 ${summary.primaryPercent}% 100%)` : '#e9edef';
  });
}
