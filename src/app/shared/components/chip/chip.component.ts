import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-shared-chip',
  standalone: true,
  imports: [ChipModule],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedChipComponent {
  @Input() label?: string;
  @Input() icon?: string;
  @Input() image?: string;
  @Input() removable?: boolean;
  @Output() onRemove = new EventEmitter<MouseEvent>();
} 