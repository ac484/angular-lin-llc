import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DEFAULT_NODE_TYPES } from '../config/dock-menu.config';
import type { NodeType, WorkspaceNode, Task } from '../models/workspace.types';

@Component({
  selector: 'app-shared-treetable',
  standalone: true,
  imports: [CommonModule, TreeTableModule],
  templateUrl: './treetable.component.html',
  styleUrls: ['./treetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTreetableComponent {
  @Input() value: TreeNode<any>[] = [];
  @Input() columns: { field: string; header: string }[] = [];
  @Input() nodeTypes: NodeType[] = DEFAULT_NODE_TYPES;

  getTypeLabel(rowData: WorkspaceNode | Task): string {
    if ((rowData as Task).status !== undefined && (rowData as Task).nodeId) {
      return '任務';
    }
    const type = (rowData as WorkspaceNode).type;
    const found = this.nodeTypes.find(t => t.id === type);
    return found ? found.name : type;
  }
} 