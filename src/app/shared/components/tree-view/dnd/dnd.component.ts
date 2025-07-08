import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
@Component({
  selector: 'app-dnd',
  templateUrl: './dnd.component.html',
  styleUrls: ['./dnd.component.scss'],
  standalone: true,
  imports: [TreeModule]
})
export class DndComponent {
  files3: TreeNode[] = [
    { label: 'A', key: 'a', children: [{ label: 'A-1', key: 'a1', leaf: true }] }
  ];
  files4: TreeNode[] = [
    { label: 'B', key: 'b', children: [{ label: 'B-1', key: 'b1', leaf: true }] }
  ];
  selectedFile3: TreeNode | null = null;
  selectedFile4: TreeNode | null = null;
  dragScope = 'multi-tree';
}
