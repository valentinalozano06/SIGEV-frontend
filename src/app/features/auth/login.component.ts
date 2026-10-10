import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideEye as Eye, LucideEyeOff as EyeOff, LucideLockKeyhole as LockKeyhole, LucideLogIn as LogIn, LucideMail as Mail, LucideSchool as School } from '@lucide/angular';
import { UserRole } from '../../core/models/app.models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Eye, EyeOff, LockKeyhole, LogIn, Mail, School],
  templateUrl: './login.component.html', styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  protected showPassword = false;
  protected selectedRole: UserRole = 'Administrador';
  protected submitted = false;
  protected readonly roles: UserRole[] = ['Administrador', 'Director', 'Docente', 'Estudiante', 'Apoderado'];
  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['admin@sigev.edu.pe', [Validators.required, Validators.email]],
    password: ['sigev2026', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });
  setRole(role: UserRole): void { this.selectedRole = role; }
  submit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    this.auth.login(this.selectedRole);
    void this.router.navigate(['/dashboard']);
  }
}
