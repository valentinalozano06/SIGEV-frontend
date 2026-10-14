import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { LucideCamera, LucideCheckCircle2, LucideClock3, LucideKeyboard, LucideRefreshCw, LucideScanLine, LucideShieldCheck, LucideUserRound } from '@lucide/angular';
import { CheckInEvent } from '../../core/models/access.models';
import { Student } from '../../core/models/student.models';
import { AlertService } from '../../core/services/alert.service';
import { CheckInService } from '../../core/services/check-in.service';
import { QrCredentialService } from '../../core/services/qr-credential.service';
import { StudentsService } from '../../core/services/students.service';

@Component({
  selector: 'app-check-in', standalone: true,
  imports: [CommonModule, FormsModule, LucideCamera, LucideCheckCircle2, LucideClock3, LucideKeyboard, LucideRefreshCw, LucideScanLine, LucideShieldCheck, LucideUserRound],
  templateUrl: './check-in.component.html', styleUrl: './check-in.component.scss',
})
export class CheckInComponent implements AfterViewInit, OnDestroy {
  private readonly students = inject(StudentsService);
  private readonly credentials = inject(QrCredentialService);
  private readonly checkIn = inject(CheckInService);
  private readonly alerts = inject(AlertService);
  private readonly qrReader = new BrowserQRCodeReader();
  private scannerControls?: IScannerControls;

  @ViewChild('video') private video?: ElementRef<HTMLVideoElement>;
  readonly manualToken = signal('');
  readonly cameraOn = signal(false);
  readonly cameraAvailable = signal(true);
  readonly message = signal('');
  readonly error = signal('');
  readonly selected = signal<Student | null>(null);
  readonly lastEvent = signal<CheckInEvent | null>(null);
  readonly recent = computed(() => this.checkIn.checkIns().slice(0, 8).map(event => ({ event, student: this.students.students().find(student => student.id === event.studentId) })).filter(item => item.student));

  ngAfterViewInit(): void { this.cameraAvailable.set(Boolean(navigator.mediaDevices?.getUserMedia)); }
  ngOnDestroy(): void { this.stopCamera(); }
  credentialFor(student: Student) { return this.credentials.credentialFor(student.id); }

  async startCamera() {
    this.error.set('');
    if (!navigator.mediaDevices?.getUserMedia || !this.video) {
      this.cameraAvailable.set(false);
      this.error.set('Este navegador no permite acceder a la camara. Usa el codigo manual.');
      return;
    }
    try {
      this.cameraOn.set(true);
      this.scannerControls = await this.qrReader.decodeFromConstraints(
        { audio: false, video: { facingMode: { ideal: 'environment' } } },
        this.video.nativeElement,
        result => {
          if (!result || !this.cameraOn()) return;
          this.processToken(result.getText());
          this.stopCamera();
        },
      );
      if (!this.cameraOn()) this.scannerControls.stop();
    } catch {
      this.stopCamera();
      this.error.set('No se pudo acceder a la camara. Permite el acceso y vuelve a intentarlo.');
    }
  }

  stopCamera() { this.scannerControls?.stop(); this.scannerControls = undefined; this.cameraOn.set(false); }
  async scanManual() { const token = this.manualToken().trim(); if (token) this.processToken(token); }

  private processToken(token: string) {
    this.message.set('');
    this.error.set('');
    const studentId = this.credentials.studentIdFor(token);
    const student = studentId ? this.students.students().find(item => item.id === studentId && item.status === 'Activo') : undefined;
    if (!student) { this.error.set('QR no valido o estudiante inactivo.'); return; }
    const result = this.checkIn.capture(student);
    this.selected.set(student);
    this.lastEvent.set(result.event);
    this.message.set(result.duplicate ? 'Este estudiante ya registro su ingreso hoy.' : 'Ingreso registrado y aviso enviado al apoderado.');
  }

  formatTime(value: string) { return value; }
  formatDate(value: string) { return new Date(`${value}T00:00:00`).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }); }
  async showManualHelp() { await this.alerts.info('Codigo de prueba', 'Puedes probar con SIGEV-EST-0001-000176, que corresponde a Lucia Fernandez.'); }
}
