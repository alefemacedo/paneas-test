import { Routes } from '@angular/router';
import { authGuard } from '@guards/index';

import {
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent
} from '@views/index';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'cadastrar', component: RegisterComponent },
    { path: '', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] }
];
