import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.module').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./home/home.module').then(m => m.HomeComponent)
  },
  {
    path: 'account',
    loadComponent: () => import('./account/account.module').then(m => m.AccountComponent)
  },
  {
    path: 'workspace',
    loadChildren: () => import('./workspace/workspace.module').then(m => m.WorkspaceModule)
  },
  {
    path: 'workspaces',
    loadComponent: () => import('./workspaces/workspaces.module').then(m => m.WorkspacesModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
];
