import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AutoFocusModule } from 'primeng/autofocus';

@Component({
  selector: 'app-shared-auto-focus',
  standalone: true,
  imports: [AutoFocusModule],
  templateUrl: './autofocus.component.html',
  styleUrls: ['./autofocus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedAutoFocusComponent {
  @Input() autofocus: boolean = false;
} 