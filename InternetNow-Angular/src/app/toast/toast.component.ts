import { Component } from '@angular/core';
import { ToastService } from '../services/toastService';

@Component({
    selector: 'app-toasts',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css']
  })
  export class AppToastsComponent {
    constructor(public toastService: ToastService) {

    }
  }