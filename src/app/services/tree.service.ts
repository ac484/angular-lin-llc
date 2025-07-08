import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface WorkspaceNode {
  id?: string;
  label: string;
  name?: string;
  status?: '正常' | '異常';
  parentId?: string;
  children?: WorkspaceNode[];
  dataItems?: DataItem[];
}

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

@Injectable({ providedIn: 'root' })
export class TreeService {
  constructor(private firestore: Firestore) {}

  getWorkspaceNodes(): Observable<WorkspaceNode[]> {
    const ref = collection(this.firestore, 'workspaceTree');
    return collectionData(ref, { idField: 'id' }) as Observable<WorkspaceNode[]>;
  }

  addWorkspaceNode (node: WorkspaceNode ) {
    const ref = collection(this.firestore, 'workspaceTree');
    return addDoc(ref, node);
  }

  updateWorkspaceNode (id: string, data: Partial<WorkspaceNode >) {
    const ref = doc(this.firestore, 'workspaceTree', id);
    return updateDoc(ref, data);
  }

  deleteWorkspaceNode (id: string) {
    const ref = doc(this.firestore, 'workspaceTree', id);
    return deleteDoc(ref);
  }

  // 建立 DataItem
  addDataItem(nodeId: string, dataItem: DataItem) {
    const ref = doc(this.firestore, 'workspaceTree', nodeId);
    return updateDoc(ref, {
      dataItems: arrayUnion(dataItem)
    });
  }

  // 編輯 DataItem（需先取得原本陣列，修改後整個覆蓋）
  async updateDataItem(nodeId: string, index: number, dataItem: DataItem) {
    const ref = doc(this.firestore, 'workspaceTree', nodeId);
    const snap = await getDoc(ref);
    const data = snap.data() as WorkspaceNode ;
    if (!data.dataItems) return;
    const items = [...data.dataItems];
    items[index] = dataItem;
    return updateDoc(ref, { dataItems: items });
  }

  // 刪除 DataItem
  deleteDataItem(nodeId: string, dataItem: DataItem) {
    const ref = doc(this.firestore, 'workspaceTree', nodeId);
    return updateDoc(ref, {
      dataItems: arrayRemove(dataItem)
    });
  }
}