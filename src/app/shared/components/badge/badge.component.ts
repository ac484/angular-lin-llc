import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-shared-badge',
  standalone: true,
  imports: [BadgeModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedBadgeComponent {
  @Input() value: string | number = '';
  @Input() severity: 'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' = 'info';
} 