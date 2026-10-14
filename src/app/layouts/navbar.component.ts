import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { LucideBell, LucideChevronRight, LucideMenu, LucideTrash2 } from '@lucide/angular';
import { UserSession } from '../core/models/app.models';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-navbar', standalone: true, imports: [LucideBell, LucideChevronRight, LucideMenu, LucideTrash2],
  template: `<header class="navbar"><button class="mobile-menu" type="button" (click)="menuClicked.emit()" aria-label="Abrir menú"><svg lucideMenu [size]="21" /></button><div class="breadcrumb"><span>Portal institucional</span><svg lucideChevronRight [size]="13" /><strong>{{ title }}</strong></div><div class="account"><details class="notifications"><summary aria-label="Notificaciones"><svg lucideBell [size]="19" />@if (unread()) { <i>{{ unread() }}</i> }</summary><div class="notification-panel"><div class="notification-head"><b>Notificaciones</b><button type="button" (click)="markAllRead()">Leer todo</button></div>@for (notice of notices(); track notice.id) { <article [class.unread]="!notice.read"><span><strong>{{ notice.title }}</strong><small>{{ notice.message }}</small></span><button type="button" (click)="removeNotice(notice.id)" aria-label="Eliminar aviso"><svg lucideTrash2 [size]="14" /></button></article> } @if (!notices().length) { <p>No tienes notificaciones nuevas.</p> }</div></details><span class="avatar" [title]="user?.name ?? ''">{{ user?.initials }}</span><div class="user-copy"><b>{{ user?.name }}</b><small>{{ user?.role }}</small></div></div></header>`,
  styles: [`
    :host { display:block; position:sticky; top:0; z-index:20; }
    .navbar { height:64px; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:0 32px; border-bottom:1px solid var(--line); background:#ffffffed; backdrop-filter:blur(12px); }
    .mobile-menu { display:none; align-items:center; justify-content:center; width:38px; height:38px; padding:0; border:1px solid var(--line); border-radius:10px; background:#fff; color:var(--ink); cursor:pointer; }
    .breadcrumb,.account { display:flex; align-items:center; gap:12px; min-width:0; }
    .breadcrumb { font-size:12px; color:var(--muted); }
    .breadcrumb strong { color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .account { flex-shrink:0; }
    .avatar { display:grid; place-items:center; width:34px; height:34px; border-radius:50%; background:#f4ead0; color:#715824; font-size:11px; font-weight:700; }
    .user-copy b,.user-copy small { display:block; }
    .user-copy b { font-size:12px; }
    .user-copy small { font-size:10px; color:var(--muted); margin-top:3px; }
    .notifications { position:relative; }
    .notifications summary { position:relative; display:grid; place-items:center; list-style:none; width:36px; height:36px; border-radius:9px; color:#607587; cursor:pointer; }
    .notifications summary::-webkit-details-marker { display:none; }
    .notifications[open] summary,.notifications summary:hover { background:#edf3f5; }
    .notifications summary i { position:absolute; top:1px; right:0; display:grid; place-items:center; min-width:15px; height:15px; padding:0 3px; border-radius:10px; background:#caa651; color:#fff; font-size:9px; font-style:normal; }
    .notification-panel { position:absolute; top:calc(100% + 14px); right:0; width:340px; max-width:calc(100vw - 32px); max-height:calc(100dvh - 96px); overflow:auto; padding:0; background:#fff; border:1px solid #dce7ea; border-radius:14px; box-shadow:0 16px 36px #17384b1f; font-size:12px; }
    .notification-head { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:16px 18px; border-bottom:1px solid #edf1f2; color:var(--ink); }
    .notification-head b { font-size:13px; }
    .notification-head button { border:0; padding:4px 0; background:none; color:var(--teal); font-size:10px; font-weight:700; cursor:pointer; }
    .notification-panel article { display:flex; align-items:flex-start; gap:12px; margin:12px; padding:16px; border:1px solid #e0e9ec; border-radius:11px; background:#fff; transition:background .16s ease,border-color .16s ease; }
    .notification-panel article.unread { border-color:#c9e0e3; background:#f4fafb; }
    .notification-panel article:hover { border-color:#9fcbd0; }
    .notification-panel article > span { flex:1; min-width:0; overflow-wrap:anywhere; }
    .notification-panel article strong,.notification-panel article small { display:block; }
    .notification-panel article strong { color:#24485d; font-size:12px; line-height:1.5; }
    .notification-panel article small { margin-top:6px; color:var(--muted); font-size:11px; line-height:1.6; }
    .notification-panel article button { display:grid; place-items:center; flex:0 0 28px; width:28px; height:28px; padding:0; border:0; border-radius:7px; background:none; color:#8ba0aa; cursor:pointer; }
    .notification-panel article button:hover { background:#eaf2f3; color:#a34d55; }
    .notification-panel > p { margin:0; padding:20px 18px; color:var(--muted); }
    summary:focus-visible,.mobile-menu:focus-visible,.notification-panel button:focus-visible { outline:2px solid var(--teal); outline-offset:2px; }
    @media(max-width:800px) {
      .navbar { padding:0 16px; }
      .mobile-menu { display:inline-flex; }
      .user-copy,.breadcrumb>span,.breadcrumb>svg { display:none; }
      .account { gap:6px; }
      .notification-panel { right:-40px; width:min(320px,calc(100vw - 32px)); }
    }
    @media(prefers-reduced-motion:reduce) { .notification-panel article { transition:none; } }
  `],
})
export class NavbarComponent { private readonly notificationService = inject(NotificationService); @Input() title = ''; @Input() user: UserSession | null = null; @Output() menuClicked = new EventEmitter<void>(); readonly notices = this.notificationService.notifications; readonly unread = computed(() => this.notices().filter(item => !item.read).length); markAllRead() { this.notificationService.markAllRead(); } removeNotice(id: string) { this.notificationService.remove(id); } }
