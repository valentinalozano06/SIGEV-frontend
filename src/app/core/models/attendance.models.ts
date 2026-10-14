export type AttendanceStatus = 'Presente' | 'Ausente' | 'Tardanza' | 'Justificado';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  note: string;
  updatedAt: string;
}

export interface AttendanceQuery {
  date: string;
  grade: string;
  section: string;
  search: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  completion: number;
}

export type NotificationKind = 'Asistencia' | 'Académica' | 'Institucional';

export interface SchoolNotification {
  id: string;
  title: string;
  message: string;
  kind: NotificationKind;
  createdAt: string;
  read: boolean;
  studentId?: string;
  guardianId?: string;
}
