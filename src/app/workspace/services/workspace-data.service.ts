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

  buildTree(nodes: WorkspaceNode[], parentId: string | null = null): TreeNode<WorkspaceNode>[] {
    return nodes
      .filter(node => (node.parentId ?? null) === parentId || (node.parentId === '' && parentId === null))
      .map(node => ({
        label: node.name,
        data: node,
        children: this.buildTree(nodes, node.id),
        leaf: !nodes.some(n => n.parentId === node.id)
      }));
  }

  updateNodeTasks(nodeId: string, tasks: Task[]): Promise<void> {
    const nodeRef = doc(this.firestore, 'nodes', nodeId);
    return updateDoc(nodeRef, { tasks });
  }
}
