import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface TreeNode {
  id?: string;
  label: string;
  parentId?: string;
  children?: TreeNode[];
}

@Injectable({ providedIn: 'root' })
export class TreeService {
  constructor(private firestore: Firestore) {}

  getTreeNodes(): Observable<TreeNode[]> {
    const ref = collection(this.firestore, 'workspaceTree');
    return collectionData(ref, { idField: 'id' }) as Observable<TreeNode[]>;
  }

  addTreeNode(node: TreeNode) {
    const ref = collection(this.firestore, 'workspaceTree');
    return addDoc(ref, node);
  }

  updateTreeNode(id: string, data: Partial<TreeNode>) {
    const ref = doc(this.firestore, 'workspaceTree', id);
    return updateDoc(ref, data);
  }

  deleteTreeNode(id: string) {
    const ref = doc(this.firestore, 'workspaceTree', id);
    return deleteDoc(ref);
  }
}