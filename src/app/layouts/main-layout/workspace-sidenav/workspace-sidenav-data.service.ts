// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { WorkspaceNode, WorkspaceTreeNode } from './workspace-sidenav.types';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkspaceDataService {
  private readonly firestore = inject(Firestore);
  private readonly collectionName = 'workspace-nodes';

  /**
   * 載入所有節點 - 使用 Firestore 即時監聽
   */
  loadNodes(): Observable<WorkspaceNode[]> {
    const col = collection(this.firestore, this.collectionName);
    return collectionData(col, { idField: 'id' }) as Observable<WorkspaceNode[]>;
  }

  /**
   * 載入樹狀結構 - 使用官方 TreeNode 格式
   */
  loadTree(): Observable<WorkspaceTreeNode[]> {
    return this.loadNodes().pipe(
      map(nodes => this.buildTree(nodes))
    );
  }

  /**
   * 建構樹狀結構 - 官方 TreeNode 格式
   */
  buildTree(nodes: WorkspaceNode[], parentId: string | null = null): WorkspaceTreeNode[] {
    return nodes
      .filter(node => (node.parentId ?? null) === parentId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(node => {
        const children = this.buildTree(nodes, node.id);
        return {
          key: node.id,
          label: node.name,
          data: node,
          children: children.length > 0 ? children : undefined,
          leaf: children.length === 0,
          expanded: false,
          icon: this.getNodeIcon(node.type),
          type: node.type
        } as WorkspaceTreeNode;
      });
  }

  /**
   * 新增節點
   */
  async addNode(node: Omit<WorkspaceNode, 'id'>): Promise<void> {
    const col = collection(this.firestore, this.collectionName);
    await addDoc(col, {
      ...node,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * 刪除節點
   */
  async deleteNode(nodeId: string): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, nodeId);
    await deleteDoc(ref);
  }

  /**
   * 更新節點父級
   */
  async updateNodeParent(nodeId: string, parentId: string | null): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, nodeId);
    await updateDoc(ref, { 
      parentId,
      updatedAt: new Date()
    });
  }

  /**
   * 更新節點名稱
   */
  async updateNodeName(nodeId: string, name: string): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, nodeId);
    await updateDoc(ref, { 
      name,
      updatedAt: new Date()
    });
  }

  /**
   * 取得節點圖示
   */
  private getNodeIcon(type: string): string {
    const iconMap: Record<string, string> = {
      'workspace': 'pi pi-briefcase',
      'folder': 'pi pi-folder',
      'document': 'pi pi-file',
      'task': 'pi pi-check-square',
      'default': 'pi pi-circle'
    };
    return iconMap[type] || iconMap['default'];
  }
}
