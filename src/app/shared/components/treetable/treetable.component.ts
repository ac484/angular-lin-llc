import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-shared-treetable',
  standalone: true,
  imports: [TreeTableModule],
  templateUrl: './treetable.component.html',
  styleUrls: ['./treetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTreetableComponent {
  @Input() value: TreeNode<any>[] | undefined;
  @Input() columns: any[] | undefined;
} 