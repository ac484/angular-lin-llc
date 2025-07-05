import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule],
  template: `
    <mat-toolbar color="primary">
      <span class="brand">Angular Lin LLC</span>
      <span class="spacer"></span>
      
      <button mat-button routerLink="/" routerLinkActive="active">
        <mat-icon>home</mat-icon>
        首頁
      </button>
      
      <button mat-button routerLink="/workspace" routerLinkActive="active">
        <mat-icon>dashboard_customize</mat-icon>
        工作區
      </button>
      
      <button mat-button routerLink="/account" routerLinkActive="active">
        <mat-icon>account_circle</mat-icon>
        個人帳戶
      </button>
      
      <button mat-button [matMenuTriggerFor]="adminMenu" routerLinkActive="active">
        <mat-icon>admin_panel_settings</mat-icon>
        管理
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      
      <mat-menu #adminMenu="matMenu">
        <button mat-menu-item routerLink="/admin">
          <mat-icon>dashboard</mat-icon>
          <span>儀表板</span>
        </button>
        <button mat-menu-item routerLink="/admin/users">
          <mat-icon>people</mat-icon>
          <span>用戶管理</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .brand {
      font-weight: 500;
      font-size: 1.2rem;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {} 