// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, docData, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { WorkspaceNode } from '../../core/models/workspace.types';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkspaceDataService {
  private firestore = inject(Firestore);

  // 讀取整棵 workspace tree
  loadWorkspaceTree(workspaceId: string): Observable<WorkspaceNode[]> {
    const ref = doc(this.firestore, 'workspaces', workspaceId);
    return docData(ref).pipe(map((data: any) => data?.nodes ?? []));
  }

  // 儲存整棵 workspace tree
  saveWorkspaceTree(workspaceId: string, nodes: WorkspaceNode[]): Promise<void> {
    const ref = doc(this.firestore, 'workspaces', workspaceId);
    return setDoc(ref, { nodes }, { merge: true });
  }
}
