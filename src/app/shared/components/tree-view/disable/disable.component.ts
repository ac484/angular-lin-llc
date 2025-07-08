import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-disable',
  standalone: true,
  imports: [TreeModule],
  templateUrl: './disable.component.html',
  styleUrl: './disable.component.scss'
})
export class DisableComponent {
  filesDisabled: TreeNode[] = [
    { label: '可選', key: 'd1', leaf: true },
    { label: '不可選', key: 'd2', leaf: true, selectable: false }
  ];
  selectedFileDisabled: TreeNode | null = null;
}
