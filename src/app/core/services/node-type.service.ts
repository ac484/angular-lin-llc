import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { NodeType } from '../models/workspace.types';

@Injectable({
  providedIn: 'root'
})
export class NodeTypeService {
  private firestore = inject(Firestore);

  // 預設節點類型
  private defaultNodeTypes: NodeType[] = [
    { id: 'factory', name: '廠', icon: 'factory', color: '#1976d2', allowedChildren: ['area', 'department'] },
    { id: 'area', name: '區', icon: 'grid_view', color: '#388e3c', allowedChildren: ['building', 'department'] },
    { id: 'building', name: '棟', icon: 'business', color: '#f57c00', allowedChildren: ['floor', 'department'] },
    { id: 'floor', name: '樓', icon: 'layers', color: '#7b1fa2', allowedChildren: ['level', 'department'] },
    { id: 'level', name: '層', icon: 'layers', color: '#d32f2f', allowedChildren: ['station', 'department'] },
    { id: 'station', name: '站', icon: 'location_on', color: '#1976d2', allowedChildren: ['task', 'department'] },
    { id: 'department', name: '部門', icon: 'business', color: '#388e3c', allowedChildren: ['team', 'task'] },
    { id: 'team', name: '團隊', icon: 'group', color: '#f57c00', allowedChildren: ['task'] },
    { id: 'task', name: '任務', icon: 'assignment', color: '#7b1fa2', isLeaf: true }
  ];

  async getNodeTypes(): Promise<NodeType[]> {
    try {
      const snapshot = await getDocs(collection(this.firestore, 'nodeTypes'));
      if (snapshot.empty) {
        // 如果沒有定義，使用預設類型
        return this.defaultNodeTypes;
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as NodeType);
    } catch (error) {
      console.error('獲取節點類型失敗:', error);
      return this.defaultNodeTypes;
    }
  }

  async createNodeType(nodeType: Omit<NodeType, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, 'nodeTypes'), nodeType);
    return docRef.id;
  }

  async updateNodeType(id: string, updates: Partial<NodeType>): Promise<void> {
    const docRef = doc(this.firestore, 'nodeTypes', id);
    await updateDoc(docRef, updates);
  }

  async deleteNodeType(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'nodeTypes', id);
    await deleteDoc(docRef);
  }

  // 獲取允許的子節點類型
  async getAllowedChildTypes(parentType: string): Promise<NodeType[]> {
    const allTypes = await this.getNodeTypes();
    const parentTypeDef = allTypes.find(type => type.id === parentType);
    
    if (!parentTypeDef?.allowedChildren) {
      return allTypes.filter(type => !type.isLeaf);
    }
    
    return allTypes.filter(type => parentTypeDef.allowedChildren!.includes(type.id));
  }
}
