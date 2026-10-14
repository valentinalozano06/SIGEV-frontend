import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { StudentsService } from '../../core/services/students.service';
import { StudentOverviewService } from '../../core/services/student-overview.service';

describe('Shared institutional indicators', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({imports:[DashboardComponent],providers:[provideRouter([])]}).compileComponents();
    TestBed.inject(AuthService).login('admin@sigev.edu.pe','sigev2026');
  });
  it('updates totals, distribution and directory after create, edit and delete', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    await fixture.whenStable();
    const service = TestBed.inject(StudentsService), overview = TestBed.inject(StudentOverviewService);
    const before = overview.summary();
    const seed = service.students()[0];
    const added = service.save({...seed,firstName:'Prueba',dni:'12345678',grade:'2.º Secundaria'});
    await fixture.whenStable();
    expect(overview.summary().total).toBe(before.total+1);
    expect(overview.summary().secondary).toBe(before.secondary+1);
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('Prueba');
    expect(fixture.nativeElement.querySelector('.donut strong').textContent.trim()).toBe(String(before.total+1));
    service.save({...added,grade:'5.º Primaria',status:'Inactivo'},added.id);
    expect(overview.summary().primary).toBe(before.primary+1);
    expect(overview.summary().active).toBe(before.active);
    service.remove(added.id);
    await fixture.whenStable();
    expect(overview.summary()).toEqual(before);
    expect(fixture.nativeElement.querySelector('tbody').textContent).not.toContain('Prueba');
  });
  it('handles an empty directory without invalid percentages or chart values', async () => {
    const service = TestBed.inject(StudentsService);
    for (const student of service.students()) service.remove(student.id);
    const fixture = TestBed.createComponent(DashboardComponent);
    await fixture.whenStable();
    const summary = TestBed.inject(StudentOverviewService).summary();
    expect(summary.total).toBe(0);
    expect(summary.activePercent).toBe(0);
    expect(summary.primaryPercent).toBe(0);
    expect(fixture.nativeElement.textContent).not.toMatch(/NaN|Infinity/);
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('No hay estudiantes');
  });
  it('uses a zero-to-one-hundred attendance axis and no decorative export buttons', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(Array.from(element.querySelectorAll('.axis span')).map(node=>node.textContent)).toEqual(['100%','75%','50%','25%','0%']);
    expect(element.querySelector<HTMLElement>('.bar')?.style.height).toBe('86%');
    expect(element.textContent).not.toContain('Exportar');
    expect(element.querySelector('a[routerlink="/estudiantes"]')).not.toBeNull();
  });
});
