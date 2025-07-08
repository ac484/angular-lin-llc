import { Pipe, PipeTransform } from '@angular/core';
import { WorkspaceNode, fromWorkspaceNodeToTreeNode } from '../../services/tree.service';
import { TreeNode } from 'primeng/api';

@Pipe({
  name: 'workspaceNodeToTreeNode',
  standalone: true
})
export class WorkspaceNodeToTreeNodePipe implements PipeTransform {
  transform(value: WorkspaceNode[] | null | undefined): TreeNode[] {
    if (!value) return [];
    return value.map(fromWorkspaceNodeToTreeNode);
  }
}
