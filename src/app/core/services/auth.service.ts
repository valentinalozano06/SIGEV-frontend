import { Injectable, signal } from '@angular/core';
import { UserRole, UserSession } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<UserSession>({ name: 'María Elena García', role: 'Administrador', initials: 'MG' });

  login(role: UserRole): void {
    const users: Record<UserRole, UserSession> = {
      Administrador: { name: 'María Elena García', role, initials: 'MG' },
      Director: { name: 'Hna. Flora Ñañez', role, initials: 'FN' },
      Docente: { name: 'Carlos Mendoza', role, initials: 'CM' },
      Estudiante: { name: 'Lucía Fernández', role, initials: 'LF' },
      Apoderado: { name: 'Ana Torres', role, initials: 'AT' },
    };
    this.currentUser.set(users[role]);
  }
}
