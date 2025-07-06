import type { MenuItem } from 'primeng/api';
import { NodeType } from '../../core/models/workspace.types';

const NODE_TYPES: NodeType[] = [
  { id: 'factory', name: '廠區', icon: 'pi pi-building', color: '#1976d2' },
  { id: 'area', name: '區域', icon: 'pi pi-map', color: '#388e3c' },
  { id: 'department', name: '部門', icon: 'pi pi-users', color: '#fbc02d' },
  { id: 'custom', name: '自訂', icon: 'pi pi-circle', color: '#757575' },
  { id: 'root', name: '主節點', icon: 'pi pi-sitemap', color: '#512da8' }
];

export const MENUBAR_ITEMS: MenuItem[] = [
  {
    label: '節點',
    icon: 'pi pi-sitemap',
    items: NODE_TYPES.filter(nt => !nt.isLeaf).map(nt => ({
      label: `建立${nt.name}`,
      icon: nt.icon,
      id: nt.id
    }))
  },
  {
    label: '任務',
    icon: 'pi pi-list',
    items: [
      { label: '建立任務', icon: 'pi pi-plus', id: 'task' }
    ]
  }
];

export const DOCK_ITEMS: MenuItem[] = [
  { label: 'Home', icon: 'pi pi-home' },
  { label: 'Tree', icon: 'pi pi-th-large' },
  { label: 'TreeTable', icon: 'pi pi-sitemap' },
];

export const DOCK_CONTEXT_MENU_ITEMS: MenuItem[] = [
  { label: '重新整理', icon: 'pi pi-refresh' },
  { label: '回首頁', icon: 'pi pi-home' }
];
