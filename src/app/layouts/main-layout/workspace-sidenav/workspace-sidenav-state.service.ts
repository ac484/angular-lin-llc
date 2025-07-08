import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WorkspaceTreeNode, TreeConfig } from './workspace-sidenav.types';

@Injectable({ providedIn: 'root' })
export class WorkspaceStateService {
  // 選中的節點
  selectedNode$ = new BehaviorSubject<WorkspaceTreeNode | null>(null);
  
  // 樹狀配置
  treeConfig$ = new BehaviorSubject<TreeConfig>({
    enableDragDrop: true,
    enableVirtualScroll: false,
    enableLazyLoad: false,
    virtualScrollItemSize: 46,
    scrollHeight: '250px'
  });

  // 節點數量（用於效能優化決策）
  nodesCount$ = new BehaviorSubject<number>(0);

  updateNodesCount(count: number): void {
    this.nodesCount$.next(count);
    
    // 自動調整效能設定
    const config = this.treeConfig$.value;
    this.treeConfig$.next({
      ...config,
      enableVirtualScroll: count > 1000,
      enableLazyLoad: count > 5000
    });
  }

  setSelectedNode(node: WorkspaceTreeNode | null): void {
    this.selectedNode$.next(node);
  }
}
