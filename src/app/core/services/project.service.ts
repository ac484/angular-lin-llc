// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { ProjectNode, NodeType } from '../models/project.types';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private firestore = inject(Firestore);

  // 取得所有專案節點（極簡範例）
  async getProjectTree(): Promise<ProjectNode[]> {
    const querySnapshot = await getDocs(collection(this.firestore, 'projectNodes'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ProjectNode);
  }

  // 取得所有節點型別
  async getNodeTypes(): Promise<NodeType[]> {
    const querySnapshot = await getDocs(collection(this.firestore, 'nodeTypes'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as NodeType);
  }
}
