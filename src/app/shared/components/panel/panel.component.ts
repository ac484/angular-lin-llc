import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Panel } from 'primeng/panel';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [Panel],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelComponent {} 