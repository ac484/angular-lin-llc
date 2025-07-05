import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { 
        path: '', 
        loadComponent: () => import('./components/admin-panel.component').then(m => m.AdminPanelComponent) 
      },
      { 
        path: 'users', 
        loadChildren: () => import('../users/users.module').then(m => m.UsersModule) 
      },
      { path: 'roles', loadComponent: () => import('./components/role-management.component').then(m => m.RoleManagementComponent) },
      { path: 'permissions', loadComponent: () => import('./components/permission-matrix.component').then(m => m.PermissionMatrixComponent) }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule {} 