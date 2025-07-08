# 管理面板指南

## 目錄
- [簡介](#簡介)
- [功能](#功能)
- [前置條件](#前置條件)
- [核心元件](#核心元件)
- [實作要點](#實作要點)
- [範例](#範例)
- [參考資料](#參考資料)

## 簡介
此文件說明管理員操作面板的核心功能與實現，涵蓋使用者和節點類型的管理。

## 功能
- **使用者管理**：新增、編輯、刪除使用者。
- **角色管理**：建立、編輯、刪除角色，並分配權限。
- **權限矩陣管理**：管理系統權限矩陣，定義各角色可執行的操作。
- **全域節點儀表板分析**：顯示所有節點的統計、分布與趨勢圖表。
- **操作日誌**：查看系統操作記錄。

## 前置條件
- 已完成 [Firebase 設置指南](FIREBASE_SETUP.md) 中 Firebase 服務初始化。
- 已配置 [認證與權限指引](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md) 中 `ngx-permissions`。

## 核心元件
- `AdminPanelComponent`：管理面板主介面。
- `UserManagementComponent`：處理使用者 CRUD 操作。
- `RoleManagementComponent`：處理角色 CRUD 操作與權限分配。
- `PermissionMatrixComponent`：管理權限矩陣與權限定義。
- `NodeDashboardComponent`：全域節點統計與分析圖表。
- `AuditLogComponent`：顯示操作日誌。

## 實作要點
- **權限控制**：使用 `*ngxPermissionsOnly` 和 `*ngxPermissionsExcept` 指令控制 UI 元素的可見性，確保只有具備相應權限的用戶能存取管理功能。
- **資料操作**：直接透過 `FirebaseService` 與 Firestore 互動，進行使用者、角色、權限矩陣的 CRUD 操作。
- **響應式表單**：使用 Angular 響應式表單處理資料輸入和驗證。
- **權限矩陣設計**：權限矩陣應支援層級化權限（如 `project.view`、`project.edit`、`project.delete`），並與角色關聯。
- **角色權限同步**：當角色權限變更時，需同步更新相關使用者的權限快取。
- **節點類型管理**：僅於用戶主頁（如專案頁）開放給有權限的管理職（如 manager、project.admin），admin 面板僅能檢視全域節點分析。

## 範例
### 1. 管理面板路由配置
```typescript
// ... existing code ...
import { AdminPanelComponent } from './components/admin-panel.component';

const routes: Routes = [
  { path: 'admin', component: AdminPanelComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['admin'] } } },
];

// ... existing code ...

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
```

### 2. `RoleManagementComponent` 角色管理範例
```typescript
// src/app/admin/components/role-management.component.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { NgxPermissionsService } from 'ngx-permissions';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-role-management',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>角色管理</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <!-- 角色列表 -->
        <mat-list>
          <mat-list-item *ngFor="let role of roles$ | async">
            <span matListItemTitle>{{ role.name }}</span>
            <span matListItemLine>{{ role.description }}</span>
            <button mat-icon-button (click)="editRole(role)" *ngxPermissionsOnly="'role.edit'">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button (click)="deleteRole(role.id)" *ngxPermissionsOnly="'role.delete'">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-list-item>
        </mat-list>

        <!-- 新增/編輯角色表單 -->
        <form [formGroup]="roleForm" (ngSubmit)="saveRole()" *ngIf="showForm">
          <mat-form-field appearance="fill">
            <mat-label>角色名稱</mat-label>
            <input matInput formControlName="name" required>
          </mat-form-field>
          
          <mat-form-field appearance="fill">
            <mat-label>角色描述</mat-label>
            <textarea matInput formControlName="description"></textarea>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>權限</mat-label>
            <mat-select formControlName="permissions" multiple>
              <mat-option value="project.view">專案查看</mat-option>
              <mat-option value="project.edit">專案編輯</mat-option>
              <mat-option value="project.delete">專案刪除</mat-option>
              <mat-option value="user.manage">使用者管理</mat-option>
              <mat-option value="role.manage">角色管理</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="roleForm.invalid">
            {{ editingRole ? '更新' : '新增' }}
          </button>
          <button mat-button type="button" (click)="cancelEdit()">取消</button>
        </form>

        <button mat-raised-button color="primary" (click)="showAddForm()" *ngxPermissionsOnly="'role.create'">
          新增角色
        </button>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleManagementComponent implements OnInit {
  roles$: Observable<Role[]>;
  roleForm: FormGroup;
  showForm = false;
  editingRole: Role | null = null;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private permissionsService: NgxPermissionsService
  ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      permissions: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roles$ = from(this.firebaseService.getDocuments<Role>('roles'));
  }

  showAddForm(): void {
    this.editingRole = null;
    this.roleForm.reset();
    this.showForm = true;
  }

  editRole(role: Role): void {
    this.editingRole = role;
    this.roleForm.patchValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    this.showForm = true;
  }

  async saveRole(): Promise<void> {
    if (this.roleForm.valid) {
      const roleData = {
        ...this.roleForm.value,
        updatedAt: new Date()
      };

      try {
        if (this.editingRole) {
          await this.firebaseService.updateDocument('roles', this.editingRole.id, roleData);
        } else {
          roleData.createdAt = new Date();
          await this.firebaseService.addDocument('roles', roleData);
        }
        
        this.cancelEdit();
        this.loadRoles();
      } catch (error) {
        console.error('儲存角色失敗:', error);
      }
    }
  }

  async deleteRole(roleId: string): Promise<void> {
    if (confirm('確定要刪除此角色嗎？')) {
      try {
        await this.firebaseService.deleteDocument('roles', roleId);
        this.loadRoles();
      } catch (error) {
        console.error('刪除角色失敗:', error);
      }
    }
  }

  cancelEdit(): void {
    this.showForm = false;
    this.editingRole = null;
    this.roleForm.reset();
  }
}

### 3. `PermissionMatrixComponent` 權限矩陣管理範例
```typescript
// src/app/admin/components/permission-matrix.component.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
}

@Component({
  selector: 'app-permission-matrix',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>權限矩陣管理</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-table [dataSource]="permissions$ | async">
          <!-- 權限名稱 -->
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef>權限名稱</mat-header-cell>
            <mat-cell *matCellDef="let permission">{{ permission.name }}</mat-cell>
          </ng-container>

          <!-- 權限描述 -->
          <ng-container matColumnDef="description">
            <mat-header-cell *matHeaderCellDef>描述</mat-header-cell>
            <mat-cell *matCellDef="let permission">{{ permission.description }}</mat-cell>
          </ng-container>

          <!-- 分類 -->
          <ng-container matColumnDef="category">
            <mat-header-cell *matHeaderCellDef>分類</mat-header-cell>
            <mat-cell *matCellDef="let permission">{{ permission.category }}</mat-cell>
          </ng-container>

          <!-- 狀態 -->
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>狀態</mat-header-cell>
            <mat-cell *matCellDef="let permission">
              <mat-slide-toggle 
                [checked]="permission.isActive"
                (change)="togglePermission(permission)">
                {{ permission.isActive ? '啟用' : '停用' }}
              </mat-slide-toggle>
            </mat-cell>
          </ng-container>

          <!-- 操作 -->
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>操作</mat-header-cell>
            <mat-cell *matCellDef="let permission">
              <button mat-icon-button (click)="editPermission(permission)" *ngxPermissionsOnly="'permission.edit'">
                <mat-icon>edit</mat-icon>
              </button>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </mat-table>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionMatrixComponent implements OnInit {
  permissions$: Observable<Permission[]>;
  displayedColumns = ['name', 'description', 'category', 'status', 'actions'];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.permissions$ = from(this.firebaseService.getDocuments<Permission>('permissions'));
  }

  async togglePermission(permission: Permission): Promise<void> {
    try {
      await this.firebaseService.updateDocument('permissions', permission.id, {
        isActive: !permission.isActive,
        updatedAt: new Date()
      });
      this.loadPermissions();
    } catch (error) {
      console.error('切換權限狀態失敗:', error);
    }
  }

  editPermission(permission: Permission): void {
    // 實作編輯權限的邏輯
    console.log('編輯權限:', permission);
  }
}

### 4. `UserManagementComponent` 刪除使用者範例
```typescript
// src/app/admin/components/user-management.component.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-user-management',
  template: `
    <button mat-raised-button color="warn" (click)="deleteUser('user123')" 
            *ngxPermissionsOnly="'user.delete'">
      刪除使用者
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagementComponent {
  constructor(
    private firebaseService: FirebaseService,
    private permissionsService: NgxPermissionsService
  ) { }

  deleteUser(uid: string): void {
    if (this.permissionsService.hasPermission('user.delete')) {
      this.firebaseService.deleteDocument('users', uid).then(() => {
        console.log(`使用者 ${uid} 已刪除`);
      }).catch(error => {
        console.error('刪除使用者失敗:', error);
      });
    } else {
      console.warn('權限不足，無法刪除使用者');
    }
  }
}

### `NodeDashboardComponent` 全域節點分析範例
```typescript
// src/app/admin/components/node-dashboard.component.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Observable, of } from 'rxjs';

interface NodeStat {
  type: string;
  count: number;
}

@Component({
  selector: 'app-node-dashboard',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>全域節點統計分析</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="nodeStats$ | async as stats">
          <mat-list>
            <mat-list-item *ngFor="let stat of stats">
              <span>{{ stat.type }}：{{ stat.count }} 個</span>
            </mat-list-item>
          </mat-list>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeDashboardComponent implements OnInit {
  nodeStats$: Observable<NodeStat[]> = of([]);

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadNodeStats();
  }

  async loadNodeStats(): Promise<void> {
    // 假設所有節點存在 'nodes' 集合，並有 type 欄位
    const nodes = await this.firebaseService.getDocuments<any>('nodes');
    const stats: Record<string, number> = {};
    nodes.forEach(node => {
      stats[node.type] = (stats[node.type] || 0) + 1;
    });
    this.nodeStats$ = of(Object.entries(stats).map(([type, count]) => ({ type, count })));
  }
}

## 參考資料
- [認證與權限指引](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md)
- [Firebase 設置指南](FIREBASE_SETUP.md)
- [錯誤處理指南](ERROR_HANDLING_GUIDE.md)

---