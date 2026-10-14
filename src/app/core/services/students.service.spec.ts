import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { StudentsService } from './students.service';
import { StudentInput, filterStudents } from '../models/student.models';

describe('Student records', () => {
  let service: StudentsService;
  const input: StudentInput = { firstName: ' Ana ', lastName: 'Prueba', dni: '12345678', birthDate: '2015-03-02', grade: '5.º Primaria', section: 'A', status: 'Activo', guardianName: 'Rosa Prueba', guardianRelationship: 'Madre', guardianPhone: '912345678', guardianEmail: '' };
  beforeEach(() => {
    TestBed.configureTestingModule({});
    TestBed.inject(AuthService).login('admin@sigev.edu.pe', 'sigev2026');
    service = TestBed.inject(StudentsService);
  });
  it('creates, updates and deletes without modifying existing history', () => {
    const count = service.students().length;
    const student = service.save(input);
    expect(student.firstName).toBe('Ana');
    expect(student.history).toEqual([]);
    expect(service.students().length).toBe(count + 1);
    service.save({ ...input, firstName: 'Anita' }, student.id);
    expect(service.students().find(s => s.id === student.id)?.firstName).toBe('Anita');
    const seeded = service.students().find(s => s.history.length)!;
    service.save({ ...seeded, section: 'C' }, seeded.id);
    expect(service.students().find(s => s.id === seeded.id)?.history).toEqual(seeded.history);
    service.remove(student.id);
    expect(service.students().length).toBe(count);
    expect(() => service.remove(student.id)).toThrow('ya no está disponible');
  });
  it('rejects duplicate DNI on creation and editing', () => {
    const first = service.students()[0];
    expect(() => service.save({ ...input, dni: first.dni })).toThrow('Ya existe');
    expect(() => service.save({ ...service.students()[1], dni: first.dni }, service.students()[1].id)).toThrow('Ya existe');
    expect(() => service.save(first, first.id)).not.toThrow();
  });
  it('rejects malformed data without changing the list', () => {
    const before = service.students();
    for (const patch of [{ dni: '123' }, { firstName: '   ' }, { birthDate: '2099-01-01' }, { guardianPhone: 'abc' }, { grade: 'Otro' }, { guardianEmail: 'correo-invalido' }]) {
      expect(() => service.save({ ...input, ...patch })).toThrow();
    }
    expect(service.students()).toBe(before);
  });
  it('allows teacher consultation but rejects mutations', () => {
    TestBed.inject(AuthService).login('docente@sigev.edu.pe', 'sigev2026');
    expect(service.students().length).toBeGreaterThan(0);
    expect(() => service.save(input)).toThrow('solo puede consultar');
    expect(() => service.remove(service.students()[0].id)).toThrow('solo puede consultar');
  });
  it('combines filters and finds accented names without accents', () => {
    const query = { search: 'FERNANDEZ lucia', grade: '5.º Primaria', section: 'A', status: 'Activo' };
    expect(filterStudents(service.students(), query).map(s => s.firstName)).toEqual(['Lucía']);
    expect(filterStudents(service.students(), { ...query, section: 'B' })).toEqual([]);
    expect(filterStudents(service.students(), { search: '80000001', grade: '', section: '', status: '' })).toHaveLength(1);
  });
});
