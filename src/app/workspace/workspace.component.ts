import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import type { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { SharedTreetableComponent } from './components/treetable/treetable.component';
import { TreeNode } from 'primeng/api';
import { isPlatformBrowser } from '@angular/common';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { WorkspaceNode } from '../core/models/workspace.types';
import { WorkspaceMenubarComponent } from './components/menubar/menubar.component';
import { WorkspaceDockComponent } from './components/dock/dock.component';
import { WorkspaceTreeComponent } from './components/tree/tree.component';
import { Router } from '@angular/router';
import { WorkspaceContextMenuComponent } from './components/contextmenu/contextmenu.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, MenubarModule, SharedTreetableComponent, WorkspaceMenubarComponent, WorkspaceDockComponent, WorkspaceTreeComponent, WorkspaceContextMenuComponent],
  template: `
    <app-workspace-menubar [model]="menubarItems"></app-workspace-menubar>
    <div (contextmenu)="onDockContextMenu($event)">
      <app-workspace-dock *ngIf="isBrowser" [model]="dockItems" [position]="'bottom'" [breakpoint]="'960px'"></app-workspace-dock>
      <app-workspace-contextmenu
        #dockContextMenu
        [model]="dockContextMenuItems"
        [target]="dockContextTarget">
      </app-workspace-contextmenu>
    </div>
    <div *ngIf="showTreeTable" style="margin-top: 1rem;">
      <app-shared-treetable [value]="treeTableData" [columns]="treeTableColumns"></app-shared-treetable>
    </div>
    <div *ngIf="showTree" style="margin-top: 1rem;">
      <app-workspace-tree [nodes]="treeData" (addChild)="addNode($event)"></app-workspace-tree>
    </div>
  `
})
export class WorkspaceComponent {
  isBrowser: boolean;
  firestore: Firestore;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.firestore = inject(Firestore);
    if (this.isBrowser) {
      this.loadNodes();
    }
  }

  menubarItems: MenuItem[] = [
    { label: '檔案', icon: 'pi pi-file', items: [
      { label: '新增', icon: 'pi pi-plus' },
      { label: '開啟', icon: 'pi pi-folder-open' },
      { label: '重新載入', icon: 'pi pi-refresh', command: () => this.loadNodes() },
      { label: '讀取專案', icon: 'pi pi-database', command: () => this.loadProjects() },
      { label: '新增專案', icon: 'pi pi-plus-circle', command: () => this.addProject() }
    ]},
    { label: '編輯', icon: 'pi pi-pencil', items: [
      { label: '剪下', icon: 'pi pi-cut' },
      { label: '複製', icon: 'pi pi-copy' }
    ]},
    {
      label: '節點', icon: 'pi pi-sitemap', items: [
        { label: '建立節點', icon: 'pi pi-plus', command: () => this.addNode() }
      ]
    }
  ];

  dockItems: MenuItem[] = [
    { label: 'Finder', icon: 'pi pi-home', command: () => this.goHome() },
    { label: 'Tree', icon: 'pi pi-th-large', command: () => this.toggleTree() },
    { label: 'TreeTable', icon: 'pi pi-sitemap', command: () => this.toggleTreeTable() },
    { label: 'Trash', icon: 'pi pi-trash' }
  ];

  showTreeTable = false;
  showTree = false;
  treeTableColumns = [
    { field: 'name', header: '名稱' },
    { field: 'type', header: '類型' },
    { field: 'status', header: '狀態' },
    { field: 'createdAt', header: '建立時間' }
  ];
  treeTableData: TreeNode<WorkspaceNode>[] = [];
  treeData: TreeNode<WorkspaceNode>[] = [];

  dockContextMenuItems = [
    { label: '重新整理', icon: 'pi pi-refresh', command: () => this.loadNodes() },
    { label: '回首頁', icon: 'pi pi-home', command: () => this.goHome() }
  ];
  dockContextTarget: string | HTMLElement | undefined = undefined;
  @ViewChild('dockContextMenu') dockContextMenu?: WorkspaceContextMenuComponent;

  ngOnInit() {
    if (this.isBrowser) {
      this.dockContextTarget = document.body;
    }
  }

  toggleTreeTable() {
    this.showTreeTable = !this.showTreeTable;
    console.log('toggleTreeTable called, showTreeTable:', this.showTreeTable);
    console.log('treeTableData:', this.treeTableData);
    console.log('treeTableColumns:', this.treeTableColumns);
  }

  toggleTree() {
    this.showTree = !this.showTree;
    console.log('toggleTree called, showTree:', this.showTree);
    this.treeData = this.treeTableData;
  }

  loadProjects() {
    if (!this.isBrowser) return;
    const col = collection(this.firestore, 'projects');
    collectionData(col).subscribe(data => {
      console.log('Firestore projects:', data);
    });
  }

  addProject() {
    if (!this.isBrowser) return;
    const col = collection(this.firestore, 'projects');
    addDoc(col, { name: '測試專案', created: new Date() }).then(docRef => {
      console.log('新增 Firestore project, id:', docRef.id);
    });
  }

  addNode(parentNode?: any) {
    if (!this.isBrowser) return;
    const col = collection(this.firestore, 'nodes');
    const node: WorkspaceNode = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      name: '新節點 ' + new Date().toLocaleTimeString(),
      type: 'custom',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: parentNode?.data?.id ?? null
    };
    addDoc(col, node).then(docRef => {
      console.log('已建立節點，id:', docRef.id, node);
      this.loadNodes();
    });
  }

  loadNodes() {
    if (!this.isBrowser) return;
    const col = collection(this.firestore, 'nodes');
    collectionData(col, { idField: 'id' }).subscribe((data: any[]) => {
      const nodes: WorkspaceNode[] = data.map(item => ({
        ...item,
        createdAt: item.createdAt instanceof Date ? item.createdAt : (item.createdAt?.toDate ? item.createdAt.toDate() : new Date()),
        updatedAt: item.updatedAt instanceof Date ? item.updatedAt : (item.updatedAt?.toDate ? item.updatedAt.toDate() : new Date())
      }));
      this.treeTableData = this.buildTree(nodes);
      this.treeData = this.treeTableData;
      console.log('載入 Firestore nodes:', this.treeTableData);
    });
  }

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

  goHome() {
    this.router.navigate(['/']);
  }

  onDockContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.dockContextMenu?.show(event);
  }
} 