// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { WorkspaceNode, NodeType } from '../models/workspace.types';

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private firestore = inject(Firestore);

  async getWorkspaceTree(): Promise<WorkspaceNode[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'WorkspaceNodes'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as WorkspaceNode);
    } catch (e) {
      return [];
    }
  }

  // 取得所有節點型別
  async getNodeTypes(): Promise<NodeType[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'nodeTypes'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as NodeType);
    } catch (e) {
      return [];
    }
  }
}
