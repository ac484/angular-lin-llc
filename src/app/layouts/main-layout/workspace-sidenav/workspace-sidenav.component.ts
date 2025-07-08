import { Component, inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { CommonModule } from '@angular/common';
import { WorkspaceDataService } from './workspace-sidenav-data.service';
import { WorkspaceStateService } from './workspace-sidenav-state.service';
import { MenuItem, TreeNode } from 'primeng/api';
import { WorkspaceTreeNode, WorkspaceNode } from './workspace-sidenav.types';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-workspace-sidenav',
  templateUrl: './workspace-sidenav.component.html',
  styleUrls: ['./workspace-sidenav.component.scss'],
  standalone: true,
  imports: [CommonModule, SidenavComponent, ...PrimeNgModules],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceSidenavComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly dataService = inject(WorkspaceDataService);
  private readonly stateService = inject(WorkspaceStateService);

  // 樹狀資料
  readonly treeNodes$ = this.dataService.loadTree();
  readonly selectedNode$ = this.stateService.selectedNode$;
  readonly treeConfig$ = this.stateService.treeConfig$;

  // 選單項目
  readonly menubarItems: MenuItem[] = [
    { label: '首頁', icon: 'pi pi-home', routerLink: '/' },
    {
      label: '節點', icon: 'pi pi-briefcase',
      items: [
        { label: '新增節點', icon: 'pi pi-plus', command: () => this.addNode() }
      ]
    }
  ];

  // 右鍵選單
  readonly contextMenuItems: MenuItem[] = [
    { 
      label: '新增子節點', 
      icon: 'pi pi-plus', 
      command: () => this.addChildNode()
    },
    { 
      label: '重新命名', 
      icon: 'pi pi-pencil', 
      command: () => this.renameNode() 
    },
    { 
      label: '刪除', 
      icon: 'pi pi-trash', 
      command: () => this.deleteNode() 
    }
  ];

  constructor() {
    // 監聽節點數量變化
    this.treeNodes$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(nodes => {
      const count = this.countAllNodes(nodes);
      this.stateService.updateNodesCount(count);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 官方節點選擇事件
   */
  onNodeSelect(event: any): void {
    this.stateService.setSelectedNode(event.node as WorkspaceTreeNode);
  }

  /**
   * 官方節點取消選擇事件
   */
  onNodeUnselect(event: any): void {
    this.stateService.setSelectedNode(null);
  }

  /**
   * 官方拖放事件
   */
  onNodeDrop(event: any): void {
    if (!event.dragNode?.data) return;
    
    const dragNodeData = event.dragNode.data as WorkspaceNode;
    const newParentId = event.dropNode?.data?.id || null;
    
    if (dragNodeData.parentId === newParentId) return;
    
    this.dataService.updateNodeParent(dragNodeData.id, newParentId);
  }

  /**
   * 新增根節點
   */
  addNode(): void {
    const newNode: Omit<WorkspaceNode, 'id'> = {
      name: '新節點',
      type: 'folder',
      status: 'active',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.dataService.addNode(newNode);
  }

  /**
   * 新增子節點
   */
  addChildNode(): void {
    const selectedNode = this.stateService.selectedNode$.value;
    const parentId = selectedNode?.data?.id || null;
    
    const newNode: Omit<WorkspaceNode, 'id'> = {
      name: '新子節點',
      type: 'folder',
      status: 'active',
      parentId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.dataService.addNode(newNode);
  }

  /**
   * 重新命名節點
   */
  renameNode(): void {
    const selectedNode = this.stateService.selectedNode$.value;
    if (!selectedNode?.data) return;
    
    const newName = prompt('輸入新名稱', selectedNode.data.name);
    if (newName && newName.trim()) {
      this.dataService.updateNodeName(selectedNode.data.id, newName.trim());
    }
  }

  /**
   * 刪除節點
   */
  deleteNode(): void {
    const selectedNode = this.stateService.selectedNode$.value;
    if (!selectedNode?.data) return;
    
    if (confirm(`確定要刪除「${selectedNode.data.name}」嗎？`)) {
      this.dataService.deleteNode(selectedNode.data.id);
      this.stateService.setSelectedNode(null);
    }
  }

  /**
   * 計算所有節點數量
   */
  private countAllNodes(nodes: WorkspaceTreeNode[]): number {
    return nodes.reduce((count, node) => {
      return count + 1 + (node.children ? this.countAllNodes(node.children) : 0);
    }, 0);
  }
}
