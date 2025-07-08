import type { MenuItem } from 'primeng/api';
import type { NodeType } from '../models/workspace.types';

// --- fallback 節點型別定義：僅根結點、枝節點、葉節點 ---
export const DEFAULT_NODE_TYPES: NodeType[] = [
  {
    id: 'root',
    name: '根結點',
    icon: 'pi pi-sitemap',
    color: '#1976d2',
    allowedChildren: ['branch', 'leaf']
  },
  {
    id: 'branch',
    name: '枝節點',
    icon: 'pi pi-share-alt',
    color: '#388e3c',
    allowedChildren: ['branch', 'leaf']
  },
  {
    id: 'leaf',
    name: '葉結點',
    icon: 'pi pi-leaf',
    color: '#fbc02d',
    isLeaf: true
  }
];
