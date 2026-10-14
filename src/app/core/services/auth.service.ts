import { Injectable, signal } from '@angular/core';
import { UserRole, UserSession } from '../models/app.models';
import { MOCK_ACCOUNTS } from './mock-accounts';

const ROLE_ROUTES: Record<UserRole, readonly string[]> = {
  Administrador: ['dashboard', 'estudiantes', 'matriculas', 'asistencias', 'control-ingreso', 'academico', 'docentes', 'reportes', 'configuracion'],
  Director: ['dashboard', 'academico', 'reportes'],
  Docente: ['dashboard', 'estudiantes', 'asistencias', 'control-ingreso', 'academico'],
  Auxiliar: ['dashboard', 'estudiantes', 'asistencias', 'control-ingreso'],
  Estudiante: ['dashboard', 'asistencias', 'academico'],
  Apoderado: ['dashboard', 'asistencias', 'academico'],
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal<UserSession | null>(null);
  readonly currentUser = this.session.asReadonly();

  login(email: string, password: string): boolean {
    this.session.set(null);
    const account = MOCK_ACCOUNTS.find(
      (candidate) => candidate.email === email.trim().toLowerCase() && candidate.password === password,
    );
    if (!account) return false;
    this.session.set({ ...account.user });
    return true;
  }

  canAccess(path: string): boolean {
    const user = this.session();
    return !!user && ROLE_ROUTES[user.role].includes(path.replace(/^\//, ''));
  }

  logout(): void {
    this.session.set(null);
  }
}
