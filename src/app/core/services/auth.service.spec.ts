import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { sessionGuard, roleGuard } from './auth.guard';

describe('Account access', () => {
  let auth: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    auth = TestBed.inject(AuthService);
  });

  it.each([
    ['admin', 'Administrador'], ['director', 'Director'], ['docente', 'Docente'],
    ['estudiante', 'Estudiante'], ['apoderado', 'Apoderado'],
  ])('loads the role belonging to %s', (account, role) => {
    expect(auth.login(account + '@sigev.edu.pe', 'sigev2026')).toBe(true);
    expect(auth.currentUser()?.role).toBe(role);
    expect(auth.currentUser()).not.toHaveProperty('password');
  });
  it('loads the auxiliary portal account', () => {
    expect(auth.login('auxiliar@sigev.edu.pe', 'auxiliar2026')).toBe(true);
    expect(auth.currentUser()?.role).toBe('Auxiliar');
  });

  it('starts without an authenticated user', () => {
    expect(auth.currentUser()).toBeNull();
    expect(auth.canAccess('/dashboard')).toBe(false);
  });
  it('normalizes email casing and whitespace', () => {
    expect(auth.login('  DOCENTE@SIGEV.EDU.PE  ', 'sigev2026')).toBe(true);
    expect(auth.currentUser()?.role).toBe('Docente');
  });
  it.each([
    ['admin@otra-institucion.test', 'sigev2026'],
    ['nuevo-admin@sigev.edu.pe', 'sigev2026'],
    ['admin@sigev.edu.pe', 'incorrecta'],
    ['admin@sigev.edu.pe', 'SIGEV2026'],
    ['admin@sigev.edu.pe', ' sigev2026 '],
  ])('rejects unregistered or incorrect credentials: %s', (email, password) => {
    expect(auth.login(email, password)).toBe(false);
    expect(auth.currentUser()).toBeNull();
  });
  it('limits navigation to the registered role and clears access on logout', () => {
    auth.login('docente@sigev.edu.pe', 'sigev2026');
    expect(auth.canAccess('/asistencias')).toBe(true);
    expect(auth.canAccess('/configuracion')).toBe(false);
    expect(auth.canAccess('/matriculas')).toBe(false);
    auth.logout();
    expect(auth.currentUser()).toBeNull();
    expect(auth.canAccess('/asistencias')).toBe(false);
  });
  it('does not retain an older session after failed credentials', () => {
    auth.login('admin@sigev.edu.pe', 'sigev2026');
    auth.login('desconocido@sigev.edu.pe', 'incorrecta');
    expect(auth.currentUser()).toBeNull();
  });
  it('redirects anonymous visitors to login and blocks unauthorized direct routes', () => {
    const router = TestBed.inject(Router);
    const route = { routeConfig: { path: 'configuracion' } } as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    expect(TestBed.runInInjectionContext(() => sessionGuard(route, state))).toEqual(router.createUrlTree(['/login']));
    expect(TestBed.runInInjectionContext(() => roleGuard(route, state))).toEqual(router.createUrlTree(['/login']));
    auth.login('estudiante@sigev.edu.pe', 'sigev2026');
    expect(TestBed.runInInjectionContext(() => roleGuard(route, state))).toEqual(router.createUrlTree(['/dashboard']));
    auth.login('admin@sigev.edu.pe', 'sigev2026');
    expect(TestBed.runInInjectionContext(() => roleGuard(route, state))).toBe(true);
  });
});
