import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent) },
  {
    path: '', loadComponent: () => import('./layouts/shell.component').then((m) => m.ShellComponent), children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      ...[
        ['estudiantes', 'Gestión de estudiantes', 'Consulta y administra la información de los estudiantes.'],
        ['matriculas', 'Gestión de matrículas', 'Controla los procesos de matrícula del periodo escolar.'],
        ['asistencias', 'Control de asistencias', 'Registra y consulta la asistencia diaria por grado y sección.'],
        ['academico', 'Gestión académica', 'Administra grados, secciones, cursos y rendimiento académico.'],
        ['docentes', 'Gestión de docentes', 'Consulta los docentes y sus asignaciones académicas.'],
        ['reportes', 'Reportes institucionales', 'Prepara reportes de estudiantes, matrículas y asistencia.'],
        ['configuracion', 'Configuración del sistema', 'Gestiona los parámetros generales de SIGEV.'],
      ].map(([path, title, description]) => ({ path, data: { title, description }, loadComponent: () => import('./features/placeholder/placeholder.component').then((m) => m.PlaceholderComponent) })),
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
