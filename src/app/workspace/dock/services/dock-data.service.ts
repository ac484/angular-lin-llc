// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { WorkspaceNode } from '../models/workspace.types';
import { Observable, from } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { Task } from '../models/workspace.types';
import { DEFAULT_NODE_TYPES } from '../config/dock-menu.config';
import type { NodeType } from '../models/workspace.types';
import { FirebaseService } from '../../../core/services/firebase.service';

@Injectable({ providedIn: 'root' })
export class WorkspaceDataService {
  private firebase = inject(FirebaseService);

  loadNodes(): Observable<WorkspaceNode[]> {
    return from(this.firebase.getDocuments<WorkspaceNode>('nodes'));
  }

  addNode(node: WorkspaceNode): Promise<void> {
    return this.firebase.addDocument('nodes', node).then(() => {});
  }

  addWorkspace(node: WorkspaceNode): Promise<void> {
    return this.firebase.addDocument('nodes', node).then(() => {});
  }

  loadWorkspaces(): Observable<WorkspaceNode[]> {
    return from(this.firebase.getDocuments<WorkspaceNode>('workspaces'));
  }

  buildTree(nodes: WorkspaceNode[], parentId: string | null = null): TreeNode<WorkspaceNode | Task>[] {
    return nodes
      .filter(node => (node.parentId ?? null) === parentId)
      .map(node => {
        // 遞迴產生子節點
        const children: TreeNode<WorkspaceNode | Task>[] = this.buildTree(nodes, node.id);
        // 將 tasks 轉為葉節點
        const taskNodes: TreeNode<Task>[] = (node.tasks ?? []).map(task => ({
          key: task.id,
          label: task.title,
          data: task,
          type: 'task',
          children: [],
          leaf: true,
          icon: 'pi pi-check-square'
        }));
        const allChildren = [...children, ...taskNodes];
        return {
          key: node.id,
          label: node.name,
          data: node,
          type: node.type,
          children: allChildren,
          leaf: allChildren.length === 0
        } as TreeNode<WorkspaceNode | Task>;
      });
  }

  updateNodeTasks(nodeId: string, tasks: Task[]): Promise<void> {
    return this.firebase.updateDocument('nodes', nodeId, { tasks });
  }

  updateNodeParent(nodeId: string, newParentId: string | null): Promise<void> {
    return this.firebase.updateDocument('nodes', nodeId, { parentId: newParentId });
  }

  getNodeTypes(customTypes?: NodeType[]): NodeType[] {
    if (!customTypes) return DEFAULT_NODE_TYPES;
    const ids = new Set(DEFAULT_NODE_TYPES.map(t => t.id));
    return [
      ...DEFAULT_NODE_TYPES,
      ...customTypes.filter(t => !ids.has(t.id))
    ];
  }

  deleteWorkspace(nodeId: string): Promise<void> {
    return this.firebase.deleteDocument('nodes', nodeId);
  }
}
