export interface QrCredential {
  studentId: string;
  token: string;
  active: boolean;
  issuedAt: string;
}

export interface Guardian {
  id: string;
  fullName: string;
  phone: string;
  email: string;
}

export interface StudentGuardian {
  studentId: string;
  guardianId: string;
  relationship: 'Madre' | 'Padre' | 'Apoderado';
  primary: boolean;
  receivesAttendanceAlerts: boolean;
}

export interface CheckInEvent {
  id: string;
  studentId: string;
  date: string;
  time: string;
  status: 'Presente' | 'Tardanza';
  source: 'QR' | 'Manual';
}
