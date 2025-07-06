// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { WorkspaceNode } from '../../core/models/workspace.types';
import { Observable } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { Task } from '../../core/models/workspace.types';

@Injectable({ providedIn: 'root' })
export class WorkspaceDataService {
  private firestore = inject(Firestore);

  loadNodes(): Observable<WorkspaceNode[]> {
    const col = collection(this.firestore, 'nodes');
    return collectionData(col, { idField: 'id' }) as Observable<WorkspaceNode[]>;
  }

  addNode(node: WorkspaceNode): Promise<void> {
    const col = collection(this.firestore, 'nodes');
    return addDoc(col, node).then(() => {});
  }

  addWorkspace(node: WorkspaceNode): Promise<void> {
    const col = collection(this.firestore, 'nodes');
    return addDoc(col, node).then(() => {});
  }

  loadWorkspaces(): Observable<WorkspaceNode[]> {
    const col = collection(this.firestore, 'workspaces');
    return collectionData(col) as Observable<WorkspaceNode[]>;
  }

  buildTree(nodes: WorkspaceNode[], parentId: string | null = null): TreeNode<WorkspaceNode | Task>[] {
    return nodes
      .filter(node => (node.parentId ?? null) === parentId || (node.parentId === '' && parentId === null))
      .map(node => {
        // 先遞迴產生子節點
        const children = this.buildTree(nodes, node.id);
        // 將 tasks 轉為葉節點
        const taskNodes: TreeNode<Task>[] = (node.tasks ?? []).map(task => ({
          label: task.title,
          data: task,
          leaf: true,
          type: 'task',
          icon: 'pi pi-check-square'
        }));
        return {
          label: node.name,
          data: node,
          children: [...children, ...taskNodes],
          leaf: children.length === 0 && taskNodes.length === 0
        };
      });
  }

  updateNodeTasks(nodeId: string, tasks: Task[]): Promise<void> {
    const nodeRef = doc(this.firestore, 'nodes', nodeId);
    return updateDoc(nodeRef, { tasks });
  }
}
