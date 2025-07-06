import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { WorkspaceNode, Task } from '../../../core/models/workspace.types';

@Component({
  selector: 'app-shared-treetable',
  standalone: true,
  imports: [CommonModule, TreeTableModule],
  templateUrl: './treetable.component.html',
  styleUrls: ['./treetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTreetableComponent implements OnInit {
  @Input() value: TreeNode<WorkspaceNode | Task>[] | undefined;
  expandedKeys: { [key: string]: boolean } = {};

  ngOnInit(): void {
    // 預設展開第一層（可依需求調整）
    if (this.value) {
      this.value.forEach(node => {
        if (node.key) {
          this.expandedKeys[node.key] = true;
        }
      });
    }
  }
} 