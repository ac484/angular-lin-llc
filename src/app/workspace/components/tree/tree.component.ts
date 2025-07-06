import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TreeNode, MenuItem } from 'primeng/api';
import { WorkspaceNode, NodeType } from '../../../core/models/workspace.types';
import { CommonModule } from '@angular/common';

// 節點類型定義（可搬到 config/service，這裡直接寫死極簡）
const NODE_TYPES: NodeType[] = [
  { id: 'factory', name: '廠區', icon: 'pi pi-building', color: '#1976d2' },
  { id: 'area', name: '區域', icon: 'pi pi-map', color: '#388e3c' },
  { id: 'department', name: '部門', icon: 'pi pi-users', color: '#fbc02d' },
  { id: 'task', name: '任務', icon: 'pi pi-tasks', color: '#e64a19', isLeaf: true },
  { id: 'custom', name: '自訂', icon: 'pi pi-circle', color: '#757575' },
  { id: 'root', name: '主節點', icon: 'pi pi-sitemap', color: '#512da8' }
];

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

  get contextMenuItems(): MenuItem[] {
    const node = this.selectedNode;
    const nodeType = node ? this.getNodeType(node) : undefined;
    const isLeaf = nodeType?.isLeaf;
    return [
      // 只有非葉節點可建立子節點
      ...(isLeaf ? [] : [{ label: '建立子節點', icon: 'pi pi-plus', command: () => this.action.emit({ type: 'add', node: node! }) }]),
      // 只有非任務節點可建立任務
      ...(nodeType?.id !== 'task' ? [{ label: '建立任務', icon: 'pi pi-tasks', command: () => this.action.emit({ type: 'addTask', node: node! }) }] : []),
      { separator: true },
      { label: '重新命名', icon: 'pi pi-pencil', command: () => this.action.emit({ type: 'rename', node: node! }) },
      { label: '刪除', icon: 'pi pi-trash', command: () => this.action.emit({ type: 'delete', node: node! }) },
      { label: '複製 ID', icon: 'pi pi-copy', command: () => navigator.clipboard.writeText(node?.data?.id || '') },
      { label: '查看詳細', icon: 'pi pi-info-circle', command: () => this.action.emit({ type: 'detail', node: node! }) }
    ];
  }

  getTaskCount(node: TreeNode<any>): number {
    return Array.isArray(node.data?.properties?.tasks) ? node.data.properties.tasks.length : 0;
  }

  // 根據 nodeTypeId 取得 NodeType
  getNodeType(node: TreeNode<any>): NodeType | undefined {
    return NODE_TYPES.find((nt: NodeType) => nt.id === node.data?.nodeTypeId);
  }

  // 取得 icon
  getNodeIcon(node: TreeNode<any>): string {
    return this.getNodeType(node)?.icon || 'pi pi-circle';
  }
} 