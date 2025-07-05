import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { TreeNode } from 'primeng/api';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-dynamic-node-tree',
  standalone: true,
  imports: [CommonModule, TreeModule, ButtonModule],
  template: `
    <div class="tree-container">
      <div class="tree-header">
        <h2>廠案結構</h2>
        <button pButton type="button" label="新增根節點" icon="pi pi-plus" (click)="addRootNode()"></button>
      </div>
      <p-tree [value]="nodes" selectionMode="single" [(selection)]="selectedNode" (onNodeSelect)="onNodeSelect($event)">
        <ng-template let-node pTemplate="default">
          <span class="node-name">{{ node.label }}</span>
          <span class="node-actions">
            <button pButton type="button" icon="pi pi-plus" class="p-button-text p-button-sm" (click)="addChildNode(node)"></button>
            <button pButton type="button" icon="pi pi-pencil" class="p-button-text p-button-sm" (click)="editNode(node)"></button>
            <button pButton type="button" icon="pi pi-trash" class="p-button-text p-button-sm" (click)="deleteNode(node)"></button>
          </span>
        </ng-template>
      </p-tree>
    </div>
  `,
  styles: [
    `.tree-container { padding: 1rem; }
     .tree-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
     .node-name { font-weight: 500; margin-right: 8px; }
     .node-actions { margin-left: 1rem; display: inline-flex; gap: 4px; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicNodeTreeComponent implements OnInit {
  nodes: TreeNode[] = [];
  selectedNode: TreeNode | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadNodes();
  }

  async loadNodes() {
    const rawNodes = await this.projectService.getProjectTree();
    this.nodes = rawNodes.map(node => ({
      key: node.id,
      label: node.name,
      data: node,
      children: node.children ? this.mapChildren(node.children) : [],
      expanded: true
    }));
  }

  mapChildren(children: any[]): TreeNode[] {
    return children.map(child => ({
      key: child.id,
      label: child.name,
      data: child,
      children: child.children ? this.mapChildren(child.children) : [],
      expanded: true
    }));
  }

  addRootNode() { /* TODO: 實作 */ }
  addChildNode(node: TreeNode) { /* TODO: 實作 */ }
  editNode(node: TreeNode) { /* TODO: 實作 */ }
  deleteNode(node: TreeNode) { /* TODO: 實作 */ }
  onNodeSelect(event: { node: TreeNode }) { /* TODO: 實作 */ }
}
