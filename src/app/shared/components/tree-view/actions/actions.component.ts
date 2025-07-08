import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [TreeModule, FormsModule],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {
  nodes: TreeNode[] = [
    {
      label: '根節點',
      key: 'root',
      children: [
        { label: '子節點 1', key: 'c1', leaf: true },
        { label: '子節點 2', key: 'c2', leaf: true }
      ]
    }
  ];
  selectedNode: TreeNode | null = null;
  editLabel: string = '';
  isEditing = false;

  addNode() {
    if (!this.selectedNode) return;
    if (!this.selectedNode.children) this.selectedNode.children = [];
    const newKey = 'n' + Date.now();
    this.selectedNode.children.push({ label: '新節點', key: newKey, leaf: true });
    this.selectedNode.leaf = false;
  }

  startEdit() {
    if (!this.selectedNode) return;
    this.editLabel = this.selectedNode.label || '';
    this.isEditing = true;
  }

  saveEdit() {
    if (this.selectedNode) this.selectedNode.label = this.editLabel;
    this.isEditing = false;
  }

  deleteNode() {
    if (!this.selectedNode) return;
    this.removeNode(this.nodes, this.selectedNode.key!);
    this.selectedNode = null;
  }

  private removeNode(nodes: TreeNode[], key: string) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].key === key) {
        nodes.splice(i, 1);
        return true;
      }
      if (nodes[i].children && this.removeNode(nodes[i].children!, key)) {
        // 若刪除後 children 為空，設 leaf 為 true
        if (nodes[i].children!.length === 0) nodes[i].leaf = true;
        return true;
      }
    }
    return false;
  }
}
