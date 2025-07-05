# 認證與權限指引

## 目錄
- [簡介](#簡介)
- [技術棧](#技術棧)
- [前置條件](#前置條件)
- [核心概念](#核心概念)
- [實作要點](#實作要點)
- [Firestore 權限數據模型](#firestore-權限數據模型)
- [完整實作流程](#完整實作流程)
  - [用戶註冊與首次登入流程](#1-用戶註冊與首次登入流程)
  - [權限守衛配置與使用](#2-權限守衛配置與使用)
  - [權限管理服務](#3-權限管理服務)
  - [Firestore 安全規則](#4-firestore-安全規則)
  - [錯誤處理與回退機制](#5-錯誤處理與回退機制)
  - [效能優化建議](#6-效能優化建議)
- [範例](#範例)
- [參考資料](#參考資料)

## 簡介
此文件詳細說明如何整合 Firebase Authentication 進行用戶認證（支援 Google 帳號與電子郵件/密碼），並結合 Firestore 實現彈性角色設計與細粒度權限矩陣控管，最終使用 `ngx-permissions` 實現前端細粒度權限管理，確保系統安全、靈活性與集中化管理。

## 技術棧
- Angular 19 (TypeScript 嚴格模式)
- `@angular/fire` (官方 Firebase Angular SDK)
- `firebase` (Firebase Client SDK)
- `ngx-permissions` (細粒度權限管理)
- Firebase Authentication (Email/Google 登入)
- Firebase App Check (強制模式，防止未授權存取)

## 前置條件
- 已完成 [Firebase 設置指南](FIREBASE_SETUP.md) 中的 Firebase 專案初始化與配置。
- 已在 Firebase Console 啟用 Authentication (Email/Password, Google) 與 App Check (reCAPTCHA v3)。

## 核心概念
- **Firebase Authentication**：提供用戶註冊、登入與會話管理，支援 Google 帳號與電子郵件/密碼方式。
- **Firebase Firestore**：作為**核心權限數據庫**，集中儲存所有角色（如 guest、viewer、editor、admin 等）與對應權限（如 project.view、task.create、log.approve 等）的矩陣。
- **`ngx-permissions`**：前端權限控制庫，基於 Firestore 動態載入的角色/權限定義 UI 元素的顯示與否，以及路由的訪問權限。
- **權限矩陣動態載入**：用戶登入後，系統會從 Firestore 動態讀取其角色與權限，並交由 `ngx-permissions` 進行實時控制。
- **App Check 強制模式**：確保所有 Firebase 請求都來自合法的應用程式實例，增強安全性。

## 實作要點
此處詳細說明整合 Firebase Authentication 與 `ngx-permissions` 的具體實作步驟，並著重於權限數據由 Firestore 動態載入的流程。

1.  **Firebase 專案設置與初始化**：
    -   確保已完成 [Firebase 設置指南](FIREBASE_SETUP.md) 中的 Firebase 專案初始化與配置，包括啟用 Authentication (Email/Password, Google) 和 App Check (reCAPTCHA v3)。
    -   在 `app.config.ts` (或 `app.module.ts`) 中正確初始化 Firebase 應用和相關服務（Auth, Firestore, App Check），確保它們在應用程式啟動時可用。

2.  **App Check 配置與強制模式**：
    -   啟用並配置 App Check，建議在生產環境中將其設置為「強制模式」，以確保所有對 Firebase 後端服務的請求都來自合法的應用程式實例。

3.  **Firestore 權限數據模型設計**：
    -   在 Firestore 中設計並儲存角色 (`roles`) 與對應權限 (`permissions`) 的集合。
    -   建議為每個角色定義一個文檔，其中包含該角色擁有的權限列表，例如：
        ```
        // Firestore Collection: roles
        // Document ID: 'admin'
        {
          name: 'admin',
          permissions: ['*', 'user.manage', 'project.create', 'task.delete', 'log.approve']
        }
        // Document ID: 'editor'
        {
          name: 'editor',
          permissions: ['project.view', 'project.edit', 'task.create', 'task.edit']
        }
        // Document ID: 'viewer'
        {
          name: 'viewer',
          permissions: ['project.view', 'task.view']
        }
        ```
    -   **用戶角色與權限**：`ProjectUser` 介面應包含 `role` (字串) 和 `permissions` (字串陣列) 屬性，用於儲存用戶的當前角色和其擁有的具體權限列表。`permissions` 陣列將在登入時從 Firestore 根據用戶的 `role` 動態載入。

4.  **用戶登入與權限動態載入**：
    -   用戶成功登入 (無論是 Google 帳號或電子郵件/密碼) 後，透過 `FirebaseService` 獲取用戶資料。
    -   `FirebaseService` 應包含一個方法，用於根據用戶的 `uid` 或 `role` 從 Firestore 中讀取該用戶的詳細資訊，包括其被賦予的角色。
    -   根據獲取的 `role`，查詢 Firestore 的 `roles` 集合，動態載入該角色所對應的 `permissions` 列表。
    -   將載入的 `permissions` 列表傳遞給 `ngx-permissions` 服務 (`NgxPermissionsService.loadPermissions()`)，以便其管理前端權限。

5.  **`ngx-permissions` 應用與前端控制**：
    -   在 Angular 元件的 TypeScript 邏輯中，使用 `NgxPermissionsService` 的方法（如 `hasPermission()`）來判斷用戶是否具有特定權限，進而控制業務邏輯。
    -   在 HTML 模板中，使用 `*ngxPermissionsOnly` 和 `*ngxPermissionsExcept` 等結構型指令來控制 UI 元素的顯示與否，實現細粒度的介面權限控制。
    -   對於路由保護，可使用 `NgxPermissionsGuard` 來限制特定路由的訪問權限，確保未經授權的用戶無法導航到受保護的頁面。

## 完整實作流程

### 1. 用戶註冊與首次登入流程

#### 1.1 新用戶自動註冊機制
當用戶首次使用 Google 或電子郵件登入時，系統需要自動在 Firestore 中創建用戶文檔。

```typescript
// src/app/core/services/firebase.service.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Firebase Authentication 及 Cloud Firestore。

import { setDoc, updateProfile, createUserWithEmailAndPassword } from '@angular/fire/auth';

/**
 * @method createUserInFirestore
 * @description 在 Firestore 中創建新用戶文檔
 * @param firebaseUser Firebase 用戶物件
 * @param defaultRole 預設角色，通常為 'guest' 或 'viewer'
 * @returns Promise<void>
 */
async createUserInFirestore(firebaseUser: any, defaultRole: string = 'guest'): Promise<void> {
  const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
  
  const newUser = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || '',
    role: defaultRole,
    isActive: true,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    customFields: {}
  };

  try {
    await setDoc(userDocRef, newUser);
    console.log('新用戶文檔創建成功:', firebaseUser.uid);
  } catch (error) {
    console.error('創建用戶文檔失敗:', error);
    throw error;
  }
}

/**
 * @method loginWithGoogle
 * @description 更新後的 Google 登入方法，包含新用戶自動註冊
 */
loginWithGoogle(): Observable<ProjectUser> {
  return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
    switchMap(result => {
      const firebaseUser = result.user;
      if (!firebaseUser || !firebaseUser.uid) {
        return throwError(() => new Error('無法獲取 Firebase 用戶 UID'));
      }
      
      // 步驟 1: 從 Firestore 獲取用戶資料
      return this.getUserDataFromFirestore(firebaseUser.uid).pipe(
        switchMap(projectUser => {
          if (!projectUser) {
            // 新用戶：創建 Firestore 文檔
            console.log('檢測到新用戶，正在創建用戶文檔...');
            return from(this.createUserInFirestore(firebaseUser, 'guest')).pipe(
              switchMap(() => {
                // 創建完成後重新獲取用戶資料
                return this.getUserDataFromFirestore(firebaseUser.uid).pipe(
                  map(user => user as ProjectUser)
                );
              })
            );
          }
          return of(projectUser);
        }),
        // 步驟 2: 載入權限
        switchMap(userWithRole => {
          return this.getPermissionsByRole(userWithRole.role).pipe(
            map(permissions => ({
              ...userWithRole,
              permissions: permissions
            }))
          );
        })
      );
    })
  );
}
```

#### 1.2 電子郵件/密碼註冊
```typescript
// src/app/core/services/firebase.service.ts

/**
 * @method registerWithEmail
 * @description 電子郵件/密碼註冊
 * @param email 電子郵件
 * @param password 密碼
 * @param displayName 顯示名稱（可選）
 * @returns Observable<ProjectUser>
 */
registerWithEmail(email: string, password: string, displayName?: string): Observable<ProjectUser> {
  return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
    switchMap(result => {
      const firebaseUser = result.user;
      
      // 更新顯示名稱（如果提供）
      if (displayName) {
        return from(updateProfile(firebaseUser, { displayName })).pipe(
          switchMap(() => this.createUserInFirestore(firebaseUser, 'viewer')),
          switchMap(() => this.getUserDataFromFirestore(firebaseUser.uid)),
          switchMap(user => {
            if (!user) {
              return throwError(() => new Error('用戶創建失敗'));
            }
            return this.getPermissionsByRole(user.role).pipe(
              map(permissions => ({
                ...user,
                permissions: permissions
              }))
            );
          })
        );
      } else {
        return from(this.createUserInFirestore(firebaseUser, 'viewer')).pipe(
          switchMap(() => this.getUserDataFromFirestore(firebaseUser.uid)),
          switchMap(user => {
            if (!user) {
              return throwError(() => new Error('用戶創建失敗'));
            }
            return this.getPermissionsByRole(user.role).pipe(
              map(permissions => ({
                ...user,
                permissions: permissions
              }))
            );
          })
        );
      }
    })
  );
}
```

### 2. 權限守衛配置與使用

#### 2.1 路由權限守衛
```typescript
// src/app/core/guards/permissions.guard.ts
// 本檔案為權限守衛，用於保護需要特定權限的路由。

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  constructor(
    private permissionsService: NgxPermissionsService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // 從路由配置中獲取所需權限
    const requiredPermissions = route.data['permissions'] as string[];
    
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return of(true); // 沒有權限要求，允許訪問
    }

    // 檢查用戶是否具有所需權限
    return this.permissionsService.hasPermission(requiredPermissions).pipe(
      map(hasPermission => {
        if (hasPermission) {
          return true;
        } else {
          // 權限不足，導向錯誤頁面或登入頁面
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }),
      catchError(() => {
        // 發生錯誤時，導向登入頁面
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
```

#### 2.2 路由配置範例
```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PermissionsGuard } from './core/guards/permissions.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // 需要特定權限的路由
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: ['project.view'] }
  },
  
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: ['admin'] }
  },
  
  {
    path: 'admin/users',
    component: UserManagementComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: ['user.manage'] }
  },
  
  // 錯誤頁面
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '/home' }
];
```

### 3. 權限管理服務

#### 3.1 權限驗證服務
```typescript
// src/app/core/services/permissions.service.ts
// 本檔案為權限管理服務，提供權限檢查和管理的功能。

import { Injectable } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  constructor(private ngxPermissionsService: NgxPermissionsService) {}

  /**
   * @method hasPermission
   * @description 檢查用戶是否具有指定權限
   * @param permission 權限名稱
   * @returns Observable<boolean>
   */
  hasPermission(permission: string): Observable<boolean> {
    return this.ngxPermissionsService.hasPermission(permission);
  }

  /**
   * @method hasAnyPermission
   * @description 檢查用戶是否具有任一指定權限
   * @param permissions 權限名稱陣列
   * @returns Observable<boolean>
   */
  hasAnyPermission(permissions: string[]): Observable<boolean> {
    return this.ngxPermissionsService.hasPermission(permissions);
  }

  /**
   * @method hasAllPermissions
   * @description 檢查用戶是否具有所有指定權限
   * @param permissions 權限名稱陣列
   * @returns Observable<boolean>
   */
  hasAllPermissions(permissions: string[]): Observable<boolean> {
    return this.ngxPermissionsService.hasPermission(permissions).pipe(
      map(hasAny => hasAny && permissions.every(permission => 
        this.ngxPermissionsService.getPermission(permission)
      ))
    );
  }

  /**
   * @method getCurrentPermissions
   * @description 獲取當前用戶的所有權限
   * @returns string[]
   */
  getCurrentPermissions(): string[] {
    return this.ngxPermissionsService.getPermissions();
  }

  /**
   * @method refreshPermissions
   * @description 重新載入用戶權限（用於權限更新後）
   * @param permissions 新的權限列表
   */
  refreshPermissions(permissions: string[]): void {
    this.ngxPermissionsService.loadPermissions(permissions);
  }
}
```

#### 3.2 在元件中使用權限服務
```typescript
// src/app/projects/components/project-list.component.ts
// 本檔案為專案列表元件，展示如何在元件中使用權限服務。

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PermissionsService } from 'src/app/core/services/permissions.service';

@Component({
  selector: 'app-project-list',
  template: `
    <div class="project-list">
      <h2>專案列表</h2>
      
      <!-- 只有具有 project.create 權限的用戶才能看到新增按鈕 -->
      <button 
        *ngIf="canCreateProject$ | async" 
        mat-raised-button 
        color="primary" 
        (click)="createProject()">
        新增專案
      </button>
      
      <div class="projects">
        <mat-card *ngFor="let project of projects$ | async">
          <mat-card-title>{{ project.name }}</mat-card-title>
          <mat-card-content>{{ project.description }}</mat-card-content>
          <mat-card-actions>
            <!-- 只有具有 project.edit 權限的用戶才能看到編輯按鈕 -->
            <button 
              *ngIf="canEditProject$ | async" 
              mat-button 
              (click)="editProject(project.id)">
              編輯
            </button>
            
            <!-- 只有具有 project.delete 權限的用戶才能看到刪除按鈕 -->
            <button 
              *ngIf="canDeleteProject$ | async" 
              mat-button 
              color="warn" 
              (click)="deleteProject(project.id)">
              刪除
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {
  canCreateProject$: Observable<boolean>;
  canEditProject$: Observable<boolean>;
  canDeleteProject$: Observable<boolean>;
  projects$: Observable<Project[]>;

  constructor(
    private permissionsService: PermissionsService,
    private projectService: ProjectService
  ) {
    // 初始化權限檢查
    this.canCreateProject$ = this.permissionsService.hasPermission('project.create');
    this.canEditProject$ = this.permissionsService.hasPermission('project.edit');
    this.canDeleteProject$ = this.permissionsService.hasPermission('project.delete');
  }

  ngOnInit(): void {
    this.projects$ = this.projectService.getProjects();
  }

  createProject(): void {
    // 實作新增專案邏輯
  }

  editProject(projectId: string): void {
    // 實作編輯專案邏輯
  }

  deleteProject(projectId: string): void {
    // 實作刪除專案邏輯
  }
}
```

### 4. Firestore 安全規則

#### 4.1 完整的 Firestore 安全規則
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 角色集合：只有管理員可以讀寫
    match /roles/{roleId} {
      allow read: if request.auth != null && 
        (request.auth.token.role == 'admin' || 
         request.auth.token.role == 'manager');
      allow write: if request.auth != null && 
        request.auth.token.role == 'admin';
    }
    
    // 用戶集合：用戶只能讀寫自己的資料，管理員可以讀寫所有用戶資料
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         request.auth.token.role == 'admin' || 
         request.auth.token.role == 'manager');
      allow create: if request.auth != null && 
        request.auth.uid == userId;
      allow update: if request.auth != null && 
        (request.auth.uid == userId || 
         request.auth.token.role == 'admin' || 
         request.auth.token.role == 'manager');
      allow delete: if request.auth != null && 
        request.auth.token.role == 'admin';
    }
    
    // 專案集合：根據專案權限控制
    match /projects/{projectId} {
      allow read: if request.auth != null && 
        (resource.data.isPublic == true || 
         resource.data.ownerId == request.auth.uid ||
         request.auth.token.role == 'admin' ||
         request.auth.token.role == 'manager');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid ||
         request.auth.token.role == 'admin' ||
         request.auth.token.role == 'manager');
      allow delete: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid ||
         request.auth.token.role == 'admin');
    }
    
    // 任務集合：根據專案權限控制
    match /tasks/{taskId} {
      allow read: if request.auth != null && 
        (resource.data.isPublic == true || 
         resource.data.assignedToId == request.auth.uid ||
         request.auth.token.role == 'admin' ||
         request.auth.token.role == 'manager');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.assignedToId == request.auth.uid ||
         request.auth.token.role == 'admin' ||
         request.auth.token.role == 'manager');
      allow delete: if request.auth != null && 
        (resource.data.assignedToId == request.auth.uid ||
         request.auth.token.role == 'admin');
    }
  }
}
```

### 5. 錯誤處理與回退機制

#### 5.1 權限載入失敗處理
```typescript
// src/app/core/services/firebase.service.ts

/**
 * @method getPermissionsByRole
 * @description 更新後的權限載入方法，包含錯誤處理和回退機制
 */
getPermissionsByRole(roleName: string): Observable<string[]> {
  const roleDocRef = doc(this.firestore, `roles/${roleName}`);
  
  return from(getDoc(roleDocRef)).pipe(
    map(docSnap => {
      if (docSnap.exists()) {
        const roleData = docSnap.data();
        return roleData['permissions'] as string[] || [];
      } else {
        console.warn('Firestore 中找不到角色權限資料:', roleName);
        // 回退到預設權限
        return this.getDefaultPermissions(roleName);
      }
    }),
    catchError(error => {
      console.error('載入權限失敗:', error);
      // 發生錯誤時回退到預設權限
      return of(this.getDefaultPermissions(roleName));
    })
  );
}
```

#### 5.2 Firebase 錯誤處理範例
```typescript
// 範例：處理 Firebase Authentication 錯誤
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Firebase Authentication。
import { AuthErrorCodes } from '@angular/fire/auth';
import { NotificationService } from 'src/app/core/services/notification.service';

export class AuthService {
  constructor(private notificationService: NotificationService) {}

  loginWithEmail(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .catch(error => {
        let errorMessage = '登入失敗';
        switch (error.code) {
          case AuthErrorCodes.INVALID_EMAIL:
            errorMessage = '無效的電子郵件地址。';
            break;
          case AuthErrorCodes.USER_DISABLED:
            errorMessage = '此帳戶已被禁用。';
            break;
          case AuthErrorCodes.USER_NOT_FOUND:
          case AuthErrorCodes.WRONG_PASSWORD:
            errorMessage = '電子郵件或密碼不正確。';
            break;
          case AuthErrorCodes.TOO_MANY_REQUESTS:
            errorMessage = '太多次登入嘗試，請稍後再試。';
            break;
          default:
            errorMessage = `Firebase 錯誤: ${error.message}`;
        }
        console.error(errorMessage, error);
        this.notificationService.showError(errorMessage);
        throw error; // 重新拋出錯誤以便上層處理
      });
  }
}
```

## 完整實作流程

### 1. 用戶註冊與首次登入流程

#### 1.1 新用戶自動註冊機制
當用戶首次使用 Google 或電子郵件登入時，系統需要自動在 Firestore 中創建用戶文檔。

```typescript
// src/app/core/services/firebase.service.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Firebase Authentication 及 Cloud Firestore。

/**
 * @method createUserInFirestore
 * @description 在 Firestore 中創建新用戶文檔
 * @param firebaseUser Firebase 用戶物件
 * @param defaultRole 預設角色，通常為 'guest' 或 'viewer'
 * @returns Promise<void>
 */
async createUserInFirestore(firebaseUser: any, defaultRole: string = 'guest'): Promise<void> {
  const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
  
  const newUser = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || '',
    role: defaultRole,
    isActive: true,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    customFields: {}
  };

  try {
    await setDoc(userDocRef, newUser);
    console.log('新用戶文檔創建成功:', firebaseUser.uid);
  } catch (error) {
    console.error('創建用戶文檔失敗:', error);
    throw error;
  }
}

/**
 * @method loginWithGoogle
 * @description 更新後的 Google 登入方法，包含新用戶自動註冊
 */
loginWithGoogle(): Observable<ProjectUser> {
  return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
    switchMap(result => {
      const firebaseUser = result.user;
      if (!firebaseUser || !firebaseUser.uid) {
        return throwError(() => new Error('無法獲取 Firebase 用戶 UID'));
      }
      
      // 步驟 1: 從 Firestore 獲取用戶資料
      return this.getUserDataFromFirestore(firebaseUser.uid).pipe(
        switchMap(projectUser => {
          if (!projectUser) {
            // 新用戶：創建 Firestore 文檔
            console.log('檢測到新用戶，正在創建用戶文檔...');
            return from(this.createUserInFirestore(firebaseUser, 'guest')).pipe(
              switchMap(() => {
                // 創建完成後重新獲取用戶資料
                return this.getUserDataFromFirestore(firebaseUser.uid).pipe(
                  map(user => user as ProjectUser)
                );
              })
            );
          }
          return of(projectUser);
        }),
        // 步驟 2: 載入權限
        switchMap(userWithRole => {
          return this.getPermissionsByRole(userWithRole.role).pipe(
            map(permissions => ({
              ...userWithRole,
              permissions: permissions
            }))
          );
        })
      );
    })
  );
}
```

#### 1.2 電子郵件/密碼註冊
```typescript
// src/app/core/services/firebase.service.ts

/**
 * @method registerWithEmail
 * @description 電子郵件/密碼註冊
 * @param email 電子郵件
 * @param password 密碼
 * @param displayName 顯示名稱（可選）
 * @returns Observable<ProjectUser>
 */
registerWithEmail(email: string, password: string, displayName?: string): Observable<ProjectUser> {
  return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
    switchMap(result => {
      const firebaseUser = result.user;
      
      // 更新顯示名稱（如果提供）
      if (displayName) {
        return from(updateProfile(firebaseUser, { displayName })).pipe(
          switchMap(() => this.createUserInFirestore(firebaseUser, 'viewer')),
          switchMap(() => this.getUserDataFromFirestore(firebaseUser.uid)),
          switchMap(user => {
            if (!user) {
              return throwError(() => new Error('用戶創建失敗'));
            }
            return this.getPermissionsByRole(user.role).pipe(
              map(permissions => ({
                ...user,
                permissions: permissions
              }))
            );
          })
        );
      } else {
        return from(this.createUserInFirestore(firebaseUser, 'viewer')).pipe(
          switchMap(() => this.getUserDataFromFirestore(firebaseUser.uid)),
          switchMap(user => {
            if (!user) {
              return throwError(() => new Error('用戶創建失敗'));
            }
            return this.getPermissionsByRole(user.role).pipe(
              map(permissions => ({
                ...user,
                permissions: permissions
              }))
            );
          })
        );
      }
    })
  );
}
```

### 2. 權限守衛配置與使用

#### 2.1 路由權限守衛
```typescript
// src/app/core/guards/permissions.guard.ts
// 本檔案為權限守衛，用於保護需要特定權限的路由。

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  constructor(
    private permissionsService: NgxPermissionsService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // 從路由配置中獲取所需權限
    const requiredPermissions = route.data['permissions'] as string[];
    
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return of(true); // 沒有權限要求，允許訪問
    }

    // 檢查用戶是否具有所需權限
    return this.permissionsService.hasPermission(requiredPermissions).pipe(
      map(hasPermission => {
        if (hasPermission) {
          return true;
        } else {
          // 權限不足，導向錯誤頁面或登入頁面
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }),
      catchError(() => {
        // 發生錯誤時，導向登入頁面
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
```

#### 2.2 路由配置範例
```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PermissionsGuard } from './core/guards/permissions.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // 需要特定權限的路由
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: ['project.view'] }
  },
  
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: ['admin'] }
  },
  
  {
    path: 'admin/users',
    component: UserManagementComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: ['user.manage'] }
  },
  
  // 錯誤頁面
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '/home' }
];
```

### 3. 權限管理服務

#### 3.1 權限驗證服務
```typescript
// src/app/core/services/permissions.service.ts
// 本檔案為權限管理服務，提供權限檢查和管理的功能。

import { Injectable } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  constructor(private ngxPermissionsService: NgxPermissionsService) {}

  /**
   * @method hasPermission
   * @description 檢查用戶是否具有指定權限
   * @param permission 權限名稱
   * @returns Observable<boolean>
   */
  hasPermission(permission: string): Observable<boolean> {
    return this.ngxPermissionsService.hasPermission(permission);
  }

  /**
   * @method hasAnyPermission
   * @description 檢查用戶是否具有任一指定權限
   * @param permissions 權限名稱陣列
   * @returns Observable<boolean>
   */
  hasAnyPermission(permissions: string[]): Observable<boolean> {
    return this.ngxPermissionsService.hasPermission(permissions);
  }

  /**
   * @method hasAllPermissions
   * @description 檢查用戶是否具有所有指定權限
   * @param permissions 權限名稱陣列
   * @returns Observable<boolean>
   */
  hasAllPermissions(permissions: string[]): Observable<boolean> {
    return this.ngxPermissionsService.hasPermission(permissions).pipe(
      map(hasAny => hasAny && permissions.every(permission => 
        this.ngxPermissionsService.getPermission(permission)
      ))
    );
  }

  /**
   * @method getCurrentPermissions
   * @description 獲取當前用戶的所有權限
   * @returns string[]
   */
  getCurrentPermissions(): string[] {
    return this.ngxPermissionsService.getPermissions();
  }

  /**
   * @method refreshPermissions
   * @description 重新載入用戶權限（用於權限更新後）
   * @param permissions 新的權限列表
   */
  refreshPermissions(permissions: string[]): void {
    this.ngxPermissionsService.loadPermissions(permissions);
  }
}
```

#### 3.2 在元件中使用權限服務
```typescript
// src/app/projects/components/project-list.component.ts
// 本檔案為專案列表元件，展示如何在元件中使用權限服務。

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PermissionsService } from 'src/app/core/services/permissions.service';

@Component({
  selector: 'app-project-list',
  template: `
    <div class="project-list">
      <h2>專案列表</h2>
      
      <!-- 只有具有 project.create 權限的用戶才能看到新增按鈕 -->
      <button 
        *ngIf="canCreateProject$ | async" 
        mat-raised-button 
        color="primary" 
        (click)="createProject()">
        新增專案
      </button>
      
      <div class="projects">
        <mat-card *ngFor="let project of projects$ | async">
          <mat-card-title>{{ project.name }}</mat-card-title>
          <mat-card-content>{{ project.description }}</mat-card-content>
          <mat-card-actions>
            <!-- 只有具有 project.edit 權限的用戶才能看到編輯按鈕 -->
            <button 
              *ngIf="canEditProject$ | async" 
              mat-button 
              (click)="editProject(project.id)">
              編輯
            </button>
            
            <!-- 只有具有 project.delete 權限的用戶才能看到刪除按鈕 -->
            <button 
              *ngIf="canDeleteProject$ | async" 
              mat-button 
              color="warn" 
              (click)="deleteProject(project.id)">
              刪除
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {
  canCreateProject$: Observable<boolean>;
  canEditProject$: Observable<boolean>;
  canDeleteProject$: Observable<boolean>;
  projects$: Observable<Project[]>;

  constructor(
    private permissionsService: PermissionsService,
    private projectService: ProjectService
  ) {
    // 初始化權限檢查
    this.canCreateProject$ = this.permissionsService.hasPermission('project.create');
    this.canEditProject$ = this.permissionsService.hasPermission('project.edit');
    this.canDeleteProject$ = this.permissionsService.hasPermission('project.delete');
  }

  ngOnInit(): void {
    this.projects$ = this.projectService.getProjects();
  }

  createProject(): void {
    // 實作新增專案邏輯
  }

  editProject(projectId: string): void {
    // 實作編輯專案邏輯
  }

  deleteProject(projectId: string): void {
    // 實作刪除專案邏輯
  }
}
```

### 4. Firestore 安全規則

#### 4.1 完整的 Firestore 安全規則
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 角色集合：只有管理員可以讀寫
    match /roles/{roleId} {
      allow read: if request.auth != null && 
        (request.auth.token.role == 'admin' || 
         request.auth.token.role == 'manager');
      allow write: if request.auth != null && 
        request.auth.token.role == 'admin';
    }
    
    // 用戶集合：用戶只能讀寫自己的資料，管理員可以讀寫所有用戶資料
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         request.auth.token.role == 'admin' || 
         request.auth.token.role == 'manager');
      allow create: if request.auth != null && 
        request.auth.uid == userId;
      allow update: if request.auth != null && 
        (request.auth.uid == userId || 
         request.auth.token.role == 'admin' || 
         request.auth.token.role == 'manager');
      allow delete: if request.auth != null && 
        request.auth.token.role == 'admin';
    }
    
    // 專案集合：根據專案權限控制
    match /projects/{projectId} {
      allow read: if request.auth != null && 
        (resource.data.isPublic == true || 
         resource.data.ownerId == request.auth.uid ||
         request.auth.token.role == 'admin' ||
         request.auth.token.role == 'manager');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid ||
         request.auth.token.role == 'admin' ||
         request.auth.token.role == 'manager');
      allow delete: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid ||
         request.auth.token.role == 'admin');
    }
    
    // 任務集合：根據專案權限控制
    match /tasks/{taskId} {
      allow read: if request.auth != null && 
        (resource.data.isPublic == true || 
         resource.data.assignedToId == request.auth.uid ||
         request.auth.token.role == 'admin' ||
         request.auth.token.role == 'manager');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.assignedToId == request.auth.uid ||
         request.auth.token.role == 'admin' ||
         request.auth.token.role == 'manager');
      allow delete: if request.auth != null && 
        (resource.data.assignedToId == request.auth.uid ||
         request.auth.token.role == 'admin');
    }
  }
}
```

### 5. 錯誤處理與回退機制

#### 5.1 權限載入失敗處理
```typescript
// src/app/core/services/firebase.service.ts

/**
 * @method getPermissionsByRole
 * @description 更新後的權限載入方法，包含錯誤處理和回退機制
 */
getPermissionsByRole(roleName: string): Observable<string[]> {
  const roleDocRef = doc(this.firestore, `roles/${roleName}`);
  
  return from(getDoc(roleDocRef)).pipe(
    map(docSnap => {
      if (docSnap.exists()) {
        const roleData = docSnap.data();
        return roleData['permissions'] as string[] || [];
      } else {
        console.warn('Firestore 中找不到角色權限資料:', roleName);
        // 回退到預設權限
        return this.getDefaultPermissions(roleName);
      }
    }),
    catchError(error => {
      console.error('載入權限失敗:', error);
      // 發生錯誤時回退到預設權限
      return of(this.getDefaultPermissions(roleName));
    })
  );
}
```

#### 5.2 Firebase 錯誤處理範例
```typescript
// 範例：處理 Firebase Authentication 錯誤
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Firebase Authentication。
import { AuthErrorCodes } from '@angular/fire/auth';
import { NotificationService } from 'src/app/core/services/notification.service';

export class AuthService {
  constructor(private notificationService: NotificationService) {}

  loginWithEmail(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .catch(error => {
        let errorMessage = '登入失敗';
        switch (error.code) {
          case AuthErrorCodes.INVALID_EMAIL:
            errorMessage = '無效的電子郵件地址。';
            break;
          case AuthErrorCodes.USER_DISABLED:
            errorMessage = '此帳戶已被禁用。';
            break;
          case AuthErrorCodes.USER_NOT_FOUND:
          case AuthErrorCodes.WRONG_PASSWORD:
            errorMessage = '電子郵件或密碼不正確。';
            break;
          case AuthErrorCodes.TOO_MANY_REQUESTS:
            errorMessage = '太多次登入嘗試，請稍後再試。';
            break;
          default:
            errorMessage = `Firebase 錯誤: ${error.message}`;
        }
        console.error(errorMessage, error);
        this.notificationService.showError(errorMessage);
        throw error; // 重新拋出錯誤以便上層處理
      });
  }
}
```

## 範例
### 1. `firebase.service.ts` 中的 Google 登入範例
```typescript
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Firebase Authentication。
import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, collection } from '@angular/fire/firestore';
import { from, Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProjectUser } from '../models/project.types';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private auth: Auth, private firestore: Firestore) { }

  /**
   * @method getUserDataFromFirestore
   * @description 從 Firestore 獲取用戶資料，包括角色資訊。
   * @param uid 用戶 UID
   * @returns 包含 ProjectUser 資訊的 Observable<ProjectUser | undefined>
   */
  getUserDataFromFirestore(uid: string): Observable<ProjectUser | undefined> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
        return { 
            uid: docSnap.id,
            email: userData['email'],
            displayName: userData['displayName'] || '',
            role: userData['role'] || 'guest', // 預設為 guest 角色
            isActive: userData['isActive'] || false,
            createdAt: new Date(userData['createdAt'].seconds * 1000),
            lastLoginAt: userData['lastLoginAt'] ? new Date(userData['lastLoginAt'].seconds * 1000) : undefined,
            customFields: userData['customFields']
        } as ProjectUser;
        } else {
          console.warn('Firestore 中找不到用戶資料:', uid);
          return undefined;
        }
      })
    );
  }

  /**
   * @method getPermissionsByRole
   * @description 從 Firestore 獲取指定角色的權限列表。
   * @param roleName 角色名稱
   * @returns 包含權限字串陣列的 Observable<string[]>
   */
  getPermissionsByRole(roleName: string): Observable<string[]> {
    const roleDocRef = doc(this.firestore, `roles/${roleName}`);
    return from(getDoc(roleDocRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const roleData = docSnap.data();
          return roleData['permissions'] as string[] || [];
        } else {
          console.warn('Firestore 中找不到角色權限資料:', roleName);
          return [];
        }
      })
    );
  }

  loginWithGoogle(): Observable<ProjectUser> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      switchMap(result => {
        const firebaseUser = result.user;
        if (!firebaseUser || !firebaseUser.uid) {
          return throwError(() => new Error('無法獲取 Firebase 用戶 UID'));
        }
        // 步驟 1: 從 Firestore 獲取用戶資料，包括其角色
        return this.getUserDataFromFirestore(firebaseUser.uid).pipe(
          switchMap(projectUser => {
            if (!projectUser) {
              // 如果 Firestore 中沒有用戶資料，可以選擇創建一個預設用戶文檔
              console.warn('Firestore 中未找到用戶資料，創建預設用戶文檔...');
              // 這裡可以加入創建新用戶的邏輯，例如設定預設角色和基本資訊
              const defaultUser: ProjectUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName: firebaseUser.displayName || '',
                role: 'guest', // 預設為 guest 角色
                permissions: [], // 暫時為空，稍後載入
                isActive: true,
                createdAt: new Date(),
              };
              // 這裡應呼叫一個方法將 defaultUser 儲存到 Firestore 的 users 集合
              // this.saveUserToFirestore(defaultUser); 
              return of(defaultUser);
            }
            return of(projectUser);
          }),
          // 步驟 2: 根據用戶角色，從 Firestore 獲取對應的權限列表
          switchMap(userWithRole => {
            if (userWithRole) {
              return this.getPermissionsByRole(userWithRole.role).pipe(
                map(permissions => ({
                  ...userWithRole,
                  permissions: permissions // 填充 ProjectUser 的 permissions 屬性
                }))
              );
            }
            return of(userWithRole);
          }),
          map(finalUser => finalUser as ProjectUser) // 確保返回 ProjectUser 類型
        );
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
```

### 2. `ngx-permissions` 在模板中的使用範例
```html
<!-- src/app/admin/components/admin-panel.component.html -->
<div *ngxPermissionsOnly="'admin'">
  <mat-card>
    <mat-card-title>管理員面板</mat-card-title>
    <mat-card-content>
      <button mat-raised-button color="primary" routerLink="/admin/users" *ngxPermissionsOnly="'user.manage'">
        使用者管理
      </button>
      <button mat-raised-button color="accent" routerLink="/admin/node-types" *ngxPermissionsOnly="'node.manage'">
        節點類型管理
      </button>
    </mat-card-content>
  </mat-card>
</div>

<div *ngxPermissionsExcept="'admin'">
  <p>您沒有權限訪問此頁面。</p>
</div>
```

### 3. 動態載入權限範例 (在登入成功後)
```typescript
// src/app/users/containers/login/login.component.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Firebase Authentication。
import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <button mat-raised-button (click)="login()">Google 登入</button>
  `
})
export class LoginComponent {
  constructor(
    private firebaseService: FirebaseService,
    private permissionsService: NgxPermissionsService,
    private router: Router
  ) { }

  login(): void {
    this.firebaseService.loginWithGoogle().subscribe({
      next: (user) => {
        // 登入成功後載入用戶權限 (FirebaseService 返回的 user 已包含正確的 permissions)
        if (user && user.permissions) {
        this.permissionsService.loadPermissions(user.permissions);
        console.log('使用者登入成功:', user);
        this.router.navigate(['/projects']); // 導向受保護頁面
        } else {
          console.error('登入成功但無法獲取用戶權限:', user);
          // 處理無法獲取權限的情況，例如顯示錯誤訊息或導向錯誤頁面
        }
      },
      error: (error) => {
        console.error('登入失敗:', error);
        // 錯誤處理：顯示友善提示
      }
    });
  }
}
```

## 參考資料
- [Firebase Authentication 官方文檔](https://firebase.google.com/docs/auth)
- [ngx-permissions GitHub 專案](https://github.com/AlexKhymenko/ngx-permissions)
- [Firebase 設置指南](FIREBASE_SETUP.md)
- [錯誤處理指南](ERROR_HANDLING_GUIDE.md)

---

## 技術棧
- **Angular 19**（TypeScript 嚴格模式）
- **@angular/fire**（官方 Firebase Angular SDK）
- **ngx-permissions**（細粒度權限管理）
- **Firebase Authentication**
- **Firebase App Check**（強制模式，防止未授權存取）

---

## Firebase 設定與 App Check 強制模式
1.  於 Firebase Console 啟用 Authentication（Google、Email/Password）。
2.  啟用 App Check，選擇 reCAPTCHA v3 或 DeviceCheck，並設為「強制模式」。
3.  於專案中安裝必要套件：
   ```sh
   npm install @angular/fire firebase ngx-permissions
   ```
4.  初始化 Firebase 與 App Check（建議於 `app.config.ts` 中實作）：
   ```typescript
    // src/app/app.config.ts
    import { ApplicationConfig, importProvidersFrom } from '@angular/core';
    import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
    import { provideAuth, getAuth } from '@angular/fire/auth';
    import { provideFirestore, getFirestore } from '@angular/fire/firestore';
    import { provideAppCheck, initializeAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';
    import { environment } from '../environments/environment';

    export const appConfig: ApplicationConfig = {
      providers: [
        importProvidersFrom(
          provideFirebaseApp(() => initializeApp(environment.firebase)),
          provideAuth(() => getAuth()),
          provideFirestore(() => getFirestore()),
          provideAppCheck(() => initializeAppCheck(initializeApp(environment.firebase), {
            provider: new ReCaptchaV3Provider(environment.recaptchaKey),
     isTokenAutoRefreshEnabled: true
          }))
        )
      ]
    };
   ```

---

## 彈性角色設計（型別範例）
```typescript
export interface ProjectUser {
  uid: string;
  email: string;
  displayName?: string;
  role: string; // 例：'admin' | 'manager' | 'worker' | 'auditor' | ... (從 Firestore 的 users 集合中讀取)
  permissions: string[]; // 例：['project.view', 'task.edit'] (根據 role 從 Firestore 的 roles 集合中動態載入)
  isActive: boolean;
  customFields?: Record<string, unknown>;
}
```

---

## ngx-permissions 實作（Angular 端）

### 權限初始化
```typescript
import { NgxPermissionsService } from 'ngx-permissions';

constructor(private permissionsService: NgxPermissionsService) {}

setUserPermissions(permissions: string[]) {
  this.permissionsService.loadPermissions(permissions);
}
```

### 權限控制範例（HTML）
```html
<button *ngxPermissionsOnly="'project.edit'">編輯專案</button>
<button *ngxPermissionsExcept="'task.delete'">不可刪除任務</button>
```

---

## 工業級最佳實踐建議
- **型別與權限分離**：用戶型別 (`ProjectUser`) 應包含 `role`，而 `permissions` 陣列則在登入時根據 `role` 從 Firestore 動態載入，方便彈性擴展。
- **App Check 強制模式**：所有 API/Firestore/Storage 請求皆需通過 App Check，提升安全性。
- **權限矩陣集中管理**：角色對應權限矩陣集中於 Firestore 的 `roles` 集合中管理，避免硬編碼。
- **細粒度控制**：每個 UI 元素、API 請求皆以 `ngx-permissions` 控制，確保精確的訪問權限。
- **動態角色/權限**：系統支援自訂角色與動態權限分配，可根據業務需求隨時調整。
- **錯誤處理與回退**：實作完整的錯誤處理機制，當權限載入失敗時自動回退到預設權限，確保系統穩定性。
- **權限快取優化**：使用權限快取機制減少重複的 Firestore 查詢，提升應用效能。
- **路由級權限保護**：使用 `PermissionsGuard` 保護需要特定權限的路由，確保未授權用戶無法訪問受保護頁面。
- **Firestore 安全規則**：配置完整的 Firestore 安全規則，確保數據安全性和訪問控制。
- **新用戶自動註冊**：實作新用戶首次登入時的自動註冊機制，簡化用戶體驗。

---

## 參考結構建議
```
src/app/
├── core/
│   ├── services/
│   │   ├── firebase.service.ts           # Firebase/Auth/AppCheck/Firestore 實作，包含權限載入邏輯
│   │   ├── permissions.service.ts        # 權限管理服務，提供權限檢查和管理功能
│   │   └── permissions-cache.service.ts  # 權限快取服務，優化權限載入效能
│   ├── guards/
│   │   └── permissions.guard.ts          # 權限守衛，用於路由保護
│   └── models/
│       └── project.types.ts              # 用戶/權限型別定義 (ProjectUser)
├── users/
│   └── containers/
│       ├── login.component.ts            # 登入元件，負責調用 FirebaseService 處理登入與權限載入
│       └── register.component.ts         # 註冊元件
├── projects/
│   └── components/
│       └── project-list.component.ts     # 專案列表元件，展示權限服務的使用
└── shared/
    └── components/
        └── unauthorized.component.ts     # 未授權頁面元件
```

---

> **極簡主義原則**：只實作必要功能，透過 Firestore 實現型別與權限的彈性擴展和集中管理，確保工業級安全與維護性，同時簡化前端權限控制邏輯。 