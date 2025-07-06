import type { MenuItem } from 'primeng/api';

export const MENUBAR_ITEMS: MenuItem[] = [
  {
    label: '檔案',
    icon: 'pi pi-file',
    items: [
      { label: '新增工作空間', icon: 'pi pi-plus-circle' }
    ]
  },
  {
    label: '節點',
    icon: 'pi pi-sitemap',
    items: [
      { label: '建立節點', icon: 'pi pi-plus' }
    ]
  },
  {
    label: '任務',
    icon: 'pi pi-list',
    items: [
      { label: '建立任務', icon: 'pi pi-plus' }
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
