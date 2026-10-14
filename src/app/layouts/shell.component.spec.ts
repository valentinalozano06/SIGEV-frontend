import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ShellComponent } from './shell.component';
import { AuthService } from '../core/services/auth.service';

describe('Responsive navigation', () => {
  const originalWidth = window.innerWidth;
  const originalOverflow = document.body.style.overflow;

  function viewport(width: number): void {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
    window.dispatchEvent(new Event('resize'));
  }

  beforeEach(async () => {
    viewport(1280);
    await TestBed.configureTestingModule({
      imports: [ShellComponent], providers: [provideRouter([])],
    }).compileComponents();
    TestBed.inject(AuthService).login('admin@sigev.edu.pe', 'sigev2026');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    viewport(originalWidth);
    document.body.style.overflow = originalOverflow;
  });

  async function render() {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return { fixture, element, toggle: element.querySelector<HTMLButtonElement>('.menu-button')! };
  }

  it('compresses and expands the desktop menu without removing accessible links', async () => {
    const { fixture, element, toggle } = await render();
    toggle.click();
    await fixture.whenStable();
    expect(element.querySelector('.sidebar-collapsed')).not.toBeNull();
    expect(element.querySelector('.sidebar .menu-button')).toBe(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toBe('Expandir menú');
    expect(element.querySelector('nav a[aria-label="Estudiantes"]')?.getAttribute('title')).toBe('Estudiantes');
    expect(document.body.style.overflow).toBe(originalOverflow);
    toggle.click();
    await fixture.whenStable();
    expect(element.querySelector('.sidebar-collapsed')).toBeNull();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('opens a mobile drawer, contains keyboard focus, and closes with Escape', async () => {
    viewport(390);
    const { fixture, element, toggle } = await render();
    expect(element.querySelector('.sidebar.mobile.compact')).not.toBeNull();
    expect(element.querySelector('nav')?.hasAttribute('hidden')).toBe(true);
    expect(element.querySelector('app-navbar .menu-button')).toBeNull();
    toggle.click();
    await fixture.whenStable();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(element.querySelector('[role="dialog"][aria-modal="true"]')).not.toBeNull();
    expect(element.querySelector('.main-area')?.hasAttribute('inert')).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    const last = element.querySelector<HTMLButtonElement>('.logout-button')!;
    last.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(element.querySelector('.brand'));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(element.querySelector('.sidebar-open')).toBeNull();
    expect(document.activeElement).toBe(toggle);
    expect(document.body.style.overflow).toBe(originalOverflow);
  });

  it('closes on backdrop click and restores desktop preference after resizing', async () => {
    const { fixture, element, toggle } = await render();
    toggle.click();
    viewport(390);
    await fixture.whenStable();
    toggle.click();
    await fixture.whenStable();
    element.querySelector<HTMLElement>('.scrim')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.sidebar-open')).toBeNull();
    toggle.click();
    viewport(1280);
    await fixture.whenStable();
    expect(element.querySelector('.sidebar-collapsed')).not.toBeNull();
    expect(element.querySelector('.sidebar-open')).toBeNull();
    expect(document.body.style.overflow).toBe(originalOverflow);
  });

  it('closes the mobile drawer when following a navigation link', async () => {
    viewport(390);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const { fixture, element, toggle } = await render();
    toggle.click();
    await fixture.whenStable();
    element.querySelector<HTMLAnchorElement>('nav a')!.click();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalled();
    expect(element.querySelector('.sidebar-open')).toBeNull();
    expect(document.body.style.overflow).toBe(originalOverflow);
  });

  it('preserves role visibility and clears the session on logout', async () => {
    const auth = TestBed.inject(AuthService);
    auth.login('estudiante@sigev.edu.pe', 'sigev2026');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const { fixture, element } = await render();
    expect(element.querySelector('nav a[aria-label="Configuración"]')).toBeNull();
    expect(element.querySelector('nav a[aria-label="Docentes"]')).toBeNull();
    expect(element.querySelector('nav a[aria-label="Asistencias"]')).not.toBeNull();
    element.querySelector<HTMLButtonElement>('.logout-button')!.click();
    await fixture.whenStable();
    expect(auth.currentUser()).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
