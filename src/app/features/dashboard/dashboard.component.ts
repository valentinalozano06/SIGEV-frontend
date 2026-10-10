import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LucideArrowUpRight as ArrowUpRight, LucideCalendarCheck as CalendarCheck, LucideCalendarDays as CalendarDays, LucideChevronDown as ChevronDown, LucideClipboardList as ClipboardList, LucideDownload as Download, LucideGraduationCap as GraduationCap, LucideMoreHorizontal as MoreHorizontal, LucideSparkles as Sparkles, LucideUsersRound as UsersRound } from '@lucide/angular';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-dashboard', standalone: true,
  imports: [CommonModule, ArrowUpRight, CalendarCheck, CalendarDays, ChevronDown, ClipboardList, Download, GraduationCap, MoreHorizontal, Sparkles, UsersRound],
  templateUrl: './dashboard.view.html', styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  protected readonly data = inject(MockDataService);
  protected readonly weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  protected readonly attendanceBars = [86, 91, 94, 89, 97, 95];
  protected readonly grades = [
    { label: 'Primaria', value: 723, percent: 55, color: 'blue' },
    { label: 'Secundaria', value: 597, percent: 45, color: 'gold' },
  ];
}
