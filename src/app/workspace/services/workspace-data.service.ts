// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, docData, collection, collectionData } from '@angular/fire/firestore';
import { WorkspaceNode, Task } from '../../core/models/workspace.types';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkspaceDataService {
  private firestore = inject(Firestore);

  // 取得所有 workspace 文件（主節點）
  listWorkspaces(): Observable<{ id: string, name: string }[]> {
    const col = collection(this.firestore, 'workspaces');
    return collectionData(col, { idField: 'id' }).pipe(
      map((docs: any[]) => docs.map(doc => ({ id: doc.id, name: doc.name ?? doc.id })))
    );
  }

  // 讀取指定 workspace 文件（主節點一棵樹）
  loadWorkspaceTree(workspaceId: string): Observable<WorkspaceNode[]> {
    const ref = doc(this.firestore, 'workspaces', workspaceId);
    return docData(ref).pipe(map((data: any) => data?.nodes ?? []));
  }

  // 儲存指定 workspace 文件
  saveWorkspaceTree(workspaceId: string, nodes: WorkspaceNode[]): Promise<void> {
    const ref = doc(this.firestore, 'workspaces', workspaceId);
    return setDoc(ref, { nodes }, { merge: true });
  }

  // 新增任務到指定節點
  addTaskToNode(nodes: WorkspaceNode[], nodeId: string, task: Task): WorkspaceNode[] {
    return nodes.map(node => {
      if (node.id === nodeId) {
        const properties = node.properties ? { ...node.properties } : {};
        const tasks = Array.isArray(properties['tasks']) ? properties['tasks'] as Task[] : [];
        properties['tasks'] = [...tasks, task];
        return { ...node, properties };
      } else if (node.children && node.children.length > 0) {
        return { ...node, children: this.addTaskToNode(node.children, nodeId, task) };
      } else {
        return node;
      }
    });
  }
}
