import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-shared-tag',
  standalone: true,
  imports: [TagModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTagComponent {
  @Input() value: string = '';
  @Input() severity: 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' = 'info';
} 