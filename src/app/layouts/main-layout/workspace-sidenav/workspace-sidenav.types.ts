// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
// 極簡型別定義 - 使用 PrimeNG 官方 TreeNode 接口

import { TreeNode } from 'primeng/api';

/**
 * 工作區節點 - 核心資料結構
 */
export interface WorkspaceNode {
  id: string;
  name: string;
  type: string;
  parentId?: string | null;
  status: 'active' | 'inactive' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  order?: number;
  description?: string;
}

/**
 * 工作區 TreeNode - 直接使用 PrimeNG 官方接口
 */
export type WorkspaceTreeNode = TreeNode<WorkspaceNode>;

/**
 * 節點操作事件
 */
export interface NodeOperationEvent {
  type: 'add' | 'delete' | 'rename' | 'move';
  node: WorkspaceNode;
  parentId?: string | null;
}

/**
 * 樹狀操作配置
 */
export interface TreeConfig {
  enableDragDrop: boolean;
  enableVirtualScroll: boolean;
  enableLazyLoad: boolean;
  virtualScrollItemSize: number;
  scrollHeight: string;
}