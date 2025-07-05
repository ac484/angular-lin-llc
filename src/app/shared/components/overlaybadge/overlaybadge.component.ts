import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OverlayBadge } from 'primeng/overlaybadge';

@Component({
  selector: 'app-overlaybadge',
  standalone: true,
  imports: [OverlayBadge],
  templateUrl: './overlaybadge.component.html',
  styleUrls: ['./overlaybadge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlaybadgeComponent {} 