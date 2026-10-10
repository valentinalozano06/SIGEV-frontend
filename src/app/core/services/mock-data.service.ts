import { Injectable } from '@angular/core';
import { ActivityItem, DashboardMetric, StudentSummary } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  readonly metrics: DashboardMetric[] = [
    { label: 'Estudiantes matriculados', value: '1,320', detail: 'En primaria y secundaria', trend: '+4.8%', tone: 'blue' },
    { label: 'Matrículas registradas', value: '1,284', detail: 'Periodo escolar 2026', trend: '+8.2%', tone: 'green' },
    { label: 'Asistencia de hoy', value: '94.6%', detail: '1,248 presentes', trend: '+2.4%', tone: 'amber' },
    { label: 'Docentes activos', value: '64', detail: '31 primaria · 33 secundaria', trend: '+3.1%', tone: 'violet' },
  ];
  readonly activities: ActivityItem[] = [
    { title: 'Nueva matrícula registrada', description: 'La familia de Mateo González completó el proceso.', time: 'Hace 18 minutos', tone: 'blue' },
    { title: 'Asistencia consolidada', description: 'Primaria registró la asistencia de todos sus grados.', time: 'Hace 52 minutos', tone: 'green' },
    { title: 'Revisión pendiente', description: 'Hay 12 matrículas que requieren validar documentos.', time: 'Hace 2 horas', tone: 'amber' },
    { title: 'Reporte institucional generado', description: 'El resumen académico de febrero está disponible.', time: 'Ayer, 4:30 p. m.', tone: 'red' },
  ];
  readonly recentStudents: StudentSummary[] = [
    { name: 'Lucía Fernández', grade: '5.º Primaria', section: 'A', attendance: '98%', status: 'Regular' },
    { name: 'Diego Ramírez', grade: '2.º Secundaria', section: 'B', attendance: '96%', status: 'Regular' },
    { name: 'Valentina Torres', grade: '6.º Primaria', section: 'A', attendance: '91%', status: 'Pendiente' },
    { name: 'Mateo González', grade: '4.º Secundaria', section: 'C', attendance: '87%', status: 'Observado' },
  ];
}
