import { Component, Input, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ContextMenuModule, ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-workspace-contextmenu',
  standalone: true,
  imports: [ContextMenuModule],
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceContextMenuComponent {
  /** 菜單項目模型 */
  @Input() model: MenuItem[] = [];
  /** 目標元素（選擇器或 HTMLElement） */
  @Input() target: string | HTMLElement | undefined;
  @ViewChild(ContextMenu) contextMenu?: ContextMenu;
} 