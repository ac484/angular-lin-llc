import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-shared-checkbox',
  standalone: true,
  imports: [CheckboxModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedCheckboxComponent {
  @Input() value: any;
  @Input() binary?: boolean;
  @Output() onChange = new EventEmitter<any>();
} 