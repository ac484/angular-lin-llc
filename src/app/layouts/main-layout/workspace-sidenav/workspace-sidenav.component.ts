import { Component, inject, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { CommonModule } from '@angular/common';
import { WorkspaceDataService } from '../../../services/workspace-data.service';
import { MenuItem } from 'primeng/api';
import { WorkspaceNode } from '../../../models/workspace.types';
import { TreeDragDropService, TreeNode } from 'primeng/api';

@Component({
  selector: 'app-workspace-sidenav',
  templateUrl: './workspace-sidenav.component.html',
  styleUrls: ['./workspace-sidenav.component.scss'],
  standalone: true,
  imports: [CommonModule, SidenavComponent, ...PrimeNgModules],
  providers: [TreeDragDropService]
})
export class WorkspaceSidenavComponent implements OnInit {
  treeNodes: TreeNode<WorkspaceNode>[] = [];
  selectedNode: TreeNode<WorkspaceNode> | null = null;
  loading = false;
  contextMenuItems: MenuItem[] = [
    { label: '新增', icon: 'pi pi-plus', command: () => this.addNode(this.selectedNode) },
    { label: '刪除', icon: 'pi pi-trash', command: () => this.deleteNode(this.selectedNode) },
    { label: '重新命名', icon: 'pi pi-pencil', command: () => this.renameNode(this.selectedNode) }
  ];
  menubarItems: MenuItem[] = [
    { label: '首頁', icon: 'pi pi-home', routerLink: '/' },
    {
      label: '節點', icon: 'pi pi-briefcase',
      items: [
        { label: '新增節點', icon: 'pi pi-plus', command: () => this.addNode() }
      ]
    }
  ];

  private data: WorkspaceDataService = inject(WorkspaceDataService);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.data.loadNodes().subscribe(nodes => {
      this.treeNodes = this.data.buildTree(nodes);
      this.loading = false;
    });
  }

  addNode(nodeOrEvent?: TreeNode<WorkspaceNode> | any) {
    // 支援 context menu、menubar、樹節點右鍵
    let parentId: string | null = null;
    if (nodeOrEvent && nodeOrEvent.data && nodeOrEvent.data.id) {
      parentId = nodeOrEvent.data.id;
    }
    const name = prompt('輸入節點名稱', '新節點');
    if (!name) return;
    const node: WorkspaceNode = {
      id: Date.now().toString(),
      name,
      type: 'custom',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId
    };
    this.data.addNode(node).then(() => this.load());
  }
  deleteNode(node?: TreeNode<WorkspaceNode> | null) {
    if (node) this.data.deleteNode(node.data).then(() => this.load());
  }
  renameNode(node?: TreeNode<WorkspaceNode> | null) {
    if (node) {
      const name = prompt('輸入新名稱', node.data.name);
      if (name) this.data.addNode({ ...node.data, name }).then(() => this.load());
    }
  }
  onNodeSelect(event: any) { this.selectedNode = event.node; }
  onNodeUnselect(event: any) { this.selectedNode = null; }
  onNodeDrop(event: any) {
    // event.dragNode: 被拖曳的節點
    // event.dropNode: 目標節點
    // event.dropPosition: -1(上), 0(內), 1(下)
    const dragNode = event.dragNode?.data;
    const dropNode = event.dropNode?.data;
    if (!dragNode || !dropNode) return;
    // 僅支援拖曳到其他節點下方（可依需求調整 dropPosition）
    const newParentId = event.dropPosition === 0 ? dropNode.id : dropNode.parentId || null;
    this.loading = true;
    this.data.updateNodeParent(dragNode.id, newParentId).then(() => this.load());
  }
}
