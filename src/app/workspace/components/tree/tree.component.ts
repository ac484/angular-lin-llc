import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { WorkspaceNode } from '../../../core/models/workspace.types';
import { WorkspaceContextMenuComponent } from '../contextmenu/contextmenu.component';

@Component({
  selector: 'app-workspace-tree',
  standalone: true,
  imports: [TreeModule, WorkspaceContextMenuComponent],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceTreeComponent {
  @Input() nodes: TreeNode<WorkspaceNode>[] = [];
  @Output() addChild = new EventEmitter<TreeNode<WorkspaceNode>>();

  contextNode: TreeNode<WorkspaceNode> | null = null;
  contextTarget: string | HTMLElement | undefined;
  contextMenuItems = [
    {
      label: '建立子節點',
      icon: 'pi pi-plus',
      command: () => {
        if (this.contextNode) {
          this.addChild.emit(this.contextNode);
          this.contextNode = null;
        }
      }
    }
  ];

  onNodeRightClick(event: MouseEvent, node: TreeNode<WorkspaceNode>) {
    event.preventDefault();
    this.contextNode = node;
    this.contextTarget = event.target as HTMLElement;
  }
} 