import { TestBed } from '@angular/core/testing';
import { StudentsComponent } from './students.component';
import { AuthService } from '../../core/services/auth.service';
import { StudentsService } from '../../core/services/students.service';

describe('Student directory interactions', () => {
  const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
  const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');
  beforeEach(async () => {
    // jsdom has no native modal dialog implementation.
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function(this: HTMLDialogElement) { this.setAttribute('open', ''); } });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: function(this: HTMLDialogElement) { this.removeAttribute('open'); } });
    await TestBed.configureTestingModule({ imports: [StudentsComponent] }).compileComponents();
    TestBed.inject(AuthService).login('admin@sigev.edu.pe', 'sigev2026');
  });
  afterEach(() => {
    TestBed.resetTestingModule(); vi.restoreAllMocks();
    for (const [name, descriptor] of [['showModal', originalShowModal], ['close', originalClose]] as const) {
      if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
      else Reflect.deleteProperty(HTMLDialogElement.prototype, name);
    }
  });
  async function render() {
    const fixture = TestBed.createComponent(StudentsComponent);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }
  function click(element: HTMLElement, selector: string): void { element.querySelector<HTMLButtonElement>(selector)!.click(); }
  it('paginates, resets the page on search, and shows an empty state', async () => {
    const { fixture, element } = await render();
    expect(element.querySelectorAll('tbody tr')).toHaveLength(10);
    click(element, '[aria-label="Página siguiente"]');
    await fixture.whenStable();
    expect(element.querySelector('.pagination')?.textContent).toContain('11–20');
    const search = element.querySelector<HTMLInputElement>('input[type="search"]')!;
    search.value = 'lucia'; search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(element.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(element.querySelector('.pagination')?.textContent).toContain('1–1');
    search.value = 'nadie coincide'; search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(element.querySelector('.empty')?.textContent).toContain('No se encontraron');
  });
  it('validates a new record, saves it, and returns to the first page', async () => {
    const { fixture, element } = await render();
    click(element, '.compact-action');
    await fixture.whenStable();
    const form = element.querySelector('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Revisa');
    const values = { firstName: 'María', lastName: 'Prueba', dni: '12345678', birthDate: '2014-03-02', grade: '5.º Primaria', section: 'A', guardianName: 'Rosa Prueba', guardianPhone: '912345678' };
    for (const [key, value] of Object.entries(values)) {
      const input = element.querySelector<HTMLInputElement | HTMLSelectElement>(`[formControlName="${key}"]`)!;
      input.value = value; input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input'));
    }
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(TestBed.inject(StudentsService).students()[0].dni).toBe('12345678');
    expect(element.querySelector('dialog')?.hasAttribute('open')).toBe(false);
    expect(element.querySelector('[role="status"]')?.textContent).toContain('esta sesión');
  });
  it('does not save cancelled edits or delete before confirmation', async () => {
    const { fixture, element } = await render();
    const service = TestBed.inject(StudentsService);
    const first = service.students()[0];
    click(element, 'button[title="Editar"]');
    await fixture.whenStable();
    const input = element.querySelector<HTMLInputElement>('[formControlName="firstName"]')!;
    input.value = 'Otro'; input.dispatchEvent(new Event('input'));
    click(element, '.modal-actions .secondary');
    await fixture.whenStable();
    expect(service.students()[0]).toEqual(first);
    click(element, 'button[title="Eliminar"]');
    await fixture.whenStable();
    expect(service.students()).toHaveLength(24);
    click(element, '.modal-actions .secondary');
    await fixture.whenStable();
    expect(service.students()).toHaveLength(24);
    click(element, 'button[title="Eliminar"]');
    await fixture.whenStable();
    click(element, '.modal-actions .danger');
    await fixture.whenStable();
    expect(service.students()).toHaveLength(23);
    expect(service.students().some(s => s.id === first.id)).toBe(false);
  });
  it('shows profiles to teachers without edit or delete actions', async () => {
    TestBed.inject(AuthService).login('docente@sigev.edu.pe', 'sigev2026');
    const { fixture, element } = await render();
    expect(element.querySelector('.page-heading .primary')).toBeNull();
    expect(element.querySelector('button[title="Editar"]')).toBeNull();
    expect(element.querySelector('button[title="Eliminar"]')).toBeNull();
    click(element, 'button[title="Ver perfil"]');
    await fixture.whenStable();
    expect(element.querySelector('.profile-heading')?.textContent).toContain('Lucía');
    expect(element.querySelector('.history')?.textContent).toContain('2025');
    expect(element.querySelector('.modal-actions .primary')).toBeNull();
  });
});
