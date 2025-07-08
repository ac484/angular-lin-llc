import { Component, inject } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { collection, collectionData, addDoc, Firestore } from '@angular/fire/firestore';
import { TreeNode } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

export interface WorkspaceNode extends TreeNode {
  // PrimeNG TreeNode 標準屬性已包含 children, key, label, leaf, icon, data 等
  // 可擴充自訂欄位
  dataItems?: DataItem[];
}

export interface DataItem {
  name: string;
  status?: '正常' | '異常';
  value: string | number;
  part?: number;
  total?: number;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
}

@Component({
  selector: 'app-workspace-sidenav',
  templateUrl: './workspace-sidenav.component.html',
  styleUrls: ['./workspace-sidenav.component.scss'],
  standalone: true,
  imports: [CommonModule, SidenavComponent, ...PrimeNgModules, ContextMenu]
})
export class WorkspaceSidenavComponent {
  private firestore = inject(Firestore);
  treeNodes$: Observable<WorkspaceNode[]> = collectionData(collection(this.firestore, 'workspaceTree'), { idField: 'key' }) as Observable<WorkspaceNode[]>;
  loading = false;
  contextMenuItems: MenuItem[] = [
    { label: '新增', icon: 'pi pi-plus', command: () => this.onAddNode() },
    { label: '刪除', icon: 'pi pi-trash', command: () => this.onDeleteNode() },
    { label: '重新命名', icon: 'pi pi-pencil', command: () => this.onRenameNode() }
  ];
  selectedNode: WorkspaceNode | null = null;

  onAddNode() { console.log('新增節點', this.selectedNode); }
  onDeleteNode() { console.log('刪除節點', this.selectedNode); }
  onRenameNode() { console.log('重新命名', this.selectedNode); }

  onNodeSelect(event: { node: WorkspaceNode }) { console.log('選取', event.node); }
  onNodeUnselect(event: { node: WorkspaceNode }) { console.log('取消選取', event.node); }
  onNodeContextMenu(event: any) {
    this.selectedNode = event.node;
    // context menu 由模板控制顯示
  }
  onNodeDrop(event: any) { console.log('拖曳完成', event); }

  // PrimeNG Tree 無限節點展開（Lazy Loading）
  onNodeExpand(event: { node: WorkspaceNode }) {
    this.loading = true;
    setTimeout(() => {
      event.node.children = [
        { key: `${event.node.key}-1`, label: '子節點1', leaf: true },
        { key: `${event.node.key}-2`, label: '子節點2', leaf: true }
      ];
      this.loading = false;
    }, 500);
  }
}
