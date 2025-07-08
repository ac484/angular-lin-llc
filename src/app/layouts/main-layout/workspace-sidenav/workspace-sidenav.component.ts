import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { TreeNode, TreeDragDropService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { TemplateComponent } from '../../../shared/components/tree-view/template/template.component';
import { RightClickComponent } from '../../../shared/components/tree-view/right-click/right-click.component';
import { DndComponent } from '../../../shared/components/tree-view/dnd/dnd.component';
import { CheckboxComponent } from '../../../shared/components/tree-view/checkbox/checkbox.component';
import { DisableComponent } from '../../../shared/components/tree-view/disable/disable.component';
import { LazyComponent } from '../../../shared/components/tree-view/lazy/lazy.component';
import { VirtualComponent } from '../../../shared/components/tree-view/virtual/virtual.component';
import { SearchComponent } from '../../../shared/components/tree-view/search/search.component';
import { ModelsComponent } from '../../../shared/components/tree-view/models/models.component';
import { ActionsComponent } from '../../../shared/components/tree-view/actions/actions.component';

@Component({
  selector: 'app-workspace-sidenav',
  templateUrl: './workspace-sidenav.component.html',
  styleUrls: ['./workspace-sidenav.component.scss'],
  standalone: true,
  imports: [CommonModule, SidenavComponent, ...PrimeNgModules, TemplateComponent, RightClickComponent, DndComponent, CheckboxComponent, DisableComponent, LazyComponent, VirtualComponent, SearchComponent, ModelsComponent, ActionsComponent],
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
  selectedFile: TreeNode | null = null;

  // 1. 多選
  selectedFilesMultiple: { [key: string]: boolean } = {};
  metaKeySelection = false;

  // 6. 節點圖示
  filesWithIcon: TreeNode[] = [
    { label: '資料夾', key: 'icon1', icon: 'pi pi-folder', children: [
      { label: '檔案', key: 'icon1-1', icon: 'pi pi-file', leaf: true }
    ] }
  ];

  selectedFileIcon: TreeNode | null = null;

  constructor(private messageService: MessageService) {
  }

  onNodeDrop(event: any) {
    // 這裡只做 log，實際拖曳資料結構調整可依需求補上
    console.log('onNodeDrop', event);
  }

  onAddNode() {
    // 節點新增功能已不再由主元件管理，請於對應 tree 子元件實作
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
