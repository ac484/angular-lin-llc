import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, inject } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TreeNode, MenuItem, TreeDragDropService } from 'primeng/api';
import { WorkspaceNode, Task, NODE_TYPES } from '../models/workspace.types';
import { WorkspaceDataService } from '../services/dock-data.service';
import { getNodeType } from '../services/dock-data.service';

@Component({
  selector: 'app-workspace-tree',
  standalone: true,
  imports: [TreeModule, ContextMenuModule],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TreeDragDropService]
})
export class DockTreeComponent {
  @Input() nodes: TreeNode<WorkspaceNode | Task>[] = [];
  @Input() selectedNode: TreeNode<WorkspaceNode | Task> | null = null;
  @Output() selectedNodeChange = new EventEmitter<TreeNode<WorkspaceNode | Task> | null>();
  @Output() action = new EventEmitter<{ type: string, node: TreeNode<WorkspaceNode | Task>, childType?: string }>();
  @Output() reload = new EventEmitter<void>();

  get contextMenuItems() {
    const data = this.selectedNode?.data as WorkspaceNode | undefined;
    const nodeType = data && 'type' in data ? getNodeType(data.type) : undefined;
    const canAdd = nodeType?.allowedChildren?.length;
    return [
      canAdd ? {
        label: '建立子結點',
        icon: 'pi pi-plus',
        items: nodeType!.allowedChildren!.map((childTypeId: string) => {
          const childType = getNodeType(childTypeId);
          return {
            label: childType?.name ?? childTypeId,
            icon: childTypeId === 'branch' ? 'pi pi-folder' : 'pi pi-file',
            command: () => this.action.emit({ type: 'add', node: this.selectedNode!, childType: childTypeId })
          };
        })
      } : null,
      { label: '建立任務', icon: 'pi pi-tasks', command: () => this.action.emit({ type: 'task', node: this.selectedNode! }) },
      { separator: true },
      { label: '重新命名', icon: 'pi pi-pencil', command: () => this.action.emit({ type: 'rename', node: this.selectedNode! }) },
      { label: '刪除', icon: 'pi pi-trash', command: () => this.action.emit({ type: 'delete', node: this.selectedNode! }) },
      { label: '複製 ID', icon: 'pi pi-copy', command: () => navigator.clipboard.writeText(this.selectedNode?.data?.id || '') },
      { label: '查看詳細', icon: 'pi pi-info-circle', command: () => this.action.emit({ type: 'detail', node: this.selectedNode! }) },
      { separator: true },
      { label: '展開全部', icon: 'pi pi-angle-down', command: () => this.action.emit({ type: 'expandAll', node: this.selectedNode! }) },
      { label: '收合全部', icon: 'pi pi-angle-up', command: () => this.action.emit({ type: 'collapseAll', node: this.selectedNode! }) }
    ].filter(Boolean);
  }

  private data = inject(WorkspaceDataService);

  onNodeDrop(event: any) {
    const dragNodeId = event.dragNode?.data?.id;
    const newParentId = event.dropNode?.data?.id ?? null;
    if (dragNodeId) {
      this.data.updateNodeParent(dragNodeId, newParentId).then(() => {
        this.reload.emit();
      });
    }
  }
} 