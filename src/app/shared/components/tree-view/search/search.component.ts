import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [TreeModule]
})
export class SearchComponent {
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
  files2: TreeNode[] = [
    {
      label: '專案X',
      key: 'x',
      children: [
        { label: '子檔案X-1', key: 'x1', leaf: true },
        { label: '子檔案X-2', key: 'x2', leaf: true }
      ]
    },
    {
      label: '專案Y',
      key: 'y',
      children: [
        { label: '子檔案Y-1', key: 'y1', leaf: true }
      ]
    }
  ];
  selectedFiles: TreeNode[] = [];
  selectedFilesMultiple: { [key: string]: boolean } = {};
  metaKeySelection = false;
  selectedFile: TreeNode | null = null;
}
