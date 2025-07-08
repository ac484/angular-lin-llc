import { Component } from '@angular/core';
import { TreeNode, MenuItem } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-right-click',
  templateUrl: './right-click.component.html',
  styleUrls: ['./right-click.component.scss'],
  standalone: true,
  imports: [TreeModule, ContextMenuModule, ToastModule],
  providers: [MessageService]
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

  constructor(private messageService: MessageService) {}

  // 檢視節點，彈出訊息
  viewNode(node: TreeNode | null) {
    if (node) {
      this.messageService.add({
        severity: 'info',
        summary: '節點資訊',
        detail: node.label
      });
    }
  }

  // 刪除節點
  deleteNode(node: TreeNode | null) {
    if (!node) return;
    // 僅支援刪除第一層節點（示範用）
    this.files = this.files.filter(n => n !== node);
    this.messageService.add({
      severity: 'warn',
      summary: '已刪除',
      detail: node.label
    });
  }
}
