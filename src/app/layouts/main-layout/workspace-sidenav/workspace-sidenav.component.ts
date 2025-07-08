import { Component, inject } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { collection, collectionData, addDoc, Firestore } from '@angular/fire/firestore';

export interface WorkspaceNode {
  id: string;
  name: string;
  key?: string; // PrimeNG TreeNode.key
  leaf?: boolean; // 是否為葉節點
  icon?: string; // 節點圖示
  selectable?: boolean; // 是否可選
  children?: WorkspaceNode[];
  dataItems?: DataItem[];
  // 其他欄位可自行擴充
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
  imports: [CommonModule, SidenavComponent, ...PrimeNgModules]
})
export class WorkspaceSidenavComponent {
  private firestore = inject(Firestore);
  treeNodes$: Observable<WorkspaceNode[]> = collectionData(collection(this.firestore, 'workspaceTree'), { idField: 'id' }) as Observable<WorkspaceNode[]>;

  onAddNode() {
    const node: Partial<WorkspaceNode> = { name: '新節點' };
    addDoc(collection(this.firestore, 'workspaceTree'), node);
  }

  onManageNode() {
    alert('管理節點');
  }
}
