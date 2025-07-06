import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';

@NgModule({
  imports: [
    AccountComponent,
    RouterModule.forChild([
      { path: '', component: AccountComponent }
    ])
  ]
})
export class AccountModule {} 