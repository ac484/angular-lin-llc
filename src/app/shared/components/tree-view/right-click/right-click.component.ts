import { Component } from '@angular/core';
import { TreeNode, MenuItem } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
@Component({
  selector: 'app-right-click',
  templateUrl: './right-click.component.html',
  styleUrls: ['./right-click.component.scss'],
  standalone: true,
  imports: [TreeModule, ContextMenuModule]
})
export class RightClickComponent {
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
  selectedFile: TreeNode | null = null;
  items: MenuItem[] = [
    { label: '檢視', icon: 'pi pi-search', command: () => this.viewNode(this.selectedFile) },
    { label: '刪除', icon: 'pi pi-trash', command: () => this.deleteNode(this.selectedFile) }
  ];
  viewNode(node: TreeNode | null) {
    // 可根據需求彈出訊息或其他操作
  }
  deleteNode(node: TreeNode | null) {
    // 可根據需求刪除節點
  }
}
