import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-modal', standalone: true, imports: [LucideX],
  template: `<dialog #dialog [attr.aria-label]="title" (cancel)="cancel($event)" (click)="backdrop($event)">
    <div class="modal-content"><header><h2>{{ title }}</h2><button type="button" aria-label="Cerrar ventana" (click)="closed.emit()"><svg lucideX [size]="20"></svg></button></header><ng-content /></div>
  </dialog>`,
  styles: [`dialog{width:min(680px,calc(100% - 28px));max-height:calc(100dvh - 40px);padding:0;border:1px solid #dbe5ed;border-radius:18px;color:#19334d;background:#fff;box-shadow:0 24px 80px #10223840}dialog::backdrop{background:#10223885}.modal-content{padding:24px}header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}h2{font-size:21px;letter-spacing:-.03em;margin:0}button{display:grid;place-items:center;flex-shrink:0;width:36px;height:36px;border:0;border-radius:8px;background:#eef3f7;color:#456079;cursor:pointer}button:focus-visible{outline:2px solid #246e82;outline-offset:2px}@media(max-width:500px){.modal-content{padding:18px}}`],
})
export class ModalComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() open = false;
  @Input() title = '';
  @Output() closed = new EventEmitter<void>();
  @ViewChild('dialog') private dialog?: ElementRef<HTMLDialogElement>;
  private previousOverflow: string | null = null;
  ngAfterViewInit(): void { this.sync(); }
  ngOnChanges(): void { this.sync(); }
  private sync(): void {
    const dialog = this.dialog?.nativeElement;
    if (!dialog) return;
    if (this.open && !dialog.open) {
      dialog.showModal();
      this.previousOverflow = dialog.ownerDocument.body.style.overflow;
      dialog.ownerDocument.body.style.overflow = 'hidden';
    } else if (!this.open && dialog.open) { dialog.close(); this.restoreScroll(); }
  }
  cancel(event: Event): void { event.preventDefault(); this.closed.emit(); }
  backdrop(event: MouseEvent): void {
    if (event.target !== this.dialog?.nativeElement) return;
    const bounds = this.dialog.nativeElement.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) this.closed.emit();
  }
  private restoreScroll(): void {
    if (this.previousOverflow !== null && this.dialog) this.dialog.nativeElement.ownerDocument.body.style.overflow = this.previousOverflow;
    this.previousOverflow = null;
  }
  ngOnDestroy(): void { this.restoreScroll(); }
}
