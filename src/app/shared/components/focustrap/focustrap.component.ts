import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FocusTrapModule } from 'primeng/focustrap';

@Component({
  selector: 'app-shared-focustrap',
  standalone: true,
  imports: [FocusTrapModule],
  templateUrl: './focustrap.component.html',
  styleUrls: ['./focustrap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedFocustrapComponent {
  @Input() pFocusTrapDisabled: boolean = false;
} 