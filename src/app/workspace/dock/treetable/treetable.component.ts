import { Component, OnInit, Input } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem, TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DEFAULT_NODE_TYPES } from '../config/dock-menu.config';
import type { NodeType, WorkspaceNode, Task } from '../models/workspace.types';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-shared-treetable',
  standalone: true,
  imports: [CommonModule, TreeTableModule, ContextMenuModule, ButtonModule],
  templateUrl: './treetable.component.html',
  styleUrls: ['./treetable.component.scss']
})
export class SharedTreetableComponent implements OnInit {
  @Input() files: TreeNode<any>[] = [];
  @Input() cols: { field: string; header: string }[] = [];
  items: MenuItem[] = [];
  selectedNode!: TreeNode<any>;
  nodeTypes: NodeType[] = DEFAULT_NODE_TYPES;

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
    // TODO: 實際應呼叫父元件或 service
    console.log('新增根結點');
  }

  addBranchNode() {
    // TODO: 實際應呼叫父元件或 service
    console.log('新增枝節點', this.selectedNode);
  }

  addLeafNode() {
    // TODO: 實際應呼叫父元件或 service
    console.log('新增葉節點', this.selectedNode);
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