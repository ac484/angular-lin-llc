import type { MenuItem } from 'primeng/api';
import { NODE_TYPES } from '../models/workspace.types';

export const MENUBAR_ITEMS: MenuItem[] = [
  {
    label: '檔案',
    icon: 'pi pi-file',
    items: NODE_TYPES.map(type => ({
      label: type.name,
      icon: type.id === 'root' ? 'pi pi-sitemap' : type.id === 'branch' ? 'pi pi-folder' : 'pi pi-file',
      id: type.id,
      command: (event: any) => {
        // 這裡 command 只做佔位，實際在 component 處理
      }
    }))
  }
];

export const DOCK_ITEMS: MenuItem[] = [
  { label: 'Home', icon: 'pi pi-home' },
  { label: 'Tree', icon: 'pi pi-th-large' },
  { label: 'TreeTable', icon: 'pi pi-sitemap' },
  { label: 'Table', icon: 'pi pi-table' }
];

export const DOCK_CONTEXT_MENU_ITEMS: MenuItem[] = [
  { label: '重新整理', icon: 'pi pi-refresh' },
  { label: '回首頁', icon: 'pi pi-home' }
];
