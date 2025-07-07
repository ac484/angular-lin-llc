import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { WorkspaceNode, Task } from '../models/workspace.types';

@Injectable({ providedIn: 'root' })
export class WorkspaceStateService {
  showTreeTable$ = new BehaviorSubject<boolean>(false);
  showTree$ = new BehaviorSubject<boolean>(false);
  treeTableColumns$ = new BehaviorSubject<{ field: string; header: string }[]>([
    { field: 'name', header: '名稱' },
    { field: 'type', header: '類型' },
    { field: 'status', header: '狀態' },
    { field: 'createdAt', header: '建立時間' }
  ]);
  treeTableData$ = new BehaviorSubject<TreeNode<WorkspaceNode | Task>[]>([]);
  treeData$ = new BehaviorSubject<TreeNode<WorkspaceNode | Task>[]>([]);
}
