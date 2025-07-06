import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { WorkspaceNode, NodeType } from '../../core/models/workspace.types';
import { ProjectService } from '../../core/services/project.service';
import { NodeTypeService } from '../../core/services/node-type.service';
import { Observable, from, combineLatest, map, of } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';

@Component({
  selector: 'app-dynamic-node-tree',
  standalone: true,
  imports: [
    CommonModule, 
    MatTreeModule, 
    MatIconModule, 
    MatButtonModule, 
    MatChipsModule,
    MatMenuModule,
    MatDialogModule
  ],
  template: `
    <div class="tree-container">
      <div class="tree-header">
        <h2>廠案結構</h2>
        <button mat-raised-button color="primary" (click)="addRootNode()">
          <mat-icon>add</mat-icon>
          新增根節點
        </button>
      </div>
      
      <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
        <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
          <button mat-icon-button disabled></button>
          <mat-icon [style.color]="getNodeTypeColor(node.type)">
            {{ getNodeTypeIcon(node.type) }}
          </mat-icon>
          <span class="node-name">{{ node.name }}</span>
          <span class="node-code" *ngIf="node.code">({{ node.code }})</span>
          <mat-chip [color]="getStatusColor(node.status)" selected>
            {{ node.status }}
          </mat-chip>
          <div class="node-actions">
            <button mat-icon-button [matMenuTriggerFor]="nodeMenu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #nodeMenu="matMenu">
              <button mat-menu-item (click)="addChildNode(node)">
                <mat-icon>add</mat-icon>
                新增子節點
              </button>
              <button mat-menu-item (click)="editNode(node)">
                <mat-icon>edit</mat-icon>
                編輯節點
              </button>
              <button mat-menu-item (click)="deleteNode(node)">
                <mat-icon>delete</mat-icon>
                刪除節點
              </button>
            </mat-menu>
          </div>
        </mat-tree-node>
        
        <mat-nested-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
          <button mat-icon-button matTreeNodeToggle>
            <mat-icon class="mat-icon-rtl-mirror">
              {{ treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right' }}
            </mat-icon>
          </button>
          <mat-icon [style.color]="getNodeTypeColor(node.type)">
            {{ getNodeTypeIcon(node.type) }}
          </mat-icon>
          <span class="node-name">{{ node.name }}</span>
          <span class="node-code" *ngIf="node.code">({{ node.code }})</span>
          <mat-chip [color]="getStatusColor(node.status)" selected>
            {{ node.status }}
          </mat-chip>
          <div class="node-actions">
            <button mat-icon-button [matMenuTriggerFor]="nodeMenu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #nodeMenu="matMenu">
              <button mat-menu-item (click)="addChildNode(node)">
                <mat-icon>add</mat-icon>
                新增子節點
              </button>
              <button mat-menu-item (click)="editNode(node)">
                <mat-icon>edit</mat-icon>
                編輯節點
              </button>
              <button mat-menu-item (click)="deleteNode(node)">
                <mat-icon>delete</mat-icon>
                刪除節點
              </button>
            </mat-menu>
          </div>
          <div matTreeNodeOutlet></div>
        </mat-nested-tree-node>
      </mat-tree>
    </div>
  `,
  styles: [`
    .tree-container {
      padding: 1rem;
    }
    
    .tree-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .node-name {
      font-weight: 500;
      margin-right: 8px;
    }
    
    .node-code {
      color: #666;
      font-size: 0.9rem;
      margin-right: 8px;
    }
    
    .node-actions {
      margin-left: auto;
      display: flex;
      gap: 4px;
    }
    
    mat-tree-node {
      display: flex;
      align-items: center;
      padding: 8px 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicNodeTreeComponent implements OnInit {
  private projectService = inject(ProjectService);
  private nodeTypeService = inject(NodeTypeService);
  
  treeControl = new NestedTreeControl<WorkspaceNode>(node => node.children ?? []);
  dataSource = new MatTreeNestedDataSource<WorkspaceNode>();
  nodeTypes$: Observable<NodeType[]> = from(this.nodeTypeService.getNodeTypes());
  hasChild = (_: number, node: WorkspaceNode): boolean => !!node.children?.length;

  ngOnInit(): void {
    this.projectService.getProjectTree().then((nodes: WorkspaceNode[]) => this.dataSource.data = nodes);
  }

  getNodeTypeIcon(type: string): string {
    // 從 nodeTypes$ 中獲取圖示，這裡簡化處理
    const iconMap: Record<string, string> = {
      factory: 'factory',
      area: 'grid_view',
      building: 'business',
      floor: 'layers',
      level: 'layers',
      station: 'location_on',
      department: 'business',
      team: 'group',
      task: 'assignment'
    };
    return iconMap[type] || 'folder';
  }

  getNodeTypeColor(type: string): string {
    // 從 nodeTypes$ 中獲取顏色，這裡簡化處理
    const colorMap: Record<string, string> = {
      factory: '#1976d2',
      area: '#388e3c',
      building: '#f57c00',
      floor: '#7b1fa2',
      level: '#d32f2f',
      station: '#1976d2',
      department: '#388e3c',
      team: '#f57c00',
      task: '#7b1fa2'
    };
    return colorMap[type] || '#666';
  }

  getStatusColor(status: string): string {
    const colors = {
      active: 'primary',
      inactive: 'warn',
      completed: 'accent',
      archived: 'basic'
    };
    return colors[status as keyof typeof colors] || 'primary';
  }

  addRootNode(): void {
    // TODO: 實作新增根節點
    console.log('新增根節點');
  }

  addChildNode(parentNode: WorkspaceNode): void {
    // TODO: 實作新增子節點
    console.log('新增子節點到:', parentNode);
  }

  editNode(node: WorkspaceNode): void {
    // TODO: 實作編輯節點
    console.log('編輯節點:', node);
  }

  deleteNode(node: WorkspaceNode): void {
    // TODO: 實作刪除節點
    console.log('刪除節點:', node);
  }
}
