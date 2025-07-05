import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MenubarModule, RouterModule],
  template: `
    <p-menubar [model]="items" class="p-0">
      <ng-template pTemplate="start">
        <span class="brand">Angular Lin LLC</span>
      </ng-template>
    </p-menubar>
  `,
  styles: [
    `.brand { font-weight: 500; font-size: 1.2rem; padding-left: 1rem; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {
  items = [
    { label: '首頁', routerLink: '/' },
    { label: '工作區', routerLink: '/workspace' },
    { label: '個人帳戶', routerLink: '/account' },
    {
      label: '管理',
      items: [
        { label: '儀表板', routerLink: '/admin' },
        { label: '用戶管理', routerLink: '/admin/users' },
        { label: '角色管理', routerLink: '/admin/roles' },
        { label: '權限管理', routerLink: '/admin/permissions' }
      ]
    }
  ];
} 