import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem, TreeNode, MessageService } from 'primeng/api';
import { SharedTreetableComponent } from './treetable/treetable.component';
import { WorkspaceDataService } from './services/dock-data.service';
import { WorkspaceStateService } from './services/dock-state.service';
import { MENUBAR_ITEMS, DOCK_ITEMS } from './config/dock-menu.config';
import { WorkspaceNode, Task } from './models/workspace.types';
import { MenubarModule } from 'primeng/menubar';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-workspace-dock',
  standalone: true,
  imports: [CommonModule, DockModule, TooltipModule, MenubarModule, SharedTreetableComponent, DialogModule, ToastModule, GalleriaModule],
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss'],
  providers: [MessageService]
})
export class WorkspaceDockComponent implements OnInit {
  dockItems: MenuItem[] = [];
  menubarItems: MenuItem[] = [];
  responsiveOptions: any[] = [];
  displayFinder = false;
  displayTerminal = false;
  displayGalleria = false;
  images: any[] = [];
  nodes: any[] = [];

  constructor(
    public data: WorkspaceDataService,
    public state: WorkspaceStateService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.dockItems = [
      {
        label: 'Finder',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/finder.svg',
        tooltipOptions: { tooltipLabel: 'Finder', tooltipPosition: 'top' },
        command: () => { this.displayFinder = true; }
      },
      {
        label: 'Terminal',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/terminal.svg',
        tooltipOptions: { tooltipLabel: 'Terminal', tooltipPosition: 'top' },
        command: () => { this.displayTerminal = true; }
      },
      {
        label: 'App Store',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/appstore.svg',
        tooltipOptions: { tooltipLabel: 'App Store', tooltipPosition: 'top' },
        command: () => {
          this.messageService.add({ severity: 'error', summary: 'An unexpected error occurred while signing in.', detail: 'UNTRUSTED_CERT_TITLE', key: 'tc' });
        }
      },
      {
        label: 'Safari',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/safari.svg',
        tooltipOptions: { tooltipLabel: 'Safari', tooltipPosition: 'top' },
        command: () => {
          this.messageService.add({ severity: 'warn', summary: 'Safari has stopped working', key: 'tc' });
        }
      },
      {
        label: 'Photos',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/photos.svg',
        tooltipOptions: { tooltipLabel: 'Photos', tooltipPosition: 'top' },
        command: () => { this.displayGalleria = true; }
      },
      {
        label: 'GitHub',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/github.svg',
        tooltipOptions: { tooltipLabel: 'GitHub', tooltipPosition: 'top' }
      },
      {
        label: 'Trash',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png',
        tooltipOptions: { tooltipLabel: 'Trash', tooltipPosition: 'top' },
        command: () => {
          this.messageService.add({ severity: 'info', summary: 'Empty Trash', key: 'tc' });
        }
      }
    ];

    this.menubarItems = [
      { label: 'Finder' },
      { label: 'File', items: [
        { label: 'New', icon: 'pi pi-fw pi-plus', items: [
          { label: 'Bookmark', icon: 'pi pi-fw pi-bookmark' },
          { label: 'Video', icon: 'pi pi-fw pi-video' }
        ]},
        { label: 'Delete', icon: 'pi pi-fw pi-trash' },
        { separator: true },
        { label: 'Export', icon: 'pi pi-fw pi-external-link' }
      ]},
      { label: 'Edit', items: [
        { label: 'Left', icon: 'pi pi-fw pi-align-left' },
        { label: 'Right', icon: 'pi pi-fw pi-align-right' },
        { label: 'Center', icon: 'pi pi-fw pi-align-center' },
        { label: 'Justify', icon: 'pi pi-fw pi-align-justify' }
      ]},
      { label: 'Users', items: [
        { label: 'New', icon: 'pi pi-fw pi-user-plus' },
        { label: 'Delete', icon: 'pi pi-fw pi-user-minus' },
        { label: 'Search', icon: 'pi pi-fw pi-users', items: [
          { label: 'Filter', icon: 'pi pi-fw pi-filter', items: [
            { label: 'Print', icon: 'pi pi-fw pi-print' }
          ]},
          { icon: 'pi pi-fw pi-bars', label: 'List' }
        ]}
      ]},
      { label: 'Events', items: [
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', items: [
          { label: 'Save', icon: 'pi pi-fw pi-calendar-plus' },
          { label: 'Delete', icon: 'pi pi-fw pi-calendar-minus' }
        ]},
        { label: 'Archieve', icon: 'pi pi-fw pi-calendar-times', items: [
          { label: 'Remove', icon: 'pi pi-fw pi-calendar-minus' }
        ]}
      ]},
      { label: 'Quit', command: () => this.router.navigate(['/']) }
    ];

    this.responsiveOptions = [
      { breakpoint: '1024px', numVisible: 3 },
      { breakpoint: '768px', numVisible: 2 },
      { breakpoint: '560px', numVisible: 1 }
    ];

    this.loadNodes();
  }

  toggleTreeTable() {
    this.state.showTreeTable$.next(!this.state.showTreeTable$.value);
  }

  toggleTree() {
    this.state.showTree$.next(!this.state.showTree$.value);
    this.state.treeData$.next(this.state.treeTableData$.value);
  }

  loadWorkspaces() {
    this.data.loadWorkspaces().subscribe(data => {
      // 可根據需求處理 workspaces
      console.log('Firestore workspaces:', data);
    });
  }

  addWorkspace(parentNode?: any, typeOverride?: string) {
    let type = typeOverride || 'root';
    if (!typeOverride && (parentNode?.data?.type === 'root' || parentNode?.data?.type === 'branch')) {
      type = 'branch';
    }
    let name = '';
    if (type === 'root') name = '根結點';
    else if (type === 'branch') name = '枝節點';
    else if (type === 'leaf') name = '葉節點';
    else name = '新節點 ' + new Date().toLocaleTimeString();
    const node: WorkspaceNode = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      name,
      type,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: parentNode?.data?.id ?? null
    };
    this.data.addWorkspace(node).then(() => this.loadNodes());
  }

  loadNodes() {
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

  onDockContextMenu(event: MouseEvent) {
    event.preventDefault();
    // 直接用 <p-contextMenu> 原生 API，或於 HTML 綁定 #dockContextMenuRef
  }

  // 根據 label 回傳對應的 command function
  getMenubarCommand(label?: string) {
    switch (label) {
      case '開啟': return () => this.loadWorkspaces();
      case '重新載入': return () => this.loadNodes();
      case '讀取工作空間': return () => this.loadWorkspaces();
      case '建立根結點': return () => this.addWorkspace(undefined, 'root');
      default: return undefined;
    }
  }
  getDockCommand(label?: string) {
    switch (label) {
      case 'Tree': return () => this.toggleTree();
      case 'TreeTable': return () => this.openTreeTable();
      case 'Home': return () => this.goHome();
      default: return undefined;
    }
  }

  openTreeTable() {
    this.state.showTreeTable$.next(true);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  addTaskToNode(node: WorkspaceNode) {
    if (!node) return;
    const newTask: Task = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      nodeId: node.id,
      title: '新任務 ' + new Date().toLocaleTimeString(),
      status: 'pending',
      progress: 0,
      assigneeId: '',
      reviewerId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const tasks = Array.isArray(node.tasks) ? [...node.tasks, newTask] : [newTask];
    this.data.updateNodeTasks(node.id, tasks).then(() => this.loadNodes());
  }
} 