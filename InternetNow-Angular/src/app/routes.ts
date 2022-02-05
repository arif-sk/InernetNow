import {Routes} from '@angular/router';
import { PrintableObjectComponent } from './printable-object/printable-object.component';

export const appRoutes: Routes = [
    {path: '', component: PrintableObjectComponent},
    {path: 'printable-object', component: PrintableObjectComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'},
];
