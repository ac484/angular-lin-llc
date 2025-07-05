import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FirebaseService } from '../core/services/firebase.service';
import type { WorkspaceNode } from '../core/models/workspace.types';
import { TreeModule } from 'primeng/tree';
import type { TreeNode } from 'primeng/api';
import { SplitterModule } from 'primeng/splitter';
import { DockModule } from 'primeng/dock';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    SplitterModule,
    MatToolbarModule,
    TreeModule,
    DockModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>概要與詳細</span>
    </mat-toolbar>
    <p-splitter [style]="{'height':'calc(100vh - 64px)'}" layout="horizontal">
      <ng-template pSplitterPanel size="20">
        <p-tree [value]="nodes" selectionMode="single" [(selection)]="selectedNode" (onNodeSelect)="onNodeSelect($event)"></p-tree>
      </ng-template>
      <ng-template pSplitterPanel size="30">
        <div class="workspace-overview">
          <h3>快速統計</h3>
          <!-- TODO: 顯示快速統計卡片 -->
        </div>
      </ng-template>
      <ng-template pSplitterPanel size="50">
        <div class="workspace-detail">
          <h3>選取項目詳細資訊</h3>
          <!-- TODO: 顯示所選節點詳細資料 -->
        </div>
      </ng-template>
    </p-splitter>
  `,
  styles: [
    `.workspace-container { height: 100vh; }
     .workspace-content { padding: 1rem; }
     .workspace-main { display: flex; gap: 1rem; }
     .workspace-overview { flex: 1; }
     .workspace-detail { flex: 2; }`
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
    // TODO: 處理選中節點顯示詳情
    console.log('選擇節點:', event.node);
  }
} 