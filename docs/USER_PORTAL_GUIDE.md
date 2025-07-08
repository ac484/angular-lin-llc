# 使用者入口指南

## 目錄
- [簡介](#簡介)
- [功能](#功能)
- [前置條件](#前置條件)
- [核心元件](#核心元件)
- [實作要點](#實作要點)
- [範例](#範例)
- [參考資料](#參考資料)

## 簡介
此文件介紹使用者入口模組的功能，涵蓋用戶註冊、登入與個人資料管理。目標是提供一個安全、流暢的用戶身份驗證與管理流程，並確保程式碼簡潔、易於 AI 生成。

## 功能
- **使用者註冊**：支援電子郵件/密碼和第三方提供商（如 Google）註冊。
- **使用者登入**：支援電子郵件/密碼和第三方提供商（如 Google）登入。
- **個人資料管理**：允許用戶查看和編輯個人基本資訊。
- **密碼重置**：提供忘記密碼功能。

## 前置條件
- 已完成 [Firebase 設置指南](FIREBASE_SETUP.md) 中 Firebase Authentication 的初始化與配置。
- 已配置 [認證與權限指引](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md) 中 `ngx-permissions` (如果用戶權限與個人資料相關)。

## 核心元件
- `LoginComponent`：處理用戶登入。
- `RegisterComponent`：處理用戶註冊。
- `ProfileComponent`：展示和編輯用戶個人資料。

## 實作要點
- **Firebase Authentication SDK**：所有認證操作（登入、註冊、登出、密碼重置）都直接使用 Firebase 官方客戶端 SDK。
- **響應式表單**：使用 Angular 響應式表單處理用戶輸入和驗證。
- **錯誤處理**：所有認證操作的錯誤都應被捕獲並通過 [錯誤處理指南](ERROR_HANDLING_GUIDE.md) 中的 `NotificationService` 顯示友善提示。
- **路由守衛**：使用 Angular 路由守衛保護需要認證才能訪問的頁面，或使用 `ngx-permissions` 進行更細粒度的權限控制。

## 範例
### 1. `LoginComponent` (Google 登入範例)
```typescript
// src/app/users/containers/login/login.component.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Firebase Authentication。
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-login',
  template: `
    <mat-card>
      <mat-card-title>登入</mat-card-title>
      <mat-card-content>
        <button mat-raised-button color="primary" (click)="loginWithGoogle()">
          使用 Google 登入
        </button>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  loginWithGoogle(): void {
    this.firebaseService.loginWithGoogle().subscribe({
      next: (user) => {
        this.notificationService.showSuccess('登入成功！');
        this.router.navigate(['/projects']); // 導向專案列表或其他主頁面
      },
      error: (error) => {
        console.error('Google 登入失敗:', error);
        this.notificationService.showError('Google 登入失敗，請重試。');
      }
    });
  }
}
```

### 2. `RegisterComponent` (電子郵件註冊範例)
```typescript
// src/app/users/containers/register/register.component.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Firebase Authentication。
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-register',
  template: `
    <mat-card>
      <mat-card-title>註冊</mat-card-title>
      <mat-card-content>
        <form [formGroup]="registerForm" (ngSubmit)="register()">
          <mat-form-field appearance="fill">
            <mat-label>電子郵件</mat-label>
            <input matInput formControlName="email" type="email" required>
            <mat-error *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              請輸入有效的電子郵件
            </mat-error>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>密碼</mat-label>
            <input matInput formControlName="password" type="password" required>
            <mat-error *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              密碼至少需要 6 個字元
            </mat-error>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid">
            註冊
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.firebaseService.registerWithEmail(email, password).subscribe({
        next: (userCredential) => {
          this.notificationService.showSuccess('註冊成功！歡迎加入。');
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          console.error('註冊失敗:', error);
          this.notificationService.showError('註冊失敗，請重試。');
        }
      });
    }
  }
}
```

## 參考資料
- [Firebase Authentication 官方文檔](https://firebase.google.com/docs/auth)
- [Firebase 設置指南](FIREBASE_SETUP.md)
- [認證與權限指引](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md)
- [錯誤處理指南](ERROR_HANDLING_GUIDE.md)

---
