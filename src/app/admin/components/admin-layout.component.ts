import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FirebaseService } from '../../core/services/firebase.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="admin-container">
      <mat-sidenav #sidenav mode="side" opened class="admin-sidenav">
        <mat-toolbar color="primary">
          <span>管理面板</span>
        </mat-toolbar>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/admin" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>儀表板</span>
          </a>
          
          <a mat-list-item routerLink="/admin/users" routerLinkActive="active">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>用戶管理</span>
          </a>
          
          <a mat-list-item routerLink="/admin/roles" routerLinkActive="active">
            <mat-icon matListItemIcon>group</mat-icon>
            <span matListItemTitle>角色管理</span>
          </a>
          
          <a mat-list-item routerLink="/admin/permissions" routerLinkActive="active">
            <mat-icon matListItemIcon>security</mat-icon>
            <span matListItemTitle>權限管理</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content class="admin-content">
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="spacer"></span>
          <button mat-button routerLink="/">
            <mat-icon>home</mat-icon>
            返回首頁
          </button>
          <button mat-button (click)="signOut()">
            <mat-icon>logout</mat-icon>
            登出
          </button>
        </mat-toolbar>
        
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .admin-container {
      height: 100vh;
    }
    
    .admin-sidenav {
      width: 250px;
    }
    
    .admin-content {
      display: flex;
      flex-direction: column;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .content-area {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }
    
    .active {
      background-color: rgba(0, 0, 0, 0.1);
    }
    
    mat-nav-list a {
      transition: background-color 0.2s;
    }
    
    mat-nav-list a:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  private firebaseService = inject(FirebaseService);

  async signOut(): Promise<void> {
    try {
      await this.firebaseService.signOut();
    } catch (error) {
      console.error('登出失敗:', error);
    }
  }
} 