import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { CommonModule } from '@angular/common';
import { WorkspaceDataService } from './workspace-sidenav-data.service';
import { MenuItem } from 'primeng/api';
import { WorkspaceNode } from './workspace-sidenav.types';
import { TreeDragDropService, TreeNode } from 'primeng/api';

@Component({
  selector: 'app-workspace-sidenav',
  templateUrl: './workspace-sidenav.component.html',
  styleUrls: ['./workspace-sidenav.component.scss'],
  standalone: true,
  imports: [CommonModule, SidenavComponent, ...PrimeNgModules],
  providers: [TreeDragDropService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceSidenavComponent implements OnInit {
  treeNodes: TreeNode<WorkspaceNode>[] = [];
  selectedNode: TreeNode<WorkspaceNode> | null = null;
  loading = false;
  files: TreeNode[] = [];
  selectedFile: TreeNode | null = null;
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

  // --- 跨樹/不跨樹拖曳切換 ---
  crossTreeDrag = false;
  get treeScope(): string {
    return this.crossTreeDrag ? 'workspace' : 'treeA';
  }
  get fileScope(): string {
    return this.crossTreeDrag ? 'workspace' : 'treeB';
  }

  private autoSetDragMode(): void {
    this.crossTreeDrag = this.files.length > 0;
  }

  ngOnInit() {
    this.load();
    this.autoSetDragMode();
  }

  load() {
    this.loading = true;
    this.data.loadNodes().subscribe(nodes => {
      this.treeNodes = this.data.buildTree(nodes);
      this.loading = false;
      this.autoSetDragMode();
    });
  }

  addNode(nodeOrEvent?: TreeNode<WorkspaceNode> | any) {
    let parentId: string | null = null;
    if (nodeOrEvent?.data?.id) parentId = nodeOrEvent.data.id;
    const name = '新節點';
    const now = new Date();
    const node: WorkspaceNode = {
      id: Date.now().toString(),
      name,
      type: 'custom',
      status: 'active',
      createdAt: now,
      updatedAt: now,
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
      if (name) this.data.addNode({ ...node.data, name, updatedAt: new Date() }).then(() => this.load());
    }
  }

  onNodeSelect(event: { node: TreeNode<WorkspaceNode> }) { this.selectedNode = event.node; }
  onNodeUnselect(event: any) { this.selectedNode = null; }
  onNodeDrop(event: any) {
    const dragNode = event.dragNode?.data;
    const dropNode = event.dropNode?.data;
    if (!dragNode || !dropNode) return;
    const newParentId = event.dropPosition === 0 ? dropNode.id : dropNode.parentId || null;
    if (dragNode.parentId === newParentId) return; // parentId 沒變不用寫入
    this.loading = true;
    this.data.updateNodeParent(dragNode.id, newParentId).then(() => this.load());
  }

  nodeExpand(event: any): void { console.log('nodeExpand', event); }
  nodeCollapse(event: any): void { console.log('nodeCollapse', event); }
  nodeSelect(event: any): void { console.log('nodeSelect', event); }
  nodeUnselect(event: any): void { console.log('nodeUnselect', event); }
}
