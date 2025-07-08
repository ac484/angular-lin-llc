import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleManagementComponent } from './role-management.component';

@NgModule({
  imports: [
    RoleManagementComponent,
    RouterModule.forChild([
      { path: '', component: RoleManagementComponent }
    ])
  ]
})
export class RoleManagementModule {}

// TypeScript will auto-generate .d.ts for NgModules, but if needed for IDE, create an empty type declaration.
export {}; 