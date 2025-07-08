import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
@Component({
  selector: 'app-virtual',
  templateUrl: './virtual.component.html',
  styleUrls: ['./virtual.component.scss'],
  standalone: true,
  imports: [TreeModule]
})
export class VirtualComponent {
  virtualFiles: TreeNode[] = Array.from({ length: 100 }).map((_, i) => ({
    label: `節點 ${i + 1}`,
    key: `v${i + 1}`,
    leaf: true
  }));
  selectedFileVirtual: TreeNode | null = null;
}
