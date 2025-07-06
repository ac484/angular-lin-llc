import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { WorkspaceNode } from '../../../core/models/workspace.types';

@Component({
  selector: 'app-workspace-tree',
  standalone: true,
  imports: [TreeModule],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceTreeComponent {
  @Input() nodes: TreeNode<WorkspaceNode>[] = [];
  @Output() addChild = new EventEmitter<TreeNode<WorkspaceNode>>();
  @Output() nodeRightClick = new EventEmitter<{ event: MouseEvent, node: TreeNode<WorkspaceNode> }>();

  onNodeRightClick(event: MouseEvent, node: TreeNode<WorkspaceNode>) {
    event.preventDefault();
    this.nodeRightClick.emit({ event, node });
  }
} 