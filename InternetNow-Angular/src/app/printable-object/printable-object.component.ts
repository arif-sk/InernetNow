import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { PrintObjectViewModel } from '../Model/common.viewmodel';
import { PrintObjectService } from '../services/print-object.service';

@Component({
  selector: 'app-printable-object',
  templateUrl: './printable-object.component.html',
  styleUrls: ['./printable-object.component.css'],
})
export class PrintableObjectComponent implements OnInit {
  printObjectForm= new FormGroup({
    'fileSize': new FormControl(''),
    'isNeumericCount': new FormControl(true),
    'isAlphaneumericCount': new FormControl(true),
    'isFloatCount': new FormControl(true),
    'neumericCount': new FormControl(),
    'alphaNeumericCount': new FormControl(),
    'floatCount': new FormControl()
  });

  constructor(private printObjectService: PrintObjectService,
    private router: Router) {
  }

  ngOnInit(): void {}

  get fileSizeFormControl() {
    return this.printObjectForm.get('fileSize');
  }

  get isNeumericCountFormControl() {
    return this.printObjectForm.get('isNeumericCount');
  }

  get isAlphaneumericCountFormControl() {
    return this.printObjectForm.get('isAlphaneumericCount');
  }

  get isFloatCountFormControl() {
    return this.printObjectForm.get('isFloatCount');
  }

  get neumericCountFormControl() {
    return this.printObjectForm.get('neumericCount');
  }

  get alphaneumericCountFormControl() {
    return this.printObjectForm.get('alphaNeumericCount');
  }

  get floatCountFormControl() {
    return this.printObjectForm.get('floatCount');
  }

  startCounting() {
    let fileSize = this.fileSizeFormControl?.value == "" ? 0: this.fileSizeFormControl?.value;
    let isNeumeric = this.isNeumericCountFormControl?.value;
    let isAlphaneumeric =  this.isAlphaneumericCountFormControl?.value;
    let isFloat =  this.isFloatCountFormControl?.value;
    if(!(isNeumeric || isAlphaneumeric || isFloat)) {
      alert("Please select an option.");
      return;
    }
    let printObject = new PrintObjectViewModel({
      fileSize: fileSize,
      isNeumericCount: isNeumeric,
      isAlphaneumericCount: isAlphaneumeric,
      isFloatCount: isFloat
    });
    this.printObjectService.startCountPrintObject(printObject).subscribe(resp => {
    }, err => {
      throwError(err);
    })
  }

  stopCounting() {
    this.printObjectService.stopCountPrintObject().subscribe(resp => {
    }, err => {
      throwError(err);
    });
  }

  generateReport() {
    this.router.navigate(['/report']);
  }
}
