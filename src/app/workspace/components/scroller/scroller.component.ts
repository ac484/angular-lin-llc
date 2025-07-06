import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollerOptions } from 'primeng/api';

@Component({
  selector: 'app-workspace-scroller',
  standalone: true,
  imports: [ScrollerModule],
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceScrollerComponent {
  /** 列表元素 */
  @Input() items: any[] = [];
  /** Scroller 選項 */
  @Input() options?: ScrollerOptions;
} 