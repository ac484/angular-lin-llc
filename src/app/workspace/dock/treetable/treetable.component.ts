import { Component, OnInit, Input } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem, TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DEFAULT_NODE_TYPES } from '../config/dock-menu.config';
import type { NodeType, WorkspaceNode, Task } from '../models/workspace.types';
import { WorkspaceDataService } from '../services/dock-data.service';
import { WorkspaceStateService } from '../services/dock-state.service';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-shared-treetable',
  standalone: true,
  imports: [CommonModule, TreeTableModule, ContextMenuModule, ButtonModule, CheckboxModule],
  templateUrl: './treetable.component.html',
  styleUrls: ['./treetable.component.scss']
})
export class SharedTreetableComponent implements OnInit {
  @Input() files: TreeNode<any>[] = [];
  @Input() cols: { field: string; header: string }[] = [];
  items: MenuItem[] = [];
  selectedNode!: TreeNode<any>;
  nodeTypes: NodeType[] = DEFAULT_NODE_TYPES;
  selectionKeys: Record<string, any> = {};

  constructor(
    private data: WorkspaceDataService,
    private state: WorkspaceStateService
  ) {}

  ngOnInit() {
    // TODO: 請用你的 service 取資料
    // this.files = ...;
    this.items = [
      { label: '檢視', icon: 'pi pi-search', command: () => this.viewNode(this.selectedNode) },
      { label: '切換展開', icon: 'pi pi-sort', command: () => this.toggleNode(this.selectedNode) },
      { separator: true },
      { label: '新增根結點', icon: 'pi pi-plus', command: () => this.addRootNode() },
      { label: '新增枝節點', icon: 'pi pi-plus', command: () => this.addBranchNode() },
      { label: '新增葉節點', icon: 'pi pi-plus', command: () => this.addLeafNode() }
    ];
  }

  viewNode(node: TreeNode<any>) {
    // TODO: 檢視邏輯
  }

  toggleNode(node: TreeNode<any>) {
    node.expanded = !node.expanded;
    this.files = [...this.files];
  }

  addRootNode() {
    const node: WorkspaceNode = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      name: '根結點',
      type: 'root',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: null
    };
    this.data.addWorkspace(node).then(() => this.reloadTree());
  }

  addBranchNode() {
    if (!this.selectedNode?.data?.id) return;
    const node: WorkspaceNode = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      name: '枝節點',
      type: 'branch',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: this.selectedNode.data.id
    };
    this.data.addWorkspace(node).then(() => this.reloadTree());
  }

  addLeafNode() {
    if (!this.selectedNode?.data?.id) return;
    const node: WorkspaceNode = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      name: '葉節點',
      type: 'leaf',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: this.selectedNode.data.id
    };
    this.data.addWorkspace(node).then(() => this.reloadTree());
  }

  reloadTree() {
    this.state.showTreeTable$.next(false);
    setTimeout(() => this.state.showTreeTable$.next(true), 0);
  }

  getTypeLabel(rowData: WorkspaceNode | Task): string {
    if ((rowData as Task).status !== undefined && (rowData as Task).nodeId) {
      return '任務';
    }
    const type = (rowData as WorkspaceNode).type;
    const found = this.nodeTypes.find(t => t.id === type);
    return found ? found.name : type;
  }
} 