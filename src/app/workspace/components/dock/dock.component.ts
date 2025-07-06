import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-workspace-dock',
  standalone: true,
  imports: [CommonModule, DockModule, TooltipModule],
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

  @Output() addNode = new EventEmitter<void>();
  @Output() addTask = new EventEmitter<void>();
  @Output() dockRightClick = new EventEmitter<MouseEvent>();

  onDockRightClick(event: MouseEvent) {
    event.preventDefault();
    this.dockRightClick.emit(event);
  }
} 