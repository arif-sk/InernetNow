import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  showSuccess(header: string, body: string, autohide: boolean = true) {
    this.toasts.push({ header, body, classname: 'bg-success text-light', delay: 10000, autohide: autohide });
  }

  showWarning(header: string, body: string, autohide: boolean = true) {
    this.toasts.push({ header, body, classname: 'bg-warning text-dark', delay: 10000, autohide: autohide });
  }

  showInfo(header: string, body: string, autohide: boolean = true) {
    this.toasts.push({ header, body, classname: 'bg-info text-light', delay: 10000, autohide: autohide });
  }

  showError(header: string, body: string, autohide: boolean = true) {
    this.toasts.push({ header, body, classname: 'bg-danger text-light', delay: 15000 , autohide: autohide });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
  clear() {
    this.toasts.length = 0;
  }
}