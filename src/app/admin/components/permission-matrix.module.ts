import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionMatrixComponent } from './permission-matrix.component';

@NgModule({
  imports: [
    PermissionMatrixComponent,
    RouterModule.forChild([
      { path: '', component: PermissionMatrixComponent }
    ])
  ]
})
export class PermissionMatrixModule {}

// TypeScript will auto-generate .d.ts for NgModules, but if needed for IDE, create an empty type declaration.
export {}; 