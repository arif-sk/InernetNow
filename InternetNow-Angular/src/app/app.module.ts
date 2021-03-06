import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appRoutes } from './routes';
import { PrintableObjectComponent } from './printable-object/printable-object.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrintObjectService } from './services/print-object.service';
import { HttpClientModule } from '@angular/common/http';
import { ReportComponent } from './report/report.component';
import { AppToastsComponent } from './toast/toast.component';
import { ToastService } from './services/toastService';

@NgModule({
  declarations: [
    AppComponent,
    PrintableObjectComponent,
    ReportComponent,
    AppToastsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [PrintObjectService, ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
