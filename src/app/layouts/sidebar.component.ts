import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideChevronLeft, LucideChevronRight, LucideLayoutDashboard, LucideUsers, LucideClipboardList, LucideCalendarCheck, LucideClipboardCheck, LucideBookOpen, LucideGraduationCap, LucideFileBarChart, LucideSettings, LucideLogOut } from '@lucide/angular';
export interface NavigationItem { label: string; route: string; }
@Component({
  selector: 'app-sidebar', standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideChevronLeft, LucideChevronRight, LucideLayoutDashboard, LucideUsers, LucideClipboardList, LucideCalendarCheck, LucideClipboardCheck, LucideBookOpen, LucideGraduationCap, LucideFileBarChart, LucideSettings, LucideLogOut],
  templateUrl: './sidebar.component.html', styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() mobile = false;
  @Input() open = false;
  @Input() collapsed = false;
  @Input() primary: NavigationItem[] = [];
  @Input() academic: NavigationItem[] = [];
  @Input() configuration = false;
  @Output() toggled = new EventEmitter<void>();
  @Output() navigated = new EventEmitter<void>();
  @Output() signedOut = new EventEmitter<void>();
  @ViewChild('panel') private panel?: ElementRef<HTMLElement>;
  @ViewChild('toggle') private toggle?: ElementRef<HTMLButtonElement>;
  protected hint = '';
  protected hintTop = 0;
  protected showHint(event: Event, label: string): void {
    if (!this.compact || this.mobile) return;
    this.hintTop = (event.currentTarget as HTMLElement).getBoundingClientRect().top + 5;
    this.hint = label;
  }
  get compact(): boolean { return this.mobile ? !this.open : this.collapsed; }
  get toggleLabel(): string { return this.mobile ? (this.open ? 'Cerrar menú' : 'Abrir menú') : (this.collapsed ? 'Expandir menú' : 'Comprimir menú'); }
  focusToggle(): void { this.toggle?.nativeElement.focus(); }
  trapFocus(event: KeyboardEvent): void {
    const elements = this.panel?.nativeElement.querySelectorAll<HTMLElement>('a[href],button');
    if (!elements?.length) return;
    const first = elements[0], last = elements[elements.length - 1];
    const current = this.panel!.nativeElement.ownerDocument.activeElement;
    if (event.shiftKey && (current === first || !this.panel?.nativeElement.contains(current))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (current === last || !this.panel?.nativeElement.contains(current))) { event.preventDefault(); first.focus(); }
  }
}
