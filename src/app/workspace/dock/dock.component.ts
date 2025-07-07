import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem, TreeNode } from 'primeng/api';
import { DockMenubarComponent } from './menubar/menubar.component';
import { DockContextMenuComponent } from './contextmenu/contextmenu.component';
import { DockTreeComponent } from './tree/tree.component';
import { SharedTreetableComponent } from './treetable/treetable.component';
import { WorkspaceDataService } from './services/dock-data.service';
import { WorkspaceStateService } from './services/dock-state.service';
import { MENUBAR_ITEMS, DOCK_ITEMS, DOCK_CONTEXT_MENU_ITEMS } from './config/dock-menu.config';
import { WorkspaceNode, Task } from './models/workspace.types';

@Component({
  selector: 'app-workspace-dock',
  standalone: true,
  imports: [CommonModule, DockModule, TooltipModule, DockMenubarComponent, DockContextMenuComponent, DockTreeComponent, SharedTreetableComponent],
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceDockComponent {
  menubarItems: MenuItem[] = [];
  dockItems: MenuItem[] = [];
  dockContextMenuItems: MenuItem[] = [];
  selectedTreeNode: TreeNode<any> | null = null;
  @ViewChild('dockContextMenu') dockContextMenu?: DockContextMenuComponent;

  constructor(
    public data: WorkspaceDataService,
    public state: WorkspaceStateService
  ) {
    // 產生 menubarItems，根據 label 動態加上 command
    this.menubarItems = MENUBAR_ITEMS.map(item => ({
      ...item,
      items: item.items?.map(sub => ({
        ...sub,
        command: this.getMenubarCommand(sub.label)
      }))
    }));
    // 產生 dockItems
    this.dockItems = DOCK_ITEMS.map(item => ({
      ...item,
      command: this.getDockCommand(item.label)
    }));
    // 產生 dockContextMenuItems
    this.dockContextMenuItems = DOCK_CONTEXT_MENU_ITEMS.map(item => ({
      ...item,
      command: this.getDockContextMenuCommand(item.label)
    }));
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

  addWorkspace(parentNode?: any) {
    const node: WorkspaceNode = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      name: '新節點 ' + new Date().toLocaleTimeString(),
      type: 'custom',
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
    this.dockContextMenu?.show(event);
  }

  // 根據 label 回傳對應的 command function
  getMenubarCommand(label?: string) {
    switch (label) {
      case '開啟': return () => this.loadWorkspaces();
      case '重新載入': return () => this.loadNodes();
      case '讀取工作空間': return () => this.loadWorkspaces();
      case '新增工作空間': return () => this.addWorkspace();
      default: return undefined;
    }
  }
  getDockCommand(label?: string) {
    switch (label) {
      case 'Tree': return () => this.toggleTree();
      case 'TreeTable': return () => this.toggleTreeTable();
      default: return undefined;
    }
  }
  getDockContextMenuCommand(label?: string) {
    switch (label) {
      case '重新整理': return () => this.loadNodes();
      default: return undefined;
    }
  }

  onTreeAction(event: { type: string, node: any }) {
    switch (event.type) {
      case 'add':
        this.addWorkspace(event.node);
        break;
      case 'task':
        this.addTaskToNode(event.node.data);
        break;
      case 'rename':
        // TODO: 重新命名
        break;
      case 'delete':
        // TODO: 刪除
        break;
      case 'detail':
        // TODO: 查看詳細
        break;
      case 'expandAll':
        // TODO: 展開全部
        break;
      case 'collapseAll':
        // TODO: 收合全部
        break;
    }
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