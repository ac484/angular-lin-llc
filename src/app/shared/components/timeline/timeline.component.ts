import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-workspace-timeline',
  standalone: true,
  imports: [TimelineModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceTimelineComponent {
  /** 要顯示的事件資料 */
  @Input() events: any[] = [];
  /** 位置: left/right/top/bottom */
  @Input() align: 'left' | 'right' | 'top' | 'bottom' = 'left';
  /** 方向: vertical/horizontal */
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
} 