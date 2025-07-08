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
  // 單樹內拖曳 demo
  singleTree: TreeNode[] = [
    {
      label: '根節點',
      key: 'root',
      children: [
        { label: '子節點 1', key: 'c1', leaf: true },
        { label: '子節點 2', key: 'c2', leaf: true }
      ]
    }
  ];
  selectedSingle: TreeNode | null = null;
}
