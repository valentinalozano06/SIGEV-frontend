import { UserSession } from '../models/app.models';

// Temporary frontend fixtures. Replace credential checking with the backend
// authentication endpoint; these accounts are not real institutional users.
interface MockAccount {
  email: string;
  password: string;
  user: UserSession;
}

export const MOCK_ACCOUNTS: readonly MockAccount[] = [
  { email: 'admin@sigev.edu.pe', password: 'sigev2026', user: { name: 'María Elena García', role: 'Administrador', initials: 'MG' } },
  { email: 'director@sigev.edu.pe', password: 'sigev2026', user: { name: 'Elena Vargas', role: 'Director', initials: 'EV' } },
  { email: 'docente@sigev.edu.pe', password: 'sigev2026', user: { name: 'Carlos Mendoza', role: 'Docente', initials: 'CM' } },
  { email: 'auxiliar@sigev.edu.pe', password: 'auxiliar2026', user: { name: 'Rosa Martínez', role: 'Auxiliar', initials: 'RM' } },
  { email: 'estudiante@sigev.edu.pe', password: 'sigev2026', user: { name: 'Lucía Fernández', role: 'Estudiante', initials: 'LF' } },
  { email: 'apoderado@sigev.edu.pe', password: 'sigev2026', user: { name: 'Ana Torres', role: 'Apoderado', initials: 'AT' } },
];
