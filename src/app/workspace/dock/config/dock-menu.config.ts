import type { MenuItem } from 'primeng/api';

export const MENUBAR_ITEMS: MenuItem[] = [
  {
    label: '檔案',
    icon: 'pi pi-file',
    items: [
      { label: '新增工作空間', icon: 'pi pi-plus-circle' }
    ]
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
