import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TreeNode, MenuItem } from 'primeng/api';
import { WorkspaceNode } from '../../../core/models/workspace.types';

@Component({
  selector: 'app-workspace-tree',
  standalone: true,
  imports: [TreeModule, ContextMenuModule],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceTreeComponent {
  @Input() nodes: TreeNode<any>[] = [];
  @Input() contextMenuItems: MenuItem[] = [];
  @Input() selectedNode: TreeNode<any> | null = null;
  @Output() selectedNodeChange = new EventEmitter<TreeNode<any> | null>();
} 