import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CascadeSelectModule } from 'primeng/cascadeselect';

@Component({
  selector: 'app-shared-cascadeselect',
  standalone: true,
  imports: [CascadeSelectModule],
  templateUrl: './cascadeselect.component.html',
  styleUrls: ['./cascadeselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedCascadeSelectComponent {
  @Input() options: any[] = [];
  @Input() optionLabel?: string;
  @Input() optionValue?: string;
  @Input() value: any;
  @Output() onChange = new EventEmitter<any>();
} 