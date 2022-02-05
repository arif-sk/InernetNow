import {Routes} from '@angular/router';
import { PrintableObjectComponent } from './printable-object/printable-object.component';
import {ReportComponent} from './report/report.component';

export const appRoutes: Routes = [
    {path: '', component: PrintableObjectComponent},
    {path: 'printable-object', component: PrintableObjectComponent},
    {path: 'report', component: ReportComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'},
];
