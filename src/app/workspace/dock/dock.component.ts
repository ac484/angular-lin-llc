import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem, TreeNode, MessageService } from 'primeng/api';
import { SharedTreetableComponent } from './treetable/treetable.component';
import { WorkspaceDataService } from './services/dock-data.service';
import { WorkspaceStateService } from './services/dock-state.service';
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
        command: () => { this.state.showTreeTable$.next(true); }
      }
    ];

    this.menubarItems = [
      { label: 'File', items: [
        { label: '建立根結點', icon: 'pi pi-fw pi-plus', command: () => this.addWorkspace(undefined, 'root') },
        { label: 'Delete', icon: 'pi pi-fw pi-trash' },
        { separator: true },
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
} 