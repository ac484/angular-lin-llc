import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [TreeModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {
  files: TreeNode[] = [
    {
      label: '文件夾1',
      key: 'f1',
      children: [
        { label: '檔案1-1', key: 'f1-1', leaf: true },
        { label: '檔案1-2', key: 'f1-2', leaf: true }
      ]
    },
    {
      label: '文件夾2',
      key: 'f2',
      children: [
        { label: '檔案2-1', key: 'f2-1', leaf: true }
      ]
    }
  ];
  selectedFiles: TreeNode[] = [];
}
