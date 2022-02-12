import {
  Component,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError, interval, Subscription } from 'rxjs';
import {
  ObjectCountViewModel,
  PrintObjectViewModel,
} from '../Model/common.viewmodel';
import { PrintObjectService } from '../services/print-object.service';
import * as signalR from '@microsoft/signalr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../services/toastService';
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
  totalPercentage: number = 0;
  printObjectForm = new FormGroup({
    fileSize: new FormControl(null, [Validators.required]),
    isNeumericCount: new FormControl(true),
    isAlphaneumericCount: new FormControl(true),
    isFloatCount: new FormControl(true),
    neumericCount: new FormControl(),
    alphaNeumericCount: new FormControl(),
    floatCount: new FormControl(),
    applyConfiguration: new FormControl(false),
  });

  configureDistributionForm = new FormGroup({
    numericPercentage: new FormControl(),
    alphanumericPercentage: new FormControl(),
    floatPercentage: new FormControl(),
  });
  processStarted = false;
  constructor(
    private printObjectService: PrintObjectService,
    private router: Router,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.onChanges();
    const source = interval(1000);
    this.subscription = source.subscribe((val) => this.getObjectCount());
    // this.getObjectCount();
    // const connection = new signalR.HubConnectionBuilder()
    // 	.configureLogging(signalR.LogLevel.Information)
    // 	.withUrl("https://localhost:5000/hubs/notify")
    // 	.build();

    // connection.start().then(function () {
    // }).catch(function (err) {
    // 	throwError(err);
    // });

    // connection.on("BroadcastMessage", () => {
    // 	this.getObjectCount();
    // });
  }

  onChanges() {
    this.applyConfigurationFormControl?.valueChanges.subscribe((x) => {
      if (x == true) {
        this.configureDistribution();
      }
    });
    this.numericPercentageFormControl?.valueChanges.subscribe((x) => {
      this.calculateTotalPercentage();
    });
    this.alphanumericPercentageFormControl?.valueChanges.subscribe((x) => {
      this.calculateTotalPercentage();
    });
    this.floatPercentageFormControl?.valueChanges.subscribe((x) => {
      this.calculateTotalPercentage();
    });
  }

  calculateTotalPercentage() {
    let numericPercentage = this.numericPercentageFormControl?.value ?? 0;
    let alphanumericPercentage =
      this.alphanumericPercentageFormControl?.value ?? 0;
    let floatPercentage = this.floatPercentageFormControl?.value ?? 0;
    this.totalPercentage =
      numericPercentage + alphanumericPercentage + floatPercentage;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getObjectCount() {
    this.printObjectService.getObjectCount().subscribe(
      (resp) => {
        this.objectCountModel = resp as ObjectCountViewModel;
        this.setCounterValue();
      },
      (err) => {
        throwError(err);
      }
    );
  }

  setCounterValue() {
    this.neumericCountFormControl?.setValue(this.objectCountModel.numberCount);
    this.floatCountFormControl?.setValue(this.objectCountModel.floatCount);
    this.alphaneumericCountFormControl?.setValue(
      this.objectCountModel.characterCount
    );
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

  get applyConfigurationFormControl() {
    return this.printObjectForm.get('applyConfiguration');
  }

  get numericPercentageFormControl() {
    return this.configureDistributionForm.get('numericPercentage');
  }
  get alphanumericPercentageFormControl() {
    return this.configureDistributionForm.get('alphanumericPercentage');
  }
  get floatPercentageFormControl() {
    return this.configureDistributionForm.get('floatPercentage');
  }

  startCounting() {
    this.processStarted = true;
    let fileSize =
      this.fileSizeFormControl?.value == ''
        ? 0
        : this.fileSizeFormControl?.value;
    let isNeumeric = this.isNeumericCountFormControl?.value;
    let isAlphaneumeric = this.isAlphaneumericCountFormControl?.value;
    let isFloat = this.isFloatCountFormControl?.value;

    if (this.printObjectForm.invalid) {
      this.processStarted = false;
      this.printObjectForm.markAllAsTouched();
      return;
    }

    if (!(isNeumeric || isAlphaneumeric || isFloat)) {
      this.processStarted = false;
      this.toastService.showError('Error', 'Please select an option.');
      return;
    }

    let applyConfiguration = this.applyConfigurationFormControl?.value;
    let numericPercentage = this.numericPercentageFormControl?.value;
    let alphanumericPercentage = this.alphanumericPercentageFormControl?.value;
    let floatPercentage = this.floatPercentageFormControl?.value;

    if (applyConfiguration == true) {
      if (
        numericPercentage == null ||
        alphanumericPercentage == null ||
        floatPercentage == null
      ) {
        this.processStarted = false;
        this.toastService.showError(
          'Error',
          'Please configure distribution percentage'
        );
        return;
      }
    }

    if (!(isNeumeric && isAlphaneumeric && isFloat) && applyConfiguration) {
      this.applyConfigurationFormControl?.setValue(false);
      this.processStarted = false;
      this.toastService.showWarning(
        'Configuration is not applying',
        'Please select all option to apply configuration'
      );
      return;
    }

    let printObject = new PrintObjectViewModel({
      fileSize: fileSize,
      isNeumericCount: isNeumeric,
      isAlphaneumericCount: isAlphaneumeric,
      isFloatCount: isFloat,
      applyConfiguration: applyConfiguration,
      numericPercentage: applyConfiguration ? numericPercentage : 1,
      alphanumericPercentage: applyConfiguration ? alphanumericPercentage : 1,
      floatPercentage: applyConfiguration ? floatPercentage : 1,
    });
    this.printObjectService.startCountPrintObject(printObject).subscribe(
      (resp) => {
        this.processStarted = false;
      },
      (err) => {
        throwError(err);
      }
    );
  }

  stopCounting() {
    this.printObjectService.stopCountPrintObject().subscribe(
      (resp) => {
        this.processStarted = false;
        this.objectCountModel = resp as ObjectCountViewModel;
        this.setCounterValue();
      },
      (err) => {
        throwError(err);
      }
    );
  }

  generateReport() {
    this.router.navigate(['/report']);
  }

  configureDistribution() {
    this.configureDistributionModalRef = this.modalService.open(
      this.configDistributionModal,
      { size: 'md', backdrop: 'static', centered: true, keyboard: false }
    );
    this.configureDistributionModalRef.result.then(
      (x) => {
        if (x == true)
          this.toastService.showSuccess('Success', 'Configuration applied');
        else {
          let numericPercentage = this.numericPercentageFormControl?.value;
          let alphanumericPercentage =
            this.alphanumericPercentageFormControl?.value;
          let floatPercentage = this.floatPercentageFormControl?.value;
          this.applyConfigurationFormControl?.setValue(false);
          this.numericPercentageFormControl?.setValue(numericPercentage);
          this.alphanumericPercentageFormControl?.setValue(
            alphanumericPercentage
          );
          this.floatPercentageFormControl?.setValue(floatPercentage);
          this.toastService.showWarning('Warning', 'Configuration not applied');
        }
      },
      () => {}
    );
  }

  applyConfigureDistribution() {
    this.configureDistributionModalRef.close(true);
  }

  closeConfigurationModal() {
    this.configureDistributionModalRef.close(false);
  }
}
