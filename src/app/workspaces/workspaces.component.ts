import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ToastModule } from 'primeng/toast';
import { TreeNode } from 'primeng/api';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-workspaces',
  standalone: true,
  imports: [CommonModule, SplitterModule, MenubarModule, TreeModule, ContextMenuModule, ToastModule, TimelineModule],
  template: `
    <p-splitter [panelSizes]="[20, 80]" style="height: 100vh;">
      <ng-template #panel>
        <div class="panel left" style="display: flex; flex-direction: column; height: 100%; gap: 1rem;">
          <p-menubar [model]="menuItems"></p-menubar>
          <div style="flex: 1; overflow: auto; display: flex; flex-direction: column; gap: 1rem;">
            <!-- 標準樹 -->
            <p-tree [value]="files" styleClass="w-full md:w-[30rem]" [draggableNodes]="true" [droppableNodes]="true" draggableScope="self" droppableScope="self"></p-tree>
            <!-- 單選+右鍵選單 -->
            <p-tree [value]="files" styleClass="w-full md:w-[30rem]" selectionMode="single" [(selection)]="selectedFile" [contextMenu]="cm"></p-tree>
            <p-contextmenu #cm [model]="items"></p-contextmenu>
            <p-toast></p-toast>
            <!-- 樹狀過濾 -->
            <p-tree [value]="files" styleClass="w-full md:w-[30rem]" [filter]="true" filterPlaceholder="Lenient Filter"></p-tree>
            <p-tree [value]="files2" styleClass="w-full md:w-[30rem]" [filter]="true" filterMode="strict" filterPlaceholder="Strict Filter"></p-tree>
            <!-- 自訂模板樹 -->
            <p-tree [value]="nodes" styleClass="w-full md:w-[30rem]">
              <ng-template let-node pTemplate="url">
                <a [href]="node.data" target="_blank" rel="noopener noreferrer" class="text-surface-700 dark:text-surface-100 hover:text-primary">
                  {{ node.label }}
                </a>
              </ng-template>
              <ng-template let-node pTemplate="default">
                <b>{{ node.label }}</b>
              </ng-template>
            </p-tree>
            <!-- 虛擬滾動/懶加載樹 -->
            <p-tree [value]="virtualNodes" [virtualScroll]="true" [virtualScrollItemSize]="40" [lazy]="true" (onLazyLoad)="loadVirtualNodes($event)" styleClass="w-full md:w-[30rem]" [scrollHeight]="'400px'"></p-tree>
          </div>
        </div>
      </ng-template>
      <ng-template #panel>
        <p-splitter [panelSizes]="[87.5, 12.5]" style="height: 100%;">
          <ng-template #panel>
            <div class="panel center">中間</div>
          </ng-template>
          <ng-template #panel>
            <div class="panel right" style="width: 100%; height: 100%; overflow-y: auto;">
              <p-timeline [value]="timelineItems" align="alternate">
                <ng-template pTemplate="content" let-item>
                  <div>
                    <b>{{ item.label }}</b><br />
                    <small>{{ item.key }}</small>
                  </div>
                </ng-template>
              </p-timeline>
            </div>
          </ng-template>
        </p-splitter>
      </ng-template>
    </p-splitter>
  `,
  styles: [
    `.panel {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      background: var(--surface-card);
      color: var(--text-color);
      border-radius: var(--border-radius);
      box-shadow: none;
    }
    .panel.right {
      font-size: 0.85rem;
    }
    .panel.right b {
      font-size: 0.95em;
    }
    .panel.right small {
      font-size: 0.85em;
      color: var(--text-color-secondary);
    }
    `
  ]
})
export class WorkspacesComponent {
  menuItems = [
    { label: '檔案', items: [{ label: '新增' }, { label: '刪除' }] },
    { label: '編輯', items: [{ label: '複製' }, { label: '貼上' }] }
  ];
  files: TreeNode[] = [
    {
      label: '文件夾A', key: '1', children: [
        { label: '檔案A-1', key: '1-1' },
        { label: '檔案A-2', key: '1-2' },
        { label: '子資料夾A-3', key: '1-3', children: [
          { label: '檔案A-3-1', key: '1-3-1' },
          { label: '檔案A-3-2', key: '1-3-2' }
        ]}
      ]
    },
    {
      label: '文件夾B', key: '2', children: [
        { label: '檔案B-1', key: '2-1' },
        { label: '檔案B-2', key: '2-2' },
        { label: '檔案B-3', key: '2-3' },
        { label: '檔案B-4', key: '2-4' }
      ]
    },
    {
      label: '文件夾C', key: '3', children: [
        { label: '檔案C-1', key: '3-1' },
        { label: '檔案C-2', key: '3-2' },
        { label: '檔案C-3', key: '3-3' },
        { label: '檔案C-4', key: '3-4' },
        { label: '檔案C-5', key: '3-5' }
      ]
    },
    { label: '單一檔案', key: '4' },
    { label: '文件夾D', key: '5', children: [
      { label: '檔案D-1', key: '5-1' },
      { label: '檔案D-2', key: '5-2' },
      { label: '檔案D-3', key: '5-3' }
    ]}
  ];
  files2: TreeNode[] = [
    {
      label: '專案X', key: 'x', children: [
        { label: 'README.md', key: 'x-1' },
        { label: 'src', key: 'x-2', children: [
          { label: 'main.ts', key: 'x-2-1' },
          { label: 'app.module.ts', key: 'x-2-2' },
          { label: 'app.component.ts', key: 'x-2-3' }
        ]}
      ]
    },
    {
      label: '專案Y', key: 'y', children: [
        { label: 'index.html', key: 'y-1' },
        { label: 'style.css', key: 'y-2' },
        { label: 'main.js', key: 'y-3' }
      ]
    },
    { label: 'LICENSE', key: 'z' }
  ];
  nodes: TreeNode[] = [
    {
      label: 'Google', key: 'g', type: 'url', data: 'https://www.google.com', children: [
        { label: 'Gmail', key: 'g-1', type: 'url', data: 'https://mail.google.com' },
        { label: 'Maps', key: 'g-2', type: 'url', data: 'https://maps.google.com' }
      ]
    },
    {
      label: 'GitHub', key: 'gh', type: 'url', data: 'https://github.com', children: [
        { label: 'PrimeNG', key: 'gh-1', type: 'url', data: 'https://github.com/primefaces/primeng' },
        { label: 'Angular', key: 'gh-2', type: 'url', data: 'https://github.com/angular/angular' }
      ]
    },
    { label: '官方網站', key: 'p', type: 'url', data: 'https://primeng.org' }
  ];
  virtualNodes: TreeNode[] = [];
  selectedFile: TreeNode | null = null;
  items = [
    { label: '開啟', icon: 'pi pi-folder-open' },
    { label: '刪除', icon: 'pi pi-trash' }
  ];

  // 虛擬滾動/懶加載範例
  loadVirtualNodes(event: any) {
    this.virtualNodes = Array.from({ length: 1000 }, (_, i) => ({ label: 'Node ' + (i + 1), key: String(i + 1) }));
  }

  get timelineItems() {
    // 將 files2 tree 節點攤平成一維陣列
    const flat: any[] = [];
    const walk = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        flat.push({ label: n.label, key: n.key });
        if (n.children) walk(n.children);
      }
    };
    walk(this.files2);
    return flat;
  }
}
