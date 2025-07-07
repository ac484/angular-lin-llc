import { Component, Input, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DEFAULT_NODE_TYPES } from '../config/dock-menu.config';
import type { NodeType, WorkspaceNode, Task } from '../models/workspace.types';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-shared-treetable',
  standalone: true,
  imports: [CommonModule, TreeTableModule, ContextMenuModule],
  templateUrl: './treetable.component.html',
  styleUrls: ['./treetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTreetableComponent {
  @Input() value: TreeNode<any>[] = [];
  @Input() columns: { field: string; header: string }[] = [];
  @Input() nodeTypes: NodeType[] = DEFAULT_NODE_TYPES;

  @ViewChild('contextMenu') contextMenu: any;
  contextMenuItems: MenuItem[] = [
    {
      label: '新增子節點',
      icon: 'pi pi-plus',
      command: () => { if (this.selectedNode) this.addChildNode(this.selectedNode); }
    },
    {
      label: '刪除',
      icon: 'pi pi-trash',
      command: () => { if (this.selectedNode) this.deleteNode(this.selectedNode); }
    },
    { separator: true },
    {
      label: '重新整理',
      icon: 'pi pi-refresh',
      command: () => this.reload()
    }
  ];
  selectedNode: TreeNode<any> | null = null;

  onRowRightClick(event: MouseEvent, rowNode: TreeNode<any>) {
    this.selectedNode = rowNode;
    this.contextMenu.show(event);
    event.preventDefault();
  }

  addChildNode(node: TreeNode<any>) { /* TODO: 實作新增子節點 */ }
  deleteNode(node: TreeNode<any>) { /* TODO: 實作刪除節點 */ }
  reload() { /* TODO: 實作重新整理 */ }

  getTypeLabel(rowData: WorkspaceNode | Task): string {
    if ((rowData as Task).status !== undefined && (rowData as Task).nodeId) {
      return '任務';
    }
    const type = (rowData as WorkspaceNode).type;
    const found = this.nodeTypes.find(t => t.id === type);
    return found ? found.name : type;
  }
} 