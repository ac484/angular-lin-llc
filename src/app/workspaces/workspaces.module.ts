import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkspacesComponent } from './pages/workspaces.component';

const routes: Routes = [
  { path: '', component: WorkspacesComponent }
];

@NgModule({
  declarations: [WorkspacesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class WorkspacesModule { }
