import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, inject } from '@angular/core';
import { LucideRefreshCw, LucideShieldCheck } from '@lucide/angular';
import QRCode from 'qrcode';
import { Student } from '../core/models/student.models';
import { QrCredentialService } from '../core/services/qr-credential.service';

@Component({
  selector: 'app-student-qr', standalone: true, imports: [CommonModule, LucideRefreshCw, LucideShieldCheck],
  template: `<section class="qr-card"><div class="qr-heading"><div><span class="qr-kicker">CREDENCIAL DE INGRESO</span><h4>QR del estudiante</h4><p>Se usa para registrar su llegada.</p></div><svg lucideShieldCheck [size]="18"></svg></div><div class="qr-body"><div class="qr-image">@if (dataUrl) { <img [src]="dataUrl" [alt]="'Código QR de ' + student.firstName + ' ' + student.lastName" /> } @else { <span>Generando…</span> }</div><div><strong>{{ student.firstName }} {{ student.lastName }}</strong><small>{{ student.id }}</small><span class="private-token">Token privado</span><button type="button" (click)="regenerate()"><svg lucideRefreshCw [size]="14"></svg>Regenerar QR</button></div></div></section>`,
  styles: [`:host{display:block}.qr-card{padding:16px;border:1px solid #dce9eb;border-radius:12px;background:#f7fbfb}.qr-heading{display:flex;justify-content:space-between;gap:12px}.qr-heading>svg{color:#317256}.qr-kicker{color:#8c7138;font-size:9px;font-weight:800;letter-spacing:.13em}.qr-heading h4{margin:5px 0 3px;color:#27485f;font-size:14px}.qr-heading p{margin:0;color:#78909e;font-size:10px}.qr-body{display:flex;align-items:center;gap:15px;margin-top:14px}.qr-image{display:grid;place-items:center;width:106px;height:106px;padding:7px;border-radius:9px;background:#fff;border:1px solid #e1ebed}.qr-image img{display:block;width:90px;height:90px}.qr-body strong,.qr-body small,.private-token{display:block}.qr-body strong{color:#345166;font-size:12px}.qr-body small{margin-top:4px;color:#8197a4;font-size:10px}.private-token{width:max-content;margin-top:12px;padding:4px 7px;border-radius:5px;background:#e9f4ed;color:#317256;font-size:9px;font-weight:700}.qr-body button{display:flex;align-items:center;gap:5px;margin-top:12px;padding:0;border:0;background:none;color:#22677a;font-size:10px;font-weight:700;cursor:pointer}.qr-body button:hover{text-decoration:underline}`],
})
export class StudentQrComponent implements OnChanges {
  @Input({ required: true }) student!: Student;
  private readonly credentials = inject(QrCredentialService);
  protected dataUrl = '';
  ngOnChanges(): void { void this.generate(); }
  protected async regenerate() { this.credentials.regenerate(this.student.id); await this.generate(); }
  private async generate() { this.dataUrl = await QRCode.toDataURL(this.credentials.credentialFor(this.student.id).token, { width: 180, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#17384d', light: '#ffffff' } }); }
}
