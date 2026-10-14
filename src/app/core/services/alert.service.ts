import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly base = {
    confirmButtonColor: '#22677a',
    cancelButtonColor: '#8b9aa5',
    buttonsStyling: true,
    customClass: { popup: 'sigev-alert', confirmButton: 'sigev-alert-confirm', cancelButton: 'sigev-alert-cancel' },
  };

  success(title: string, text: string): Promise<void> { return this.fire('success', title, text); }
  error(title: string, text: string): Promise<void> { return this.fire('error', title, text); }
  info(title: string, text: string): Promise<void> { return this.fire('info', title, text); }
  confirm(title: string, text: string, confirmButtonText = 'Confirmar'): Promise<boolean> {
    return Swal.fire({ ...this.base, icon: 'question', title, text, showCancelButton: true, confirmButtonText, cancelButtonText: 'Cancelar', reverseButtons: true }).then(result => result.isConfirmed);
  }
  private fire(icon: SweetAlertIcon, title: string, text: string): Promise<void> {
    return Swal.fire({ ...this.base, icon, title, text, timer: 2400, showConfirmButton: false, toast: true, position: 'top-end' }).then(() => undefined);
  }
}
