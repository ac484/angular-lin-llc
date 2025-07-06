import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UserPanelComponent } from './components/user-panel.component';

@Component({
  selector: 'app-account',
  template: `<app-user-panel />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UserPanelComponent]
})
export class AccountComponent {}
