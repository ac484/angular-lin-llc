import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkspaceComponent } from './containers/workspace.component';

@NgModule({
  imports: [
    WorkspaceComponent,
    RouterModule.forChild([
      { path: '', component: WorkspaceComponent }
    ])
  ]
})
export class WorkspaceModule {}
