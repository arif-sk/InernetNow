import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrintObjectViewModel } from '../Model/common.viewmodel';

@Injectable({
  providedIn: 'root',
})
export class PrintObjectService {
  private apiUrl = 'http://localhost:5000/api/pringobject/';

  constructor(private http: HttpClient) {}

  startCountPrintObject(printObject: PrintObjectViewModel) {
    return this.http.post(this.apiUrl + 'count', printObject);
  }

  stopCountPrintObject() {
    return this.http.post(this.apiUrl + 'stopcount', null);
  }
  generateReport() {
    return this.http.get(this.apiUrl + 'generatereport');
  }
}
