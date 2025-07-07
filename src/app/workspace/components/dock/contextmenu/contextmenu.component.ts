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
  @ViewChild(ContextMenu) contextMenu?: ContextMenu;

  show(event: MouseEvent): void {
    this.contextMenu?.show(event);
  }
} 