import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError, interval, Subscription } from 'rxjs';
import { ObjectCountViewModel, PrintObjectViewModel } from '../Model/common.viewmodel';
import { PrintObjectService } from '../services/print-object.service';
import * as signalR from '@microsoft/signalr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-printable-object',
  templateUrl: './printable-object.component.html',
  styleUrls: ['./printable-object.component.css'],
})
export class PrintableObjectComponent implements OnInit {
  subscription!: Subscription;
  objectCountModel: ObjectCountViewModel = new ObjectCountViewModel();
  @ViewChild('configDistributionModal', { static: true })
  configDistributionModal!: TemplateRef<any>;
  configureDistributionModalRef!: NgbModalRef;
  printObjectForm= new FormGroup({
    'fileSize': new FormControl(null, [Validators.required]),
    'isNeumericCount': new FormControl(true),
    'isAlphaneumericCount': new FormControl(true),
    'isFloatCount': new FormControl(true),
    'neumericCount': new FormControl(),
    'alphaNeumericCount': new FormControl(),
    'floatCount': new FormControl()
  });

  configureDistributionForm = new FormGroup({
    'numericPercentage': new FormControl(),
    'alphanumericPercentage': new FormControl(),
    'floatPercentage': new FormControl()
  });

  constructor(private printObjectService: PrintObjectService,
    private router: Router,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    
    const source = interval(1000);
    this.subscription = source.subscribe(val => this.getObjectCount());
    // this.getObjectCount();
    const connection = new signalR.HubConnectionBuilder()
			.configureLogging(signalR.LogLevel.Information)
			.withUrl("https://localhost:5000/hubs/notify")
			.build();

		connection.start().then(function () {
		}).catch(function (err) {
			throwError(err);
		});

		connection.on("BroadcastMessage", () => {
			this.getObjectCount();
		});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getObjectCount() {
    this.printObjectService.getObjectCount().subscribe(resp => {
      this.objectCountModel = resp as ObjectCountViewModel;
      this.setCounterValue();
    }, err => {
      throwError(err);
    })
  }

  setCounterValue() {
    this.neumericCountFormControl?.setValue(this.objectCountModel.numberCount);
    this.floatCountFormControl?.setValue(this.objectCountModel.floatCount);
    this.alphaneumericCountFormControl?.setValue(this.objectCountModel.characterCount);
  }

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
    if(this.printObjectForm.invalid) {
      this.printObjectForm.markAllAsTouched();
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
      this.objectCountModel = resp as ObjectCountViewModel;
      this.setCounterValue();
    }, err => {
      throwError(err);
    });
  }

  generateReport() {
    this.router.navigate(['/report']);
  }

  configureDistribution() {
    this.configureDistributionModalRef = this.modalService.open(this.configDistributionModal, { size: 'md', backdrop: 'static', centered: true, keyboard: false });
  }

  applyConfigureDistribution() {
    
  }
}
