import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterModule],
  template: `
    <div class="home-container">
      <p-card header="歡迎來到 Angular Lin LLC" subheader="極簡主義的現代化應用程式">
        <div class="home-content">
          <p>這是一個基於 Angular 19 和 Firebase 的極簡主義工業應用程式。</p>
          <p>遵循「少即是多」的設計原則，專注於核心用戶管理功能。</p>
        </div>
        <ng-template pTemplate="footer">
          <button pButton type="button" label="管理面板" icon="pi pi-cog" class="p-button-primary" routerLink="/admin"></button>
          <button pButton type="button" label="登入" icon="pi pi-sign-in" class="p-button-secondary" routerLink="/login"></button>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [
    `.home-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 2rem; }
     .home-content { margin: 1rem 0; }
     :host ::ng-deep .p-card-footer { display: flex; gap: 1rem; justify-content: center; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {} 