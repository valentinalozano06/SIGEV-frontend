import { Injectable } from '@angular/core';
import { Guardian, StudentGuardian } from '../models/access.models';
import { Student } from '../models/student.models';

@Injectable({ providedIn: 'root' })
export class GuardianService {
  guardiansFor(student: Student): { guardian: Guardian; relation: StudentGuardian }[] {
    const guardian: Guardian = { id: `APO-${student.id}`, fullName: student.guardianName, phone: student.guardianPhone, email: student.guardianEmail };
    return [{ guardian, relation: { studentId: student.id, guardianId: guardian.id, relationship: student.guardianRelationship as StudentGuardian['relationship'], primary: true, receivesAttendanceAlerts: true } }];
  }
}
