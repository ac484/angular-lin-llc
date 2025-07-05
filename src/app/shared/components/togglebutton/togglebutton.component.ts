import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-shared-togglebutton',
  standalone: true,
  imports: [ToggleButtonModule],
  templateUrl: './togglebutton.component.html',
  styleUrls: ['./togglebutton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedToggleButtonComponent {
  @Input() onLabel = 'Yes';
  @Input() offLabel = 'No';
  @Input() onIcon?: string;
  @Input() offIcon?: string;
  @Input() disabled?: boolean;
  @Output() onChange = new EventEmitter<any>();
} 