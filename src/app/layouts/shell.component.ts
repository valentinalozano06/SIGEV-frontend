import { DOCUMENT } from '@angular/common';
import { Component, HostListener, OnDestroy, ViewChild, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';
@Component({ selector:'app-shell', standalone:true, imports:[RouterOutlet,SidebarComponent,NavbarComponent], templateUrl:'./shell.view.html', styleUrl:'./shell.component.scss' })
export class ShellComponent implements OnDestroy {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  @ViewChild(SidebarComponent) private sidebar?: SidebarComponent;
  protected mobile = (this.document.defaultView?.innerWidth ?? 1024) <= 800;
  protected sidebarOpen = false;
  protected sidebarCollapsed = false;
  private savedOverflow: string | null = null;
  private focusTimer?: ReturnType<typeof setTimeout>;
  protected readonly primaryNav = computed(() => [{label:'Dashboard',route:'/dashboard'},{label:'Control de ingreso',route:'/control-ingreso'},{label:'Estudiantes',route:'/estudiantes'},{label:'Matrículas',route:'/matriculas'},{label:'Asistencias',route:'/asistencias'}].filter(item => this.auth.canAccess(item.route)));
  protected readonly academicNav = computed(() => [{label:'Gestión académica',route:'/academico'},{label:'Docentes',route:'/docentes'},{label:'Reportes',route:'/reportes'}].filter(item => this.auth.canAccess(item.route)));
  protected get title(): string { const route = this.router.url.split('?')[0]; return [...this.primaryNav(),...this.academicNav(),{route:'/configuracion',label:'Configuración'},{route:'/control-ingreso',label:'Control de ingreso'}].find(item => item.route === route)?.label ?? 'Dashboard'; }
  toggleSidebar(): void {
    if (!this.mobile) { this.sidebarCollapsed = !this.sidebarCollapsed; return; }
    if (this.sidebarOpen) { this.closeSidebar(); return; }
    this.sidebarOpen = true;
    this.savedOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    this.focusTimer = setTimeout(() => this.sidebar?.focusToggle());
  }
  closeSidebar(): void {
    if (!this.sidebarOpen) return;
    this.sidebarOpen = false; clearTimeout(this.focusTimer); this.restoreScroll();
    this.focusTimer = setTimeout(() => this.sidebar?.focusToggle());
  }
  @HostListener('window:resize') onResize(): void {
    const mobile = (this.document.defaultView?.innerWidth ?? 1024) <= 800;
    if (mobile !== this.mobile) this.closeSidebar(); this.mobile = mobile;
  }
  @HostListener('document:keydown',['$event']) onKeydown(event: KeyboardEvent): void {
    if (!this.mobile || !this.sidebarOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); this.closeSidebar(); }
    else if (event.key === 'Tab') this.sidebar?.trapFocus(event);
  }
  private restoreScroll(): void { if (this.savedOverflow !== null) { this.document.body.style.overflow = this.savedOverflow; this.savedOverflow = null; } }
  ngOnDestroy(): void { clearTimeout(this.focusTimer); this.restoreScroll(); }
  logout(): void { this.closeSidebar(); this.auth.logout(); void this.router.navigate(['/login']); }
}
