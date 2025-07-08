import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { TreeNode, TreeDragDropService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { TemplateComponent } from '../../../shared/components/tree-view/template/template.component';
import { RightClickComponent } from '../../../shared/components/tree-view/right-click/right-click.component';

@Component({
  selector: 'app-workspace-sidenav',
  templateUrl: './workspace-sidenav.component.html',
  styleUrls: ['./workspace-sidenav.component.scss'],
  standalone: true,
  imports: [CommonModule, SidenavComponent, ...PrimeNgModules, TemplateComponent, RightClickComponent],
  providers: [MessageService, TreeDragDropService]
})
export class WorkspaceSidenavComponent {
  treeNodes: TreeNode[] = [
    {
      label: '專案A',
      key: 'a',
      children: [
        { label: '子節點A-1', key: 'a1' },
        { label: '子節點A-2', key: 'a2' }
      ]
    },
    {
      label: '專案B',
      key: 'b',
      children: [
        { label: '子節點B-1', key: 'b1' }
      ]
    }
  ];
  selectedNode: TreeNode | null = null;
  contextMenuItems: MenuItem[];
  menubarModel = [
    { label: '首頁', icon: 'pi pi-home', routerLink: '/' },
    { label: '樹', icon: 'pi pi-sitemap', items: [
      { label: '節點總覽', icon: 'pi pi-list', routerLink: '/treeNodes' },
      { label: '新增節點', icon: 'pi pi-plus', command: () => this.onAddNode() }
    ] }
  ];
  files: TreeNode[] = [
    {
      label: '文件夾1',
      key: 'f1',
      children: [
        { label: '檔案1-1', key: 'f1-1', leaf: true },
        { label: '檔案1-2', key: 'f1-2', leaf: true }
      ]
    },
    {
      label: '文件夾2',
      key: 'f2',
      children: [
        { label: '檔案2-1', key: 'f2-1', leaf: true }
      ]
    }
  ];
  files2: TreeNode[] = [
    {
      label: '專案X',
      key: 'x',
      children: [
        { label: '子檔案X-1', key: 'x1', leaf: true },
        { label: '子檔案X-2', key: 'x2', leaf: true }
      ]
    },
    {
      label: '專案Y',
      key: 'y',
      children: [
        { label: '子檔案Y-1', key: 'y1', leaf: true }
      ]
    }
  ];
  selectedFile: TreeNode | null = null;
  selectedFiles: TreeNode[] = [];

  // 1. 多選
  selectedFilesMultiple: { [key: string]: boolean } = {};
  metaKeySelection = false;

  // 2. Lazy loading
  lazyFiles: TreeNode[] = [
    { label: 'Lazy Root', key: 'lazy1', leaf: false }
  ];
  loading = false;
  loadNode(event: { node: TreeNode }) {
    this.loading = true;
    setTimeout(() => {
      event.node.children = [
        { label: 'Lazy Child 1', key: 'lazy1-1', leaf: true },
        { label: 'Lazy Child 2', key: 'lazy1-2', leaf: true }
      ];
      this.loading = false;
    }, 800);
  }

  // 4. 虛擬捲動
  virtualFiles: TreeNode[] = Array.from({ length: 100 }).map((_, i) => ({
    label: `節點 ${i + 1}`,
    key: `v${i + 1}`,
    leaf: true
  }));

  // 5. 跨樹拖曳
  dragScope = 'multi-tree';
  files3: TreeNode[] = [
    { label: 'A', key: 'a', children: [{ label: 'A-1', key: 'a1', leaf: true }] }
  ];
  files4: TreeNode[] = [
    { label: 'B', key: 'b', children: [{ label: 'B-1', key: 'b1', leaf: true }] }
  ];

  // 6. 節點圖示
  filesWithIcon: TreeNode[] = [
    { label: '資料夾', key: 'icon1', icon: 'pi pi-folder', children: [
      { label: '檔案', key: 'icon1-1', icon: 'pi pi-file', leaf: true }
    ] }
  ];

  // 7. 節點禁用
  filesDisabled: TreeNode[] = [
    { label: '可選', key: 'd1', leaf: true },
    { label: '不可選', key: 'd2', leaf: true, selectable: false }
  ];

  selectedFileLazy: TreeNode | null = null;
  selectedFileVirtual: TreeNode | null = null;
  selectedFile3: TreeNode | null = null;
  selectedFile4: TreeNode | null = null;
  selectedFileIcon: TreeNode | null = null;
  selectedFileDisabled: TreeNode | null = null;

  constructor(private messageService: MessageService) {
  }

  onNodeDrop(event: any) {
    // 這裡只做 log，實際拖曳資料結構調整可依需求補上
    console.log('onNodeDrop', event);
  }

  onAddNode() {
    const newKey = 'new' + (Date.now());
    this.files.push({
      label: '新節點',
      key: newKey,
      leaf: true,
      icon: 'pi pi-file',
      selectable: true
    });
  }

  nodeExpand(event: { node: TreeNode }) {
    this.messageService.add({
      severity: 'info',
      summary: '展開',
      detail: event.node.label
    });
  }
  nodeCollapse(event: { node: TreeNode }) {
    this.messageService.add({
      severity: 'info',
      summary: '收合',
      detail: event.node.label
    });
  }
  nodeSelect(event: { node: TreeNode }) {
    this.messageService.add({
      severity: 'info',
      summary: '選取',
      detail: event.node.label
    });
  }
  nodeUnselect(event: { node: TreeNode }) {
    this.messageService.add({
      severity: 'info',
      summary: '取消選取',
      detail: event.node.label
    });
  }
}
