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
import { menubarItems, dockItems, dockContextMenuItems } from '../config/workspace-menu.config';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, MenubarModule, SharedTreetableComponent, WorkspaceMenubarComponent, WorkspaceDockComponent, WorkspaceTreeComponent, WorkspaceContextMenuComponent],
  template: `
    <app-workspace-menubar [model]="menubarItems"></app-workspace-menubar>
    <div (contextmenu)="onDockContextMenu($event)">
      <app-workspace-dock *ngIf="isBrowser" [model]="dockItems" [position]="'bottom'" [breakpoint]="'960px'" (addNode)="addNode()" (addTask)="addTask()"></app-workspace-dock>
      <app-workspace-contextmenu
        #dockContextMenu
        [model]="dockContextMenuItems"
        [target]="dockContextTarget">
      </app-workspace-contextmenu>
    </div>
    <div *ngIf="(state.showTreeTable$ | async)" style="margin-top: 1rem;">
      <app-shared-treetable [value]="(state.treeTableData$ | async) || []" [columns]="(state.treeTableColumns$ | async) || []"></app-shared-treetable>
    </div>
    <div *ngIf="(state.showTree$ | async)" style="margin-top: 1rem;">
      <app-workspace-tree [nodes]="(state.treeData$ | async) || []" (addChild)="addNode($event)"></app-workspace-tree>
    </div>
  `
})
export class WorkspaceComponent {
  isBrowser: boolean;
  menubarItems: MenuItem[] = [];
  dockItems: MenuItem[] = [];
  dockContextMenuItems: MenuItem[] = [];
  dockContextTarget: string | HTMLElement | undefined = undefined;
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
    // 產生 menubarItems，command 用箭頭函式包裝
    this.menubarItems = [
      {
        label: '檔案',
        icon: 'pi pi-file',
        items: [
          { label: '新增', icon: 'pi pi-plus', command: () => this.addNode() },
          { label: '開啟', icon: 'pi pi-folder-open', command: () => this.loadWorkspaces() },
          { label: '重新載入', icon: 'pi pi-refresh', command: () => this.loadNodes() },
          { label: '讀取工作空間', icon: 'pi pi-database', command: () => this.loadWorkspaces() },
          { label: '新增工作空間', icon: 'pi pi-plus-circle', command: () => this.addWorkspace() }
        ]
      },
      {
        label: '編輯',
        icon: 'pi pi-pencil',
        items: [
          { label: '剪下', icon: 'pi pi-cut' },
          { label: '複製', icon: 'pi pi-copy' }
        ]
      },
      {
        label: '節點',
        icon: 'pi pi-sitemap',
        items: [
          { label: '建立節點', icon: 'pi pi-plus', command: () => this.addNode() }
        ]
      }
    ];
    // 產生 dockItems
    this.dockItems = [
      { label: 'Finder', icon: 'pi pi-home', command: () => this.goHome() },
      { label: 'Tree', icon: 'pi pi-th-large', command: () => this.toggleTree() },
      { label: 'TreeTable', icon: 'pi pi-sitemap', command: () => this.toggleTreeTable() },
      { label: 'Trash', icon: 'pi pi-trash' }
    ];
    // 產生 dockContextMenuItems
    this.dockContextMenuItems = [
      { label: '重新整理', icon: 'pi pi-refresh', command: () => this.loadNodes() },
      { label: '回首頁', icon: 'pi pi-home', command: () => this.goHome() }
    ];
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
    this.dockContextMenu?.show(event);
  }
} 