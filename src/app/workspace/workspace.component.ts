import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import type { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, MenubarModule, DockModule, TooltipModule],
  template: `
    <p-menubar [model]="menubarItems">
      <ng-template #start><i class="pi pi-apple"></i></ng-template>
      <ng-template #end><span>Fri 13:07</span></ng-template>
    </p-menubar>

    <p-dock [model]="dockItems" position="bottom">
      <ng-template #item let-item>
        <img
          [pTooltip]="item.label"
          tooltipPosition="top"
          [src]="item.icon"
          [alt]="item.label"
          width="100%"
        />
      </ng-template>
    </p-dock>
  `
})
export class WorkspaceComponent {
  menubarItems: MenuItem[] = [
    { label: '檔案', icon: 'pi pi-file', items: [
      { label: '新增', icon: 'pi pi-plus' },
      { label: '開啟', icon: 'pi pi-folder-open' }
    ]},
    { label: '編輯', icon: 'pi pi-pencil', items: [
      { label: '剪下', icon: 'pi pi-cut' },
      { label: '複製', icon: 'pi pi-copy' }
    ]}
  ];

  dockItems: MenuItem[] = [
    { label: 'Finder', icon: '/assets/dock/finder.png' },
    { label: 'App Store', icon: '/assets/dock/appstore.png' },
    { label: 'Photos', icon: '/assets/dock/photos.png' },
    { label: 'Trash', icon: '/assets/dock/trash.png' }
  ];
} 