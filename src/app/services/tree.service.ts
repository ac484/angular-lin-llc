import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, getDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { TreeNode } from 'primeng/api';

export interface WorkspaceNode {
  id: string;
  name: string;
  children?: WorkspaceNode[];
  dataItems?: DataItem[];
  // 其他欄位可自行擴充
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

// 巢狀 WorkspaceNode 轉 PrimeNG TreeNode
export function fromWorkspaceNodeToTreeNode(node: WorkspaceNode): TreeNode {
  return {
    key: node.id,
    label: node.name,
    children: node.children ? node.children.map(fromWorkspaceNodeToTreeNode) : [],
    data: { ...node }
  };
}

@Injectable({ providedIn: 'root' })
export class TreeService {
  constructor(private firestore: Firestore) {}

  // Firestore 假設回傳巢狀 WorkspaceNode 陣列
  getTreeNodes(): Observable<TreeNode[]> {
    const ref = collection(this.firestore, 'workspaceTree');
    return collectionData(ref, { idField: 'id' }).pipe(
      map((nodes) => (nodes as WorkspaceNode[]).map(fromWorkspaceNodeToTreeNode))
    );
  }

  addTreeNode(node: WorkspaceNode) {
    const ref = collection(this.firestore, 'workspaceTree');
    return addDoc(ref, node);
  }

  updateTreeNode(id: string, data: Partial<WorkspaceNode>) {
    const ref = doc(this.firestore, 'workspaceTree', id);
    return updateDoc(ref, data);
  }

  deleteTreeNode(id: string) {
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
    const data = snap.data() as WorkspaceNode;
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