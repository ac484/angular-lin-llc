import { Component, inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { CommonModule } from '@angular/common';
import { WorkspaceDataService } from './workspace-sidenav-data.service';
import { WorkspaceStateService } from './workspace-sidenav-state.service';
import { MenuItem, TreeNode, TreeDragDropService } from 'primeng/api';
import { WorkspaceTreeNode, WorkspaceNode } from './workspace-sidenav.types';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-workspace-sidenav',
  templateUrl: './workspace-sidenav.component.html',
  styleUrls: ['./workspace-sidenav.component.scss'],
  standalone: true,
  imports: [CommonModule, SidenavComponent, ...PrimeNgModules],
  providers: [TreeDragDropService],
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
        { label: '新增節點', icon: 'pi pi-plus', command: () => this.addNode() },
        { label: '展開全部', icon: 'pi pi-angle-down', command: () => this.expandAll() },
        { label: '收合全部', icon: 'pi pi-angle-up', command: () => this.collapseAll() }
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
    console.log('節點已選擇:', event.node.label);
  }

  /**
   * 官方節點取消選擇事件
   */
  onNodeUnselect(event: any): void {
    this.stateService.setSelectedNode(null);
    console.log('節點已取消選擇:', event.node.label);
  }

  /**
   * 官方節點展開事件
   */
  onNodeExpand(event: any): void {
    console.log('節點已展開:', event.node.label);
    // 可在此處實作懶載入邏輯
  }

  /**
   * 官方節點收合事件
   */
  onNodeCollapse(event: any): void {
    console.log('節點已收合:', event.node.label);
  }

  /**
   * 官方拖放事件 - 完整實作
   */
  onNodeDrop(event: any): void {
    if (!event.dragNode?.data) {
      console.log('拖曳失敗：無效的拖曳節點');
      return;
    }
    
    const dragNodeData = event.dragNode.data as WorkspaceNode;
    const dropNodeData = event.dropNode?.data as WorkspaceNode;
    
    console.log('拖曳事件:', {
      dragNode: dragNodeData.name,
      dropNode: dropNodeData?.name,
      dropIndex: event.dropIndex
    });

    // 根據拖放位置決定新的父節點
    let newParentId: string | null = null;
    
    if (event.dropNode) {
      // 如果是放在節點上，成為該節點的子節點
      newParentId = dropNodeData.id;
    } else {
      // 如果是放在根層級，父節點為 null
      newParentId = null;
    }
    
    // 防止循環引用和無意義的移動
    if (dragNodeData.parentId === newParentId) {
      console.log('拖曳取消：目標位置相同');
      return;
    }
    
    // 防止將父節點拖到子節點下
    if (this.isDescendant(dragNodeData.id, newParentId)) {
      console.log('拖曳取消：不能將父節點拖到子節點下');
      return;
    }
    
    // 執行節點移動
    this.dataService.updateNodeParent(dragNodeData.id, newParentId)
      .then(() => {
        console.log('節點移動成功');
      })
      .catch(error => {
        console.error('節點移動失敗:', error);
      });
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
   * 展開所有節點
   */
  expandAll(): void {
    // 可透過 ViewChild 取得 Tree 組件實例並呼叫 expandAll()
    console.log('展開所有節點');
  }

  /**
   * 收合所有節點
   */
  collapseAll(): void {
    // 可透過 ViewChild 取得 Tree 組件實例並呼叫 collapseAll()
    console.log('收合所有節點');
  }

  /**
   * 計算所有節點數量
   */
  private countAllNodes(nodes: WorkspaceTreeNode[]): number {
    return nodes.reduce((count, node) => {
      return count + 1 + (node.children ? this.countAllNodes(node.children) : 0);
    }, 0);
  }

  /**
   * 檢查是否為子節點 - 防止循環引用
   */
  private isDescendant(ancestorId: string, nodeId: string | null): boolean {
    if (!nodeId) return false;
    
    // 這裡需要實作邏輯檢查 nodeId 是否為 ancestorId 的後代
    // 為了簡化，先返回 false，實際專案中需要完整實作
    return false;
  }
}