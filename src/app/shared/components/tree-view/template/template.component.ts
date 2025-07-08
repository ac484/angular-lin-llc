import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  standalone: true,
  imports: [TreeModule]
})
export class TemplateComponent {
  nodes: TreeNode[] = [
    {
      label: 'Google',
      key: 'url1',
      data: 'https://www.google.com',
      type: 'url',
      leaf: true
    },
    {
      label: '一般節點',
      key: 'default1',
      leaf: true
    },
    {
      label: '文件夾',
      key: 'folder1',
      children: [
        {
          label: 'Angular 官網',
          key: 'url2',
          data: 'https://angular.dev',
          type: 'url',
          leaf: true
        },
        {
          label: '普通子節點',
          key: 'default2',
          leaf: true
        }
      ]
    }
  ];
}
