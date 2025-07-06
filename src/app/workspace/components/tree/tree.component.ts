import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TreeNode, MenuItem } from 'primeng/api';
import { WorkspaceNode } from '../../../core/models/workspace.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workspace-tree',
  standalone: true,
  imports: [CommonModule, TreeModule, ContextMenuModule],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceTreeComponent {
  @Input() nodes: TreeNode<any>[] = [];
  @Input() selectedNode: TreeNode<any> | null = null;
  @Output() selectedNodeChange = new EventEmitter<TreeNode<any> | null>();
  @Output() action = new EventEmitter<{ type: string, node: TreeNode<any> }>();

  contextMenuItems: MenuItem[] = [
    { label: '建立子節點', icon: 'pi pi-plus', command: () => this.action.emit({ type: 'add', node: this.selectedNode! }) },
    { label: '建立任務', icon: 'pi pi-tasks', command: () => this.action.emit({ type: 'addTask', node: this.selectedNode! }) },
    { separator: true },
    { label: '重新命名', icon: 'pi pi-pencil', command: () => this.action.emit({ type: 'rename', node: this.selectedNode! }) },
    { label: '刪除', icon: 'pi pi-trash', command: () => this.action.emit({ type: 'delete', node: this.selectedNode! }) },
    { label: '複製 ID', icon: 'pi pi-copy', command: () => navigator.clipboard.writeText(this.selectedNode?.data?.id || '') },
    { label: '查看詳細', icon: 'pi pi-info-circle', command: () => this.action.emit({ type: 'detail', node: this.selectedNode! }) }
  ];

  getTaskCount(node: TreeNode<any>): number {
    return Array.isArray(node.data?.properties?.tasks) ? node.data.properties.tasks.length : 0;
  }
} 