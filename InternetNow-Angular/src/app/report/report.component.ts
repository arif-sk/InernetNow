import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrintObjectService } from '../services/print-object.service';
import { throwError } from 'rxjs';
import { FileContentViewModel } from '../Model/common.viewmodel';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  fileContentModel: FileContentViewModel = new FileContentViewModel();
  constructor(private router: Router,
    private printObjectService: PrintObjectService) { }

  ngOnInit(): void {
    this.generateReport();
  }
  generateReport() {
    this.printObjectService.generateReport().subscribe(resp => {
      this.fileContentModel = resp as FileContentViewModel;
    }, err => {
      throwError(err);
    });
  }
  backPrintableObjectCounter() {
    this.router.navigate(['/printable-object']);
  }

}
