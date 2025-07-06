import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import type { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { SharedTreetableComponent } from '../components/treetable/treetable.component';
import { TreeNode } from 'primeng/api';
import { isPlatformBrowser } from '@angular/common';
import { inject } from '@angular/core';
import { WorkspaceNode } from '../../core/models/workspace.types';
import { WorkspaceMenubarComponent } from '../components/menubar/menubar.component';
import { WorkspaceDockComponent } from '../components/dock/dock.component';
import { WorkspaceTreeComponent } from '../components/tree/tree.component';
import { Router } from '@angular/router';
import { WorkspaceContextMenuComponent } from '../components/contextmenu/contextmenu.component';
import { WorkspaceDataService } from '../services/workspace-data.service';
import { WorkspaceStateService } from '../services/workspace-state.service';
import { MENUBAR_ITEMS, DOCK_ITEMS, DOCK_CONTEXT_MENU_ITEMS } from '../config/workspace-menu.config';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, MenubarModule, SharedTreetableComponent, WorkspaceMenubarComponent, WorkspaceDockComponent, WorkspaceTreeComponent, WorkspaceContextMenuComponent],
  template: `
    <app-workspace-menubar [model]="menubarItems"></app-workspace-menubar>
    <div (contextmenu)="onDockContextMenu($event)">
      <app-workspace-dock *ngIf="isBrowser"
        [model]="dockItems"
        [position]="'bottom'"
        [breakpoint]="'960px'"
        (addNode)="addNode()"
        (addTask)="addTask()"
        (dockRightClick)="onDockContextMenu($event)"></app-workspace-dock>
      <app-workspace-contextmenu
        *ngIf="showDockContextMenu"
        [model]="dockContextMenuItems"
        [target]="dockContextTarget">
      </app-workspace-contextmenu>
    </div>
    <div *ngIf="(state.showTreeTable$ | async)" style="margin-top: 1rem;">
      <app-shared-treetable [value]="(state.treeTableData$ | async) || []" [columns]="(state.treeTableColumns$ | async) || []"></app-shared-treetable>
    </div>
    <div *ngIf="(state.showTree$ | async)" style="margin-top: 1rem;">
      <app-workspace-tree
        [nodes]="(state.treeData$ | async) || []"
        (addChild)="addNode($event)"
        (nodeRightClick)="onTreeNodeRightClick($event)"></app-workspace-tree>
      <app-workspace-contextmenu
        *ngIf="showTreeContextMenu"
        [model]="treeContextMenuItems"
        [target]="treeContextTarget">
      </app-workspace-contextmenu>
    </div>
  `
})
export class WorkspaceComponent {
  isBrowser: boolean;
  menubarItems: MenuItem[] = [];
  dockItems: MenuItem[] = [];
  dockContextMenuItems: MenuItem[] = [];
  dockContextTarget: string | HTMLElement | undefined = undefined;
  showDockContextMenu = false;
  treeContextMenuItems: MenuItem[] = [];
  treeContextTarget: string | HTMLElement | undefined = undefined;
  showTreeContextMenu = false;
  @ViewChild('dockContextMenu') dockContextMenu?: WorkspaceContextMenuComponent;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    public data: WorkspaceDataService,
    public state: WorkspaceStateService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadNodes();
    }
    // 產生 menubarItems，根據 label 動態加上 command
    this.menubarItems = MENUBAR_ITEMS.map(item => ({
      ...item,
      items: item.items?.map(sub => ({
        ...sub,
        command: this.getMenubarCommand(sub.label)
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

  ngOnInit() {
    if (this.isBrowser) {
      this.dockContextTarget = document.body;
    }
  }

  toggleTreeTable() {
    this.state.showTreeTable$.next(!this.state.showTreeTable$.value);
  }

  toggleTree() {
    this.state.showTree$.next(!this.state.showTree$.value);
    this.state.treeData$.next(this.state.treeTableData$.value);
  }

  loadWorkspaces() {
    if (!this.isBrowser) return;
    this.data.loadWorkspaces().subscribe(data => {
      // 可根據需求處理 workspaces
      console.log('Firestore workspaces:', data);
    });
  }

  addWorkspace(parentNode?: any) {
    if (!this.isBrowser) return;
    const node: WorkspaceNode = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      name: '新節點 ' + new Date().toLocaleTimeString(),
      type: 'custom',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: parentNode?.data?.id ?? null
    };
    this.data.addWorkspace(node).then(() => this.loadNodes());
  }

  addNode(parentNode?: any) {
    if (!this.isBrowser) return;
    const node: WorkspaceNode = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      name: '新節點 ' + new Date().toLocaleTimeString(),
      type: 'custom',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: parentNode?.data?.id ?? null
    };
    this.data.addNode(node).then(() => this.loadNodes());
  }

  addTask(parentNode?: any) {
    if (!this.isBrowser) return;
    // 這裡可根據實際需求調整 task 結構
    const node: WorkspaceNode = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      name: '新任務 ' + new Date().toLocaleTimeString(),
      type: 'task',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: parentNode?.data?.id ?? null
    };
    this.data.addNode(node).then(() => this.loadNodes());
  }

  loadNodes() {
    if (!this.isBrowser) return;
    this.data.loadNodes().subscribe((data: WorkspaceNode[]) => {
      const nodes: WorkspaceNode[] = (data ?? []).map((item: WorkspaceNode) => {
        let createdAt: Date = new Date();
        let updatedAt: Date = new Date();
        if (item.createdAt instanceof Date) {
          createdAt = item.createdAt;
        } else if (item.createdAt && typeof (item.createdAt as any).toDate === 'function') {
          createdAt = (item.createdAt as any).toDate();
        }
        if (item.updatedAt instanceof Date) {
          updatedAt = item.updatedAt;
        } else if (item.updatedAt && typeof (item.updatedAt as any).toDate === 'function') {
          updatedAt = (item.updatedAt as any).toDate();
        }
        return { ...item, createdAt, updatedAt };
      });
      const tree = this.data.buildTree(nodes) ?? [];
      this.state.treeTableData$.next(tree);
      this.state.treeData$.next(tree);
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  onDockContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.dockContextTarget = event.target as HTMLElement;
    this.showDockContextMenu = true;
    setTimeout(() => this.showDockContextMenu = false, 2000); // 自動隱藏，可依需求調整
  }

  onTreeNodeRightClick({ event, node }: { event: MouseEvent, node: any }) {
    event.preventDefault();
    this.treeContextTarget = event.target as HTMLElement;
    this.treeContextMenuItems = [
      {
        label: '建立子節點',
        icon: 'pi pi-plus',
        command: () => this.addNode(node)
      },
      {
        label: '建立任務',
        icon: 'pi pi-tasks',
        command: () => this.addTask(node)
      }
    ];
    this.showTreeContextMenu = true;
    setTimeout(() => this.showTreeContextMenu = false, 2000); // 自動隱藏，可依需求調整
  }

  // 根據 label 回傳對應的 command function
  getMenubarCommand(label?: string) {
    switch (label) {
      case '新增': return () => this.addNode();
      case '開啟': return () => this.loadWorkspaces();
      case '重新載入': return () => this.loadNodes();
      case '讀取工作空間': return () => this.loadWorkspaces();
      case '新增工作空間': return () => this.addWorkspace();
      case '建立節點': return () => this.addNode();
      default: return undefined;
    }
  }
  getDockCommand(label?: string) {
    switch (label) {
      case 'Finder': return () => this.goHome();
      case 'Tree': return () => this.toggleTree();
      case 'TreeTable': return () => this.toggleTreeTable();
      default: return undefined;
    }
  }
  getDockContextMenuCommand(label?: string) {
    switch (label) {
      case '重新整理': return () => this.loadNodes();
      case '回首頁': return () => this.goHome();
      default: return undefined;
    }
  }
} 