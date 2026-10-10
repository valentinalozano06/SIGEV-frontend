import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideBell as Bell, LucideBookOpen as BookOpen, LucideCalendarCheck as CalendarCheck, LucideChevronDown as ChevronDown, LucideClipboardList as ClipboardList, LucideFileBarChart as FileBarChart, LucideGraduationCap as GraduationCap, LucideLayoutDashboard as LayoutDashboard, LucideLogOut as LogOut, LucideMenu as Menu, LucideSchool as School, LucideSettings as Settings, LucideUsers as Users, LucideX as X } from '@lucide/angular';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-shell', standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, Bell, BookOpen, CalendarCheck, ChevronDown, ClipboardList, FileBarChart, GraduationCap, LayoutDashboard, LogOut, Menu, School, Settings, Users, X],
  templateUrl: './shell.view.html', styleUrl: './shell.component.scss',
})
export class ShellComponent {
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);
  protected sidebarOpen = false;
  protected readonly primaryNav = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Estudiantes', route: '/estudiantes', icon: Users },
    { label: 'Matrículas', route: '/matriculas', icon: ClipboardList },
    { label: 'Asistencias', route: '/asistencias', icon: CalendarCheck },
  ];
  protected readonly academicNav = [
    { label: 'Gestión académica', route: '/academico', icon: BookOpen },
    { label: 'Docentes', route: '/docentes', icon: GraduationCap },
    { label: 'Reportes', route: '/reportes', icon: FileBarChart },
  ];
  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar(): void { this.sidebarOpen = false; }
  logout(): void { void this.router.navigate(['/login']); this.closeSidebar(); }
}
