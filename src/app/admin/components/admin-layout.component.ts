import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { FirebaseService } from '../../core/services/firebase.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, PanelMenuModule, ButtonModule, PanelModule],
  template: `
    <div class="admin-layout">
      <p-panelMenu [model]="menuItems" style="width: 250px"></p-panelMenu>
      <div class="admin-content">
        <p-panel header="管理面板" [toggleable]="false">
          <button pButton type="button" label="返回首頁" icon="pi pi-home" class="p-button-text" routerLink="/"></button>
          <button pButton type="button" label="登出" icon="pi pi-sign-out" class="p-button-text" (click)="signOut()"></button>
        </p-panel>
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.admin-layout { display: flex; height: 100vh; }
     .admin-content { flex: 1; display: flex; flex-direction: column; }
     .content-area { flex: 1; padding: 2rem; overflow-y: auto; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  private firebaseService = inject(FirebaseService);
  menuItems = [
    { label: '儀表板', icon: 'pi pi-th-large', routerLink: '/admin' },
    { label: '用戶管理', icon: 'pi pi-users', routerLink: '/admin/users' },
    { label: '角色管理', icon: 'pi pi-id-card', routerLink: '/admin/roles' },
    { label: '權限管理', icon: 'pi pi-lock', routerLink: '/admin/permissions' }
  ];

  async signOut(): Promise<void> {
    try {
      await this.firebaseService.signOut();
    } catch (error) {
      console.error('登出失敗:', error);
    }
  }
} 