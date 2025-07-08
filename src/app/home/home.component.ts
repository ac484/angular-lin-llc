import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="home-container">
      <mat-card class="welcome-card">
        <mat-card-header>
          <mat-card-title>歡迎來到 Angular Lin LLC</mat-card-title>
          <mat-card-subtitle>極簡主義的現代化應用程式</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <p>這是一個基於 Angular 19 和 Firebase 的極簡主義工業應用程式。</p>
          <p>遵循「少即是多」的設計原則，專注於核心用戶管理功能。</p>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/admin">
            <mat-icon>admin_panel_settings</mat-icon>
            管理面板
          </button>
          <button mat-raised-button color="accent" routerLink="/login">
            <mat-icon>login</mat-icon>
            登入
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem;
    }
    
    .welcome-card {
      max-width: 500px;
      width: 100%;
      text-align: center;
    }
    
    mat-card-content {
      margin: 1rem 0;
    }
    
    mat-card-actions {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {} 