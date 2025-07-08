import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { TreeNode, TreeDragDropService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-workspace-sidenav',
  templateUrl: './workspace-sidenav.component.html',
  styleUrls: ['./workspace-sidenav.component.scss'],
  standalone: true,
  imports: [CommonModule, SidenavComponent, ...PrimeNgModules],
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

  constructor(private messageService: MessageService) {
    this.contextMenuItems = [
      {
        label: '檢視',
        icon: 'pi pi-search',
        command: () => this.viewNode(this.selectedNode)
      },
      {
        label: '取消選取',
        icon: 'pi pi-times',
        command: () => this.unselectNode()
      }
    ];
  }

  viewNode(node: TreeNode | null) {
    if (node) {
      this.messageService.add({
        severity: 'info',
        summary: '節點資訊',
        detail: node.label
      });
    }
  }

  unselectNode() {
    this.selectedNode = null;
  }

  onNodeDrop(event: any) {
    // 這裡只做 log，實際拖曳資料結構調整可依需求補上
    console.log('onNodeDrop', event);
  }

  onAddNode() {
    this.treeNodes.push({ label: '新節點', key: 'new' + (this.treeNodes.length + 1) });
  }
}
