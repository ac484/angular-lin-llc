import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Overlay } from 'primeng/overlay';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [Overlay],
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent {} 