import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { FirebaseService } from '../core/services/firebase.service';
import type { WorkspaceNode } from '../core/models/workspace.types';
import { TreeModule } from 'primeng/tree';
import type { TreeNode } from 'primeng/api';
import { SplitterModule } from 'primeng/splitter';
import { FormsModule } from '@angular/forms';
import { DockModule } from 'primeng/dock';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, ToolbarModule, SplitterModule, TreeModule, PanelModule, DockModule],
  template: `
    <p-toolbar class="p-mb-2">
      <div class="p-toolbar-group-left">
        <span>概要與詳細</span>
      </div>
    </p-toolbar>
    <p-splitter style="height:calc(100vh - 3rem)" layout="horizontal">
      <ng-template pSplitterPanel size="20">
        <p-tree [value]="nodes" selectionMode="single" [(selection)]="selectedNode" (onNodeSelect)="onNodeSelect($event)"></p-tree>
      </ng-template>
      <ng-template pSplitterPanel size="30">
        <p-panel header="快速統計" class="workspace-overview">
          <!-- TODO: 顯示快速統計卡片 -->
        </p-panel>
      </ng-template>
      <ng-template pSplitterPanel size="50">
        <p-panel header="選取項目詳細資訊" class="workspace-detail">
          <!-- TODO: 顯示所選節點詳細資料 -->
        </p-panel>
      </ng-template>
    </p-splitter>
  `,
  styles: [
    `.workspace-container { height: 100vh; }
     .content-area { padding: 1rem; }
     .workspace-overview, .workspace-detail { padding: 1rem; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceComponent implements OnInit {
  nodes: TreeNode[] = [];
  selectedNode: TreeNode | null = null;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadWorkspaceNodes();
  }

  private async loadWorkspaceNodes(): Promise<void> {
    const rawNodes = await this.firebaseService.getDocuments<WorkspaceNode>('workspaceNodes');
    this.nodes = this.mapWorkspaceNodeToTreeNode(rawNodes);
  }

  private mapWorkspaceNodeToTreeNode(nodes: WorkspaceNode[]): TreeNode[] {
    return nodes.map(node => ({
      key: node.id,
      label: node.name,
      data: node,
      children: node.children ? this.mapWorkspaceNodeToTreeNode(node.children) : [],
      expanded: true
    }));
  }

  onNodeSelect(event: { node: TreeNode }): void {
    console.log('選擇節點:', event.node);
  }
} 