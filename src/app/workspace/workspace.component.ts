import { Component, OnInit, ChangeDetectionStrategy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FirebaseService } from '../core/services/firebase.service';
import type { WorkspaceNode } from '../core/models/workspace.types';
import { TreeModule } from 'primeng/tree';
import type { TreeNode, MenuItem } from 'primeng/api';
import { SplitterModule } from 'primeng/splitter';
import { DockModule } from 'primeng/dock';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { TerminalModule, TerminalService } from 'primeng/terminal';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    SplitterModule,
    TreeModule,
    DockModule,
    MenubarModule,
    TooltipModule,
    ToastModule,
    DialogModule,
    GalleriaModule,
    TerminalModule
  ],
  providers: [MessageService, TerminalService],
  template: `
    <p-menubar [model]="menubarItems">
      <ng-template #start>
        <i class="pi pi-apple px-2"></i>
      </ng-template>
      <ng-template #end>
        <i class="pi pi-video px-2"></i>
        <i class="pi pi-wifi px-2"></i>
        <i class="pi pi-volume-up px-2"></i>
        <span class="px-2">Fri 13:07</span>
        <i class="pi pi-search px-2"></i>
        <i class="pi pi-bars px-2"></i>
      </ng-template>
    </p-menubar>

    <div class="dock-window">
      <p-toast position="top-center" key="tc" />

      <p-dialog
        [(visible)]="displayFinder"
        [breakpoints]="{ '960px': '50vw' }"
        [style]="{ width: '30vw', height: '18rem' }"
        [draggable]="false"
        [resizable]="false"
        header="Finder"
      >
        <p-tree [value]="nodes" />
      </p-dialog>

      <p-dialog
        [maximizable]="true"
        [(visible)]="displayTerminal"
        [breakpoints]="{ '960px': '50vw' }"
        [style]="{ width: '30vw' }"
        [draggable]="false"
        [resizable]="false"
        header="Terminal"
      >
        <p-terminal welcomeMessage="Welcome to PrimeNG (cmd: 'date', 'greet {0}', 'random')" prompt="primeng $" />
      </p-dialog>

      <p-galleria
        [value]="images"
        [showThumbnails]="false"
        [showThumbnailNavigators]="false"
        [showItemNavigators]="true"
        [(visible)]="displayGalleria"
        [circular]="true"
        [responsiveOptions]="responsiveOptions"
        [fullScreen]="true"
        [containerStyle]="{ width: '400px' }"
      >
        <ng-template #item let-item>
          <img [src]="item.itemImageSrc" style="width: 100%; display: block;" />
        </ng-template>
      </p-galleria>

      <p-splitter [style]="{'height':'calc(100% - 72px)'}" layout="horizontal">
        <ng-template pSplitterPanel size="20">
          <p-tree [value]="nodes" selectionMode="single" [(selection)]="selectedNode" (onNodeSelect)="onNodeSelect($event)"></p-tree>
        </ng-template>
        <ng-template pSplitterPanel size="30">
          <div class="workspace-overview">
            <h3>快速統計</h3>
            <!-- TODO: 顯示快速統計卡片 -->
          </div>
        </ng-template>
        <ng-template pSplitterPanel size="50">
          <div class="workspace-detail">
            <h3>選取項目詳細資訊</h3>
            <!-- TODO: 顯示所選節點詳細資料 -->
          </div>
        </ng-template>
      </p-splitter>

      <p-dock *ngIf="isBrowser" [model]="dockItems" [position]="position">
        <ng-template #item let-item>
          <a [pTooltip]="item.label" tooltipPosition="top" class="p-dock-item-link" (click)="item.command()">
            <img [alt]="item.label" [src]="item.icon" style="width: 100%" />
          </a>
        </ng-template>
      </p-dock>
    </div>
  `,
  styles: [
    `
    /* 工作區通用樣式 */
    .workspace-container { height: 100vh; }
    .workspace-content { padding: 1rem; }
    .workspace-main { display: flex; gap: 1rem; }
    .workspace-overview { flex: 1; }
    .workspace-detail { flex: 2; }

    /* PrimeNG Menubar 樣式 */
    .p-menubar {
      background-color: #333;
      color: #fff;
      border: none;
      border-radius: 0;
      padding: 0.25rem 1rem;
    }
    .p-menubar .p-menuitem-link {
      color: #fff;
      padding: 0 0.75rem;
      font-size: 0.9rem;
    }
    .p-menubar .p-menuitem-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .p-menubar .pi {
      font-size: 1rem;
      margin-right: 0.5rem;
    }
    .p-menubar .p-menubar-end span {
      font-size: 0.9rem;
      margin-left: 0.5rem;
    }

    /* Dock 容器樣式 */
    .dock-window {
      position: relative;
      height: calc(100vh - 44px); /* Full height minus menubar height */
      overflow: hidden;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
    }

    .dock-window p-splitter {
      flex-grow: 1; /* Splitter takes up remaining vertical space */
    }

    .dock-window p-dock {
      position: relative;
      background-color: #222;
      padding: 0.75rem 1.5rem;
      border-top: 1px solid #555;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
      z-index: 1;
      flex-shrink: 0;
    }

    /* Dock items styling */
    .p-dock .p-dock-list {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .p-dock-item-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.2s ease-in-out;
      color: #fff;
      text-decoration: none;
      background-color: rgba(255, 255, 255, 0.05);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .p-dock-item-link:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .p-dock-item-link img {
      width: 48px;
      height: 48px;
      object-fit: contain;
      margin-bottom: 0.25rem;
    }

    .p-dock-item-text {
      font-size: 0.75rem;
      text-align: center;
    }

    /* Toast 樣式 */
    .dock-window p-toast {
      position: absolute;
      top: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: auto;
      max-width: 90%;
      z-index: 1000;
    }

    /* Dialog 樣式 */
    .dock-window p-dialog {
      z-index: 10000;
    }

    /* Galleria 樣式 */
    .dock-window p-galleria {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceComponent implements OnInit {
  nodes: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  menubarItems: MenuItem[] = [];
  dockItems: MenuItem[] = [];
  position: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
  displayFinder: boolean = false;
  displayTerminal: boolean = false;
  displayGalleria: boolean = false;
  images: any[] = [];
  responsiveOptions: any[] = [];
  isBrowser: boolean;

  constructor(
    private firebaseService: FirebaseService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadWorkspaceNodes();
    this.menubarItems = [
      {
        label: '檔案',
        icon: 'pi pi-fw pi-file',
        items: [
          { label: '新增', icon: 'pi pi-fw pi-plus' },
          { label: '開啟', icon: 'pi pi-fw pi-folder-open' },
          { separator: true },
          { label: '儲存', icon: 'pi pi-fw pi-save' }
        ]
      },
      {
        label: '編輯',
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: '剪下', icon: 'pi pi-fw pi-cut' },
          { label: '複製', icon: 'pi pi-fw pi-copy' },
          { label: '貼上', icon: 'pi pi-fw pi-paste' }
        ]
      },
      {
        label: '專案',
        icon: 'pi pi-fw pi-sitemap',
        items: [
          { label: '管理專案', icon: 'pi pi-fw pi-th-large' },
          { label: '新增專案', icon: 'pi pi-fw pi-plus' }
        ]
      },
      {
        label: '使用者',
        icon: 'pi pi-fw pi-user',
        items: [
          { label: '使用者管理', icon: 'pi pi-fw pi-users' },
          { label: '角色管理', icon: 'pi pi-fw pi-user-plus' }
        ]
      },
      {
        label: '設定',
        icon: 'pi pi-fw pi-cog',
        command: () => console.log('設定')
      }
    ];

    this.dockItems = [
      {
        label: '概覽',
        icon: 'assets/overview.png',
        command: () => {
          console.log('概覽');
        }
      },
      {
        label: '詳情',
        icon: 'assets/detail.png',
        command: () => {
          console.log('詳情');
        }
      },
      {
        label: 'Finder',
        icon: 'assets/dock/finder.png',
        command: () => this.displayFinder = true
      },
      {
        label: 'Terminal',
        icon: 'assets/dock/terminal.png',
        command: () => this.displayTerminal = true
      },
      {
        label: 'App Store',
        icon: 'assets/dock/appstore.png',
        command: () => this.messageService.add({severity:'success', summary:'App Store', detail:'App Store Clicked'})
      },
      {
        label: 'Safari',
        icon: 'assets/dock/safari.png',
        command: () => this.messageService.add({severity:'warn', summary:'Safari', detail:'Safari Clicked'})
      },
      {
        label: 'Photos',
        icon: 'assets/dock/photos.png',
        command: () => this.displayGalleria = true
      },
      {
        label: 'GitHub',
        icon: 'assets/dock/github.png',
        command: () => this.messageService.add({severity:'info', summary:'GitHub', detail:'GitHub Clicked'})
      },
      {
        label: '垃圾桶',
        icon: 'assets/dock/trash.png',
        command: () => this.messageService.add({severity:'error', summary:'垃圾桶', detail:'垃圾桶 Clicked'})
      }
    ];

    this.images = [
      { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg', alt: 'Description for Image 1', title: 'Title 1' },
      { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg', alt: 'Description for Image 2', title: 'Title 2' },
    ];

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
  }

  private async loadWorkspaceNodes(): Promise<void> {
    const rawNodes = await this.firebaseService.getDocuments<WorkspaceNode>('workspaceNodes');
    this.nodes = this.mapWorkspaceNodeToTreeNode(rawNodes);
  }

  private mapWorkspaceNodeToTreeNode(nodes: WorkspaceNode[]): TreeNode[] {
    return nodes.map(node => ({
      key: node.id,
      label: node.name,
      data: node,
      children: node.children ? this.mapWorkspaceNodeToTreeNode(node.children) : [],
      expanded: true
    }));
  }

  onNodeSelect(event: { node: TreeNode }): void {
    console.log('選擇節點:', event.node);
  }
} 