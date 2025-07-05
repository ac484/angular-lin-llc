import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-workspace-organizationchart',
  standalone: true,
  imports: [OrganizationChartModule],
  templateUrl: './organizationchart.component.html',
  styleUrls: ['./organizationchart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceOrganizationChartComponent {
  /** 樹狀結構節點資料 */
  @Input() nodes: TreeNode<unknown>[] = [];
} 