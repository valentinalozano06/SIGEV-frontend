import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideEye as Eye, LucideEyeOff as EyeOff, LucideLockKeyhole as LockKeyhole, LucideLogIn as LogIn, LucideMail as Mail } from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Eye, EyeOff, LockKeyhole, LogIn, Mail],
  templateUrl: './login.component.html', styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  protected showPassword = false;
  protected recoveryVisible = false;
  protected loginError = '';
  protected submitted = false;
  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  submit(): void {
    this.submitted = true;
    this.loginError = '';
    this.loginForm.controls.email.setValue(this.loginForm.controls.email.value.trim());
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.getRawValue();
    if (!this.auth.login(email, password)) {
      this.loginError = 'Correo o contraseña incorrectos.';
      return;
    }
    void this.router.navigate(['/dashboard']);
  }
}
