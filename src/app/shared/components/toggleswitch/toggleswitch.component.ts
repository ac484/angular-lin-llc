import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
// import { ToggleSwitchChangeEvent } from 'primeng/api';

@Component({
  selector: 'app-shared-toggleswitch',
  standalone: true,
  imports: [ToggleSwitchModule],
  templateUrl: './toggleswitch.component.html',
  styleUrls: ['./toggleswitch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedToggleSwitchComponent {
  @Input() trueValue: any = true;
  @Input() falseValue: any = false;
  @Input() readonly?: boolean;
  @Input() tabindex?: number;
  @Output() onChange = new EventEmitter<any>();
} 