import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/index'

import { LoginComponent } from '@views/login/login.component';
import { DashboardComponent } from '@views/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    // { path: '', component: DashboardComponent, canActivate: [AuthGuard] }
];
