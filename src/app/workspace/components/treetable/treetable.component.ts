import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-shared-treetable',
  standalone: true,
  imports: [CommonModule, TreeTableModule],
  templateUrl: './treetable.component.html',
  styleUrls: ['./treetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTreetableComponent {
  @Input() value: TreeNode<any>[] | undefined;
  @Input() columns: any[] | undefined;
} 