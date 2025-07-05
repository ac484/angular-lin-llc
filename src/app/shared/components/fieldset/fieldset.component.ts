import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-shared-fieldset',
  standalone: true,
  imports: [FieldsetModule],
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedFieldsetComponent {
  @Input() legend?: string;
  @Input() toggleable?: boolean;
  @Input() collapsed?: boolean;
  @Output() collapsedChange = new EventEmitter<boolean>();
} 