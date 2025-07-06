import type { MenuItem } from 'primeng/api';

export const MENUBAR_ITEMS: MenuItem[] = [
  {
    label: '檔案',
    icon: 'pi pi-file',
    items: [
      { label: '新增', icon: 'pi pi-plus' },
      { label: '開啟', icon: 'pi pi-folder-open' },
      { label: '重新載入', icon: 'pi pi-refresh' },
      { label: '讀取工作空間', icon: 'pi pi-database' },
      { label: '新增工作空間', icon: 'pi pi-plus-circle' }
    ]
  },
  {
    label: '編輯',
    icon: 'pi pi-pencil',
    items: [
      { label: '剪下', icon: 'pi pi-cut' },
      { label: '複製', icon: 'pi pi-copy' }
    ]
  },
  {
    label: '節點',
    icon: 'pi pi-sitemap',
    items: [
      { label: '建立節點', icon: 'pi pi-plus' }
    ]
  }
];

export const DOCK_ITEMS: MenuItem[] = [
  { label: 'Finder', icon: 'pi pi-home' },
  { label: 'Tree', icon: 'pi pi-th-large' },
  { label: 'TreeTable', icon: 'pi pi-sitemap' },
  { label: 'Trash', icon: 'pi pi-trash' }
];

export const DOCK_CONTEXT_MENU_ITEMS: MenuItem[] = [
  { label: '重新整理', icon: 'pi pi-refresh' },
  { label: '回首頁', icon: 'pi pi-home' }
];
