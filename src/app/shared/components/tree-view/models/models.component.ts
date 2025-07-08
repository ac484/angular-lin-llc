import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// WorkspaceNode 型別定義
export interface WorkspaceNode {
  id: string;
  name: string;
  key?: string;
  leaf?: boolean;
  icon?: string;
  selectable?: boolean;
  children?: WorkspaceNode[];
  dataItems?: DataItem[];
}

// DataItem 型別定義
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
  selector: 'app-models',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss'
})
export class ModelsComponent {
  // 僅供展示型別結構
  readonly workspaceNodeExample: WorkspaceNode = {
    id: '1',
    name: '節點',
    children: []
  };
  readonly dataItemExample: DataItem = {
    name: '資料',
    value: 123
  };
}
