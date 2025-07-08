import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';

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
} 