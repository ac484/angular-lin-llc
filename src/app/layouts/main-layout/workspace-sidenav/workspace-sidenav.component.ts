import { Component, inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { CommonModule } from '@angular/common';
import { WorkspaceDataService } from './workspace-sidenav-data.service';
import { WorkspaceStateService } from './workspace-sidenav-state.service';
import { MenuItem, TreeNode, TreeDragDropService, MessageService } from 'primeng/api';
import { WorkspaceTreeNode, WorkspaceNode } from './workspace-sidenav.types';
import { Observable, Subject, takeUntil, map } from 'rxjs';

@Component({
  selector: 'app-workspace-sidenav',
  templateUrl: './workspace-sidenav.component.html',
  styleUrls: ['./workspace-sidenav.component.scss'],
  standalone: true,
  imports: [CommonModule, SidenavComponent, ...PrimeNgModules],
  providers: [TreeDragDropService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceSidenavComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly dataService = inject(WorkspaceDataService);
  private readonly stateService = inject(WorkspaceStateService);
  private readonly messageService = inject(MessageService);

  // 樹狀資料
  readonly treeNodes$ = this.dataService.loadTree();
  readonly selectedNode$ = this.stateService.selectedNode$;
  readonly treeConfig$ = this.stateService.treeConfig$;
  
  // 扁平節點列表 - 用於循環引用檢查
  private allNodes: WorkspaceNode[] = [];

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
    // 監聽節點變化並緩存扁平列表
    this.dataService.loadNodes().pipe(
      takeUntil(this.destroy$)
    ).subscribe(nodes => {
      this.allNodes = nodes;
      this.stateService.updateNodesCount(nodes.length);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 極簡拖放實現 - 將拖拽節點變成目標節點的子節點
   */
  onNodeDrop(event: any): void {
    const dragNode = event.dragNode?.data as WorkspaceNode;
    const dropNode = event.dropNode?.data as WorkspaceNode;
    
    if (!dragNode) return;
    
    const newParentId = dropNode?.id || null;
    
    // 防止無意義移動和循環引用
    if (dragNode.parentId === newParentId || 
        this.wouldCreateCycle(dragNode.id, newParentId)) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: '移動失敗', 
        detail: '無法移動到此位置' 
      });
      return;
    }
    
    this.dataService.updateNodeParent(dragNode.id, newParentId);
    this.messageService.add({ 
      severity: 'success', 
      summary: '節點已移動', 
      detail: `「${dragNode.name}」已移動到「${dropNode?.name || '根目錄'}」` 
    });
  }

  /**
   * 檢查是否會造成循環引用 - 最簡實現
   */
  private wouldCreateCycle(nodeId: string, newParentId: string | null): boolean {
    if (!newParentId) return false;
    if (nodeId === newParentId) return true;
    
    // 檢查新父節點是否為當前節點的後代
    const isDescendant = (checkId: string): boolean => {
      const node = this.allNodes.find(n => n.id === checkId);
      if (!node?.parentId) return false;
      if (node.parentId === nodeId) return true;
      return isDescendant(node.parentId);
    };
    
    return isDescendant(newParentId);
  }

  onNodeSelect(event: any): void {
    this.stateService.setSelectedNode(event.node as WorkspaceTreeNode);
    this.messageService.add({ 
      severity: 'info', 
      summary: '節點已選擇', 
      detail: event.node.label 
    });
  }

  onNodeUnselect(event: any): void {
    this.stateService.setSelectedNode(null);
    this.messageService.add({ 
      severity: 'info', 
      summary: '節點已取消選擇', 
      detail: event.node.label 
    });
  }

  onNodeExpand(event: any): void {
    this.messageService.add({ 
      severity: 'success', 
      summary: '節點已展開', 
      detail: event.node.label 
    });
  }

  onNodeCollapse(event: any): void {
    this.messageService.add({ 
      severity: 'warn', 
      summary: '節點已收合', 
      detail: event.node.label 
    });
  }

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
    this.messageService.add({ 
      severity: 'success', 
      summary: '節點已新增', 
      detail: '新節點已建立' 
    });
  }

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
    this.messageService.add({ 
      severity: 'success', 
      summary: '子節點已新增', 
      detail: selectedNode ? `在「${selectedNode.data?.name}」下新增子節點` : '新增根節點' 
    });
  }

  renameNode(): void {
    const selectedNode = this.stateService.selectedNode$.value;
    if (!selectedNode?.data) return;
    
    const newName = prompt('輸入新名稱', selectedNode.data.name);
    if (newName && newName.trim()) {
      this.dataService.updateNodeName(selectedNode.data.id, newName.trim());
      this.messageService.add({ 
        severity: 'success', 
        summary: '節點已重新命名', 
        detail: `重新命名為「${newName.trim()}」` 
      });
    }
  }

  deleteNode(): void {
    const selectedNode = this.stateService.selectedNode$.value;
    if (!selectedNode?.data) return;
    
    if (confirm(`確定要刪除「${selectedNode.data.name}」嗎？`)) {
      this.dataService.deleteNode(selectedNode.data.id);
      this.stateService.setSelectedNode(null);
      this.messageService.add({ 
        severity: 'error', 
        summary: '節點已刪除', 
        detail: `「${selectedNode.data.name}」已被刪除` 
      });
    }
  }

  expandAll(): void {
    this.messageService.add({ 
      severity: 'info', 
      summary: '展開所有節點', 
      detail: '所有節點已展開' 
    });
  }

  collapseAll(): void {
    this.messageService.add({ 
      severity: 'info', 
      summary: '收合所有節點', 
      detail: '所有節點已收合' 
    });
  }
}