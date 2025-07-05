import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-workspace-treetable',
  standalone: true,
  imports: [TreeTableModule],
  templateUrl: './treetable.component.html',
  styleUrls: ['./treetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceTreeTableComponent {
  /** 樹狀結構節點資料 */
  @Input() nodes: TreeNode<unknown>[] = [];
  /** 欄位定義 */
  @Input() columns: any[] = [];
} 