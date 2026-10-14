import { Routes } from '@angular/router';
import { roleGuard, sessionGuard } from './core/services/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent) },
  {
    path: '', canActivate: [sessionGuard], canActivateChild: [roleGuard],
    loadComponent: () => import('./layouts/shell.component').then((m) => m.ShellComponent), children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'estudiantes', loadComponent: () => import('./features/students/students.component').then((m) => m.StudentsComponent) },
      { path: 'asistencias', loadComponent: () => import('./features/attendance/attendance.component').then((m) => m.AttendanceComponent) },
      { path: 'control-ingreso', loadComponent: () => import('./features/check-in/check-in.component').then((m) => m.CheckInComponent) },
      ...[
        ['matriculas', 'Gestión de matrículas', 'Controla los procesos de matrícula del periodo escolar.'],
        ['academico', 'Gestión académica', 'Administra grados, secciones, cursos y rendimiento académico.'],
        ['docentes', 'Gestión de docentes', 'Consulta los docentes y sus asignaciones académicas.'],
        ['reportes', 'Reportes institucionales', 'Prepara reportes de estudiantes, matrículas y asistencia.'],
        ['configuracion', 'Configuración del sistema', 'Gestiona los parámetros generales de SIGEV.'],
      ].map(([path, title, description]) => ({ path, data: { title, description }, loadComponent: () => import('./features/placeholder/placeholder.component').then((m) => m.PlaceholderComponent) })),
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
