import { Injectable, signal } from '@angular/core';
import { QrCredential } from '../models/access.models';

@Injectable({ providedIn: 'root' })
export class QrCredentialService {
  private readonly credentials = signal<QrCredential[]>([]);
  readonly all = this.credentials.asReadonly();

  credentialFor(studentId: string): QrCredential {
    const existing = this.credentials().find(item => item.studentId === studentId);
    if (existing) return existing;
    const credential: QrCredential = { studentId, token: `SIGEV-${studentId}-${this.tokenSuffix(studentId)}`, active: true, issuedAt: new Date().toISOString() };
    this.credentials.update(items => [...items, credential]);
    return credential;
  }

  studentIdFor(token: string): string | null {
    return this.credentials().find(item => item.token === token.trim() && item.active)?.studentId ?? this.studentIdFromFixture(token.trim());
  }

  regenerate(studentId: string): QrCredential {
    const random = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
    const credential: QrCredential = { studentId, token: `SIGEV-${studentId}-${random.slice(0, 8).toUpperCase()}`, active: true, issuedAt: new Date().toISOString() };
    this.credentials.update(items => [...items.filter(item => item.studentId !== studentId), credential]);
    return credential;
  }

  deactivate(studentId: string): void { this.credentials.update(items => items.map(item => item.studentId === studentId ? { ...item, active: false } : item)); }

  private tokenSuffix(studentId: string): string { return Array.from(studentId).reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 1000000, 7).toString().padStart(6, '0'); }
  private studentIdFromFixture(token: string): string | null {
    const match = /^SIGEV-(EST-\d{4})-/.exec(token);
    return match?.[1] ?? null;
  }
}
