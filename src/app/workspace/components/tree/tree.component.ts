import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-workspace-tree',
  standalone: true,
  imports: [TreeModule],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceTreeComponent {
  @Input() nodes: TreeNode<unknown>[] = [];
} 