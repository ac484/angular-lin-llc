import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
@Component({
  selector: 'app-lazy',
  templateUrl: './lazy.component.html',
  styleUrls: ['./lazy.component.scss'],
  standalone: true,
  imports: [TreeModule]
})
export class LazyComponent {
  lazyFiles: TreeNode[] = [
    { label: 'Lazy Root', key: 'lazy1', leaf: false }
  ];
  loading = false;
  selectedFileLazy: TreeNode | null = null;
  loadNode(event: { node: TreeNode }) {
    this.loading = true;
    setTimeout(() => {
      event.node.children = [
        { label: 'Lazy Child 1', key: 'lazy1-1', leaf: true },
        { label: 'Lazy Child 2', key: 'lazy1-2', leaf: true }
      ];
      this.loading = false;
    }, 800);
  }
}
