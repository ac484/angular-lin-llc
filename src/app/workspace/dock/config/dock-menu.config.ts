import type { MenuItem } from 'primeng/api';
import type { NodeType } from '../models/workspace.types';

export const MENUBAR_ITEMS: MenuItem[] = [
  {
    label: '檔案',
    icon: 'pi pi-file',
    items: [
      { label: '建立根結點', icon: 'pi pi-sitemap' }
    ]
  }
];

export const DOCK_ITEMS: MenuItem[] = [
  { label: 'Home', icon: 'pi pi-home' },
  { label: 'Tree', icon: 'pi pi-th-large' },
  { label: 'TreeTable', icon: 'pi pi-sitemap' },
  { label: 'Trash', icon: 'pi pi-trash' }
];

export const DOCK_CONTEXT_MENU_ITEMS: MenuItem[] = [
  { label: '重新整理', icon: 'pi pi-refresh' },
  { label: '回首頁', icon: 'pi pi-home' }
];

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
