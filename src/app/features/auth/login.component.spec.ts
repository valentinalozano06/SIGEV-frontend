import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';

describe('Login form', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent], providers: [provideRouter([])],
    }).compileComponents();
  });

  async function render(email: string, password: string) {
    const fixture = TestBed.createComponent(LoginComponent);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    for (const [id, value] of [['email', email], ['password', password]]) {
      const input = element.querySelector<HTMLInputElement>('#' + id)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    return { fixture, element };
  }
  it('has no role selector and loads the account role on submit', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const { fixture, element } = await render('docente@sigev.edu.pe', 'sigev2026');
    expect(element.querySelector('select')).toBeNull();
    element.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(TestBed.inject(AuthService).currentUser()?.role).toBe('Docente');
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
  });
  it('shows a credential error without navigating', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const { fixture, element } = await render('estudiante@sigev.edu.pe', 'incorrecta');
    element.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Correo o contraseña incorrectos');
    expect(navigate).not.toHaveBeenCalled();
    expect(TestBed.inject(AuthService).currentUser()).toBeNull();
  });
  it('keeps required field validation', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const { fixture, element } = await render('', '');
    element.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(element.querySelector('#email-error')).not.toBeNull();
    expect(element.querySelector('#password-error')).not.toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });
});
