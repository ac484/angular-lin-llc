import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {AlertsComponent} from './pages/alerts/alerts.component';
import {ButtonsComponent} from './pages/buttons/buttons.component';
import {authGuard} from './guards/auth.guard';
import {logoutGuard} from './guards/logout.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },

    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate:[authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'alerts', component: AlertsComponent },
      { path: 'buttons', component: ButtonsComponent },
      { path: 'workspace', loadComponent: () => import('./pages/workspace/workspace.component').then(m => m.WorkspaceComponent) }
    ]
  },
  {
    path: 'logout',
    canActivate:[logoutGuard],
    component:LoginComponent
  },
  { path: '**', redirectTo: 'login' }
];
