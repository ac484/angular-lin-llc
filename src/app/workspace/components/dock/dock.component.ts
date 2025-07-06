import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { WorkspaceNode } from '../../../core/models/workspace.types';
import { getContextMenuItems } from '../contextmenu/contextmenu.utils';
import { WorkspaceContextMenuComponent } from '../contextmenu/contextmenu.component';

@Component({
  selector: 'app-workspace-dock',
  standalone: true,
  imports: [CommonModule, DockModule, TooltipModule, WorkspaceContextMenuComponent],
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

  contextMenuItems: MenuItem[] = [];
  contextTarget: string | HTMLElement | undefined;
  showContextMenu = false;

  onDockRightClick(event: MouseEvent) {
    event.preventDefault();
    this.contextTarget = event.target as HTMLElement;
    // dock 沒有 WorkspaceNode，僅提供全域操作
    this.contextMenuItems = [
      {
        label: '新增節點',
        icon: 'pi pi-plus',
        command: () => this.addNode.emit()
      },
      {
        label: '新增任務',
        icon: 'pi pi-tasks',
        command: () => this.addTask.emit()
      }
    ];
    this.showContextMenu = true;
  }
} 