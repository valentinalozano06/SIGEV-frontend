export type UserRole = 'Administrador' | 'Director' | 'Docente' | 'Auxiliar' | 'Estudiante' | 'Apoderado';

export interface UserSession {
  name: string;
  role: UserRole;
  initials: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
  trend: string;
  tone: 'blue' | 'green' | 'amber' | 'violet';
}

export interface ActivityItem {
  title: string;
  description: string;
  time: string;
  tone: 'blue' | 'green' | 'amber' | 'red';
}

export interface StudentSummary {
  name: string;
  grade: string;
  section: string;
  attendance: string;
  status: 'Regular' | 'Pendiente' | 'Observado';
}
