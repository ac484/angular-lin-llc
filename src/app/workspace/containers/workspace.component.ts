import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import type { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { SharedTreetableComponent } from '../components/treetable/treetable.component';
import { TreeNode } from 'primeng/api';
import { isPlatformBrowser } from '@angular/common';
import { inject } from '@angular/core';
import { WorkspaceNode, NodeType } from '../../core/models/workspace.types';
import { WorkspaceMenubarComponent } from '../components/menubar/menubar.component';
import { WorkspaceDockComponent } from '../components/dock/dock.component';
import { WorkspaceTreeComponent } from '../components/tree/tree.component';
import { Router } from '@angular/router';
import { WorkspaceContextMenuComponent } from '../components/contextmenu/contextmenu.component';
import { WorkspaceDataService } from '../services/workspace-data.service';
import { WorkspaceStateService } from '../services/workspace-state.service';
import { MENUBAR_ITEMS, DOCK_ITEMS, DOCK_CONTEXT_MENU_ITEMS } from '../config/workspace-menu.config';
import { Observable } from 'rxjs';
import { ProgressspinnerComponent } from '../../shared/progressspinner/progressspinner.component';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, MenubarModule, SharedTreetableComponent, WorkspaceMenubarComponent, WorkspaceDockComponent, WorkspaceTreeComponent, WorkspaceContextMenuComponent, ProgressspinnerComponent, TreeModule],
  template: `
    <app-progressspinner *ngIf="isLoading" [style]="{width: '48px', height: '48px', margin: '2rem auto', display: 'block'}"></app-progressspinner>
    <div *ngIf="!isLoading" class="workspace-content">
      <div style="margin-bottom: 1rem;">
        <label>工作空間：</label>
        <select [(ngModel)]="workspaceId" (change)="onWorkspaceChange($event)">
          <option *ngFor="let ws of workspaceList" [value]="ws.id">{{ ws.name }}</option>
        </select>
      </div>
      <app-workspace-menubar [model]="menubarItems"></app-workspace-menubar>
      <div (contextmenu)="onDockContextMenu($event)">
        <app-workspace-dock *ngIf="isBrowser"
          [model]="dockItems"
          [position]="'bottom'"
          [breakpoint]="'960px'">
        </app-workspace-dock>
        <app-workspace-contextmenu
          #dockContextMenu
          [model]="dockContextMenuItems">
        </app-workspace-contextmenu>
      </div>
      <div *ngIf="(state.showTreeTable$ | async)" style="margin-top: 1rem;">
        <app-shared-treetable [value]="(state.treeTableData$ | async) || []"></app-shared-treetable>
      </div>
      <div *ngIf="(state.showTree$ | async)" style="margin-top: 1rem;">
        <app-workspace-tree
          [nodes]="(state.treeData$ | async) || []"
          [(selectedNode)]="selectedTreeNode"
          (action)="onTreeAction($event)"
        ></app-workspace-tree>
      </div>
    </div>
  `
})
export class WorkspaceComponent {
  isBrowser: boolean;
  isLoading = true;
  menubarItems: MenuItem[] = [];
  dockItems: MenuItem[] = [];
  dockContextMenuItems: MenuItem[] = [];
  selectedTreeNode: TreeNode<any> | null = null;
  @ViewChild('dockContextMenu') dockContextMenu?: WorkspaceContextMenuComponent;
  workspaceId = '';
  workspaceNodes: WorkspaceNode[] = [];
  workspaceList: { id: string, name: string }[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    public data: WorkspaceDataService,
    public state: WorkspaceStateService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadWorkspaceList();
    }
    // 產生 menubarItems，根據 label 與 id 動態加上 command
    this.menubarItems = MENUBAR_ITEMS.map(item => ({
      ...item,
      items: item.items?.map(sub => ({
        ...sub,
        command: () => this.onMenubarCreate(sub.id!)
      }))
    }));
    // 產生 dockItems
    this.dockItems = DOCK_ITEMS.map(item => ({
      ...item,
      command: this.getDockCommand(item.label)
    }));
    // 產生 dockContextMenuItems
    this.dockContextMenuItems = DOCK_CONTEXT_MENU_ITEMS.map(item => ({
      ...item,
      command: this.getDockContextMenuCommand(item.label)
    }));
  }

  ngOnInit() {}

  loadWorkspaceList() {
    this.data.listWorkspaces().subscribe(list => {
      this.workspaceList = list;
      if (list.length > 0) {
        this.workspaceId = list[0].id;
        this.loadWorkspaceTree();
      }
      this.isLoading = false;
    });
  }

  onWorkspaceChange(event: any) {
    this.loadWorkspaceTree();
  }

  loadWorkspaceTree() {
    if (!this.isBrowser || !this.workspaceId) return;
    this.isLoading = true;
    this.data.loadWorkspaceTree(this.workspaceId).subscribe(nodes => {
      this.workspaceNodes = nodes ?? [];
      const tree = this.buildTree(this.workspaceNodes);
      this.state.treeTableData$.next(tree);
      this.state.treeData$.next(tree);
      this.isLoading = false;
    });
  }

  saveWorkspaceTree() {
    if (!this.isBrowser || !this.workspaceId) return;
    this.data.saveWorkspaceTree(this.workspaceId, this.workspaceNodes).then(() => this.loadWorkspaceTree());
  }

  addWorkspace(parentNode?: any) {
    const node: WorkspaceNode = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      name: '新節點 ' + new Date().toLocaleTimeString(),
      type: 'custom',
      nodeTypeId: 'custom',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: parentNode?.data?.id ?? null
    };
    this.workspaceNodes.push(node);
    this.saveWorkspaceTree();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  onDockContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.dockContextMenu?.show(event);
  }

  // 根據 label 回傳對應的 command function
  getMenubarCommand(label?: string) {
    switch (label) {
      case '開啟': return () => this.loadWorkspaceTree();
      case '重新載入': return () => this.loadWorkspaceTree();
      case '讀取工作空間': return () => this.loadWorkspaceTree();
      case '新增工作空間': return () => this.addWorkspace();
      case '建立節點': return () => this.createRootWorkspace();
      default: return undefined;
    }
  }
  getDockCommand(label?: string) {
    switch (label) {
      case 'Home': return () => this.goHome();
      case 'Tree': return () => this.toggleTree();
      case 'TreeTable': return () => this.toggleTreeTable();
      default: return undefined;
    }
  }
  getDockContextMenuCommand(label?: string) {
    switch (label) {
      case '重新整理': return () => this.loadWorkspaceTree();
      case '回首頁': return () => this.goHome();
      default: return undefined;
    }
  }

  onTreeAction(event: { type: string, node: any }) {
    switch (event.type) {
      case 'add':
        this.addWorkspace(event.node);
        break;
      case 'addTask':
        this.addTaskToNode(event.node);
        break;
      case 'task':
        // TODO: 建立任務
        break;
      case 'rename':
        // TODO: 重新命名
        break;
      case 'delete':
        // TODO: 刪除
        break;
      case 'detail':
        // TODO: 查看詳細
        break;
      case 'expandAll':
        // TODO: 展開全部
        break;
      case 'collapseAll':
        // TODO: 收合全部
        break;
    }
  }

  // 若原本有 buildTree 方法，保留一份本地 buildTree 實作
  buildTree(nodes: WorkspaceNode[], parentId: string | null = null): TreeNode<WorkspaceNode>[] {
    return nodes
      .filter(node => (node.parentId ?? null) === parentId || (node.parentId === '' && parentId === null))
      .map(node => ({
        label: node.name,
        data: node,
        children: this.buildTree(nodes, node.id),
        leaf: !nodes.some(n => n.parentId === node.id)
      }));
  }

  toggleTreeTable() {
    this.state.showTreeTable$.next(!this.state.showTreeTable$.value);
  }

  toggleTree() {
    this.state.showTree$.next(!this.state.showTree$.value);
    this.state.treeData$.next(this.state.treeTableData$.value);
  }

  createRootWorkspace() {
    const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
    const name = '主節點-' + Math.floor(Math.random() * 10000);
    const rootNode = {
      id: id,
      name: name,
      type: 'root',
      nodeTypeId: 'root',
      status: 'active' as 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: null,
      children: [] as WorkspaceNode[]
    };
    // 新增一個 workspace 文件
    this.data.saveWorkspaceTree(id, [rootNode]).then(() => {
      this.loadWorkspaceList();
      setTimeout(() => {
        this.workspaceId = id;
        this.loadWorkspaceTree();
      }, 300);
    });
  }

  addTaskToNode(node: any) {
    const taskId = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
    const task = {
      id: taskId,
      nodeId: node.data.id,
      title: '任務-' + Math.floor(Math.random() * 10000),
      status: 'pending' as const,
      progress: 0,
      assigneeId: '',
      reviewerId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.workspaceNodes = this.data.addTaskToNode(this.workspaceNodes, node.data.id, task);
    this.saveWorkspaceTree();
  }

  onMenubarCreate(typeId: string) {
    if (typeId === 'task') {
      // 建立任務（主節點下）
      if (this.workspaceNodes.length > 0) {
        this.addTaskToNode({ data: this.workspaceNodes[0] });
      }
      return;
    }
    // 建立指定型別節點（主節點）
    const node: WorkspaceNode = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      name: `${typeId} 節點 - ` + new Date().toLocaleTimeString(),
      type: typeId,
      nodeTypeId: typeId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: null
    };
    this.workspaceNodes.push(node);
    this.saveWorkspaceTree();
  }
} 