import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DockModule } from 'primeng/dock';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-workspace-dock',
  standalone: true,
  imports: [DockModule],
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceDockComponent {
  /** Dock 的模型資料 */
  @Input() model: MenuItem[] = [];
  /** 位置 bottom/top/left/right */
  @Input() position: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
  /** 行動版斷點 */
  @Input() breakpoint: string = '960px';
} 