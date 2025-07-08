# 風格指南

## 目錄
- [簡介](#簡介)
- [前置條件](#前置條件)
- [總體原則](#總體原則)
- [TypeScript 規範](#typescript-規範)
- [Angular 19 特定規範](#angular-19-特定規範)
- [HTML 模板規範](#html-模板規範)
- [SCSS 樣式規範](#scss-樣式規範)
- [命名規範](#命名規範)
- [檔案組織規範](#檔案組織規範)
- [效能優化規範](#效能優化規範)
- [錯誤處理規範](#錯誤處理規範)
- [測試規範](#測試規範)
- [Commit Message 規範](#commit-message-規範)
- [常見錯誤與修正](#常見錯誤與修正)
- [參考資料](#參考資料)

## 簡介
此文件定義了本專案的程式碼風格與規範，旨在確保程式碼的一致性、可讀性和可維護性，同時嚴格遵循極簡主義原則，為 AI 代碼生成提供清晰的指導，提升生成程式碼的品質與準確性。

## 前置條件
- 已安裝並配置 ESLint 和 Prettier，以自動化程式碼檢查和格式化。
- 熟悉 [TypeScript 嚴格模式規範](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md#typescript-嚴格模式規範)。
- 了解 Angular 19 的新特性與最佳實踐。

## 總體原則
- **極簡**：移除所有不必要的程式碼、註釋、冗餘設計，追求「少即是多」。
- **清晰**：程式碼應易於理解，避免複雜的邏輯和技巧性寫法。
- **一致**：全專案範圍內保持統一的程式碼風格。
- **可讀**：良好的縮排、適當的空行和具描述性的命名。
- **單一責任**：每個檔案、函數、元件只做一件事。
- **效能優先**：在保持可讀性的前提下，優先考慮效能。
- **安全第一**：所有程式碼都應考慮安全性，特別是處理用戶輸入時。
- **PrimeNG 統一**：整個專案**只使用 PrimeNG** 元件庫進行樣式設計，確保 UI/UX 的一致性和專業性。

## TypeScript 規範

### 嚴格模式
```typescript
// ✅ 正確：啟用嚴格模式
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 型別定義
```typescript
// ✅ 正確：優先使用 interface
interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

// ✅ 正確：使用 type 進行聯合型別
type UserRole = 'admin' | 'manager' | 'worker' | 'guest';

// ❌ 錯誤：避免使用 any
const user: any = getUser(); // 不允許

// ✅ 正確：使用 unknown 或具體型別
const user: User = getUser();
```

### 函數定義
```typescript
// ✅ 正確：明確的參數與返回值型別
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

// ✅ 正確：箭頭函數
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD'
  }).format(amount);
};

// ✅ 正確：泛型函數
function getFirstItem<T>(items: T[]): T | undefined {
  return items[0];
}
```

### 類別定義
```typescript
// ✅ 正確：明確的屬性型別
export class UserService {
  private readonly users: User[] = [];
  
  constructor(private readonly http: HttpClient) {}
  
  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }
}
```

## Angular 19 特定規範

### 獨立元件 (Standalone Components)
```typescript
// ✅ 正確：使用獨立元件
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ user.displayName }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>{{ user.email }}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="onEdit()">編輯</button>
      </mat-card-actions>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
  @Output() edit = new EventEmitter<string>();
  
  onEdit(): void {
    this.edit.emit(this.user.id);
  }
}
```

### 控制流語法 (Control Flow)
```typescript
// ✅ 正確：使用新的控制流語法
@Component({
  template: `
    @if (users.length > 0) {
      @for (user of users; track user.id) {
        <app-user-card [user]="user" (edit)="onEditUser($event)" />
      }
    } @else {
      <p>沒有用戶</p>
    }
  `
})
export class UserListComponent {
  users: User[] = [];
  
  onEditUser(userId: string): void {
    // 處理編輯邏輯
  }
}
```

### 依賴注入
```typescript
// ✅ 正確：使用 inject 函數
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  
  async getUser(id: string): Promise<User> {
    return this.http.get<User>(`/api/users/${id}`).toPromise();
  }
}
```

### 信號 (Signals)
```typescript
// ✅ 正確：使用信號進行狀態管理
export class UserListComponent {
  private readonly userService = inject(UserService);
  
  users = signal<User[]>([]);
  loading = signal(false);
  
  async loadUsers(): Promise<void> {
    this.loading.set(true);
    try {
      const users = await this.userService.getUsers();
      this.users.set(users);
    } finally {
      this.loading.set(false);
    }
  }
}
```

## HTML 模板規範

### Angular Material 優先
```html
<!-- ✅ 正確：優先使用 Angular Material -->
<mat-card>
  <mat-card-header>
    <mat-card-title>用戶資訊</mat-card-title>
    <mat-card-subtitle>詳細資訊</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <mat-form-field appearance="outline">
      <mat-label>姓名</mat-label>
      <input matInput [(ngModel)]="user.name" required>
      <mat-icon matSuffix>person</mat-icon>
    </mat-form-field>
  </mat-card-content>
  <mat-card-actions align="end">
    <button mat-button>取消</button>
    <button mat-raised-button color="primary">儲存</button>
  </mat-card-actions>
</mat-card>

<!-- ❌ 錯誤：避免自訂 HTML 結構 -->
<div class="custom-card">
  <div class="card-header">
    <h3>用戶資訊</h3>
  </div>
  <div class="card-body">
    <input type="text" class="custom-input" placeholder="姓名">
  </div>
  <div class="card-footer">
    <button class="custom-button">儲存</button>
  </div>
</div>
```

### Material 佈局元件
```html
<!-- ✅ 正確：使用 Material 佈局元件 -->
<mat-toolbar color="primary">
  <span>應用程式標題</span>
  <span class="spacer"></span>
  <button mat-icon-button>
    <mat-icon>menu</mat-icon>
  </button>
</mat-toolbar>

<mat-sidenav-container>
  <mat-sidenav mode="side" opened>
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard">
        <mat-icon>dashboard</mat-icon>
        <span>儀表板</span>
      </a>
      <a mat-list-item routerLink="/users">
        <mat-icon>people</mat-icon>
        <span>用戶</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>
  
  <mat-sidenav-content>
    <router-outlet></router-outlet>
  </mat-sidenav-content>
</mat-sidenav-container>
```

### Material 表單元件
```html
<!-- ✅ 正確：使用 Material 表單元件 -->
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <mat-form-field appearance="outline">
    <mat-label>電子郵件</mat-label>
    <input matInput formControlName="email" type="email" required>
    <mat-error *ngIf="userForm.get('email')?.hasError('required')">
      電子郵件為必填項目
    </mat-error>
    <mat-error *ngIf="userForm.get('email')?.hasError('email')">
      請輸入有效的電子郵件
    </mat-error>
  </mat-form-field>
  
  <mat-form-field appearance="outline">
    <mat-label>密碼</mat-label>
    <input matInput formControlName="password" type="password" required>
    <mat-icon matSuffix>lock</mat-icon>
  </mat-form-field>
  
  <div class="form-actions">
    <button mat-button type="button" (click)="onCancel()">取消</button>
    <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">
      提交
    </button>
  </div>
</form>
```

### Material 資料展示元件
```html
<!-- ✅ 正確：使用 Material 資料展示元件 -->
<mat-table [dataSource]="users" class="mat-elevation-z8">
  <ng-container matColumnDef="name">
    <mat-header-cell *matHeaderCellDef>姓名</mat-header-cell>
    <mat-cell *matCellDef="let user">{{ user.name }}</mat-cell>
  </ng-container>
  
  <ng-container matColumnDef="email">
    <mat-header-cell *matHeaderCellDef>電子郵件</mat-header-cell>
    <mat-cell *matCellDef="let user">{{ user.email }}</mat-cell>
  </ng-container>
  
  <ng-container matColumnDef="actions">
    <mat-header-cell *matHeaderCellDef>操作</mat-header-cell>
    <mat-cell *matCellDef="let user">
      <button mat-icon-button (click)="editUser(user)">
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button color="warn" (click)="deleteUser(user)">
        <mat-icon>delete</mat-icon>
      </button>
    </mat-cell>
  </ng-container>
  
  <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
  <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
</mat-table>

<mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
```

### 避免自訂 HTML 結構
```html
<!-- ❌ 錯誤：避免自訂 HTML 結構 -->
<div class="custom-table">
  <div class="table-header">
    <div class="header-cell">姓名</div>
    <div class="header-cell">電子郵件</div>
  </div>
  <div class="table-row" *ngFor="let user of users">
    <div class="table-cell">{{ user.name }}</div>
    <div class="table-cell">{{ user.email }}</div>
  </div>
</div>

<!-- ✅ 正確：使用 Material 表格 -->
<mat-table [dataSource]="users">
  <!-- 使用 Material 表格元件 -->
</mat-table>
```

## SCSS 樣式規範

### PrimeNG 優先原則
**整個專案只使用 PrimeNG 進行樣式設計，不建議自訂 SCSS 樣式。**

```scss
// ✅ 正確：僅使用 Material 主題變數進行微調
@use '@angular/material' as mat;

// 僅在必要時進行最小化的樣式調整
.user-card {
  // 使用 Material 主題變數
  background-color: mat.get-color-from-palette(mat.$indigo-palette, 50);
  
  // 使用 Material 間距系統
  padding: mat.$spacing-unit * 2;
}

// ❌ 錯誤：避免大量自訂樣式
.user-card {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  // 過度自訂，破壞 Material Design 一致性
}
```

### Material Design 間距系統
```scss
// ✅ 正確：使用 Material 間距系統
@use '@angular/material' as mat;

.page-container {
  padding: mat.$spacing-unit * 2; // 16px
}

.section-spacing {
  margin: mat.$spacing-unit * 3 0; // 24px 上下間距
}

// ❌ 錯誤：避免自訂間距
.page-container {
  padding: 20px; // 不使用 Material 間距系統
}
```

### Material 主題變數使用
```scss
// ✅ 正確：完全使用 Material 主題變數
@use '@angular/material' as mat;

.custom-component {
  // 使用 Material 顏色系統
  color: mat.get-color-from-palette(mat.$primary-palette, 700);
  background-color: mat.get-color-from-palette(mat.$background-palette, 50);
  
  // 使用 Material 字體系統
  font-family: mat.$font-family;
  font-size: mat.$font-size-base;
  
  // 使用 Material 陰影系統
  box-shadow: mat.$elevation-2;
}
```

### 響應式設計（僅使用 Material 斷點）
```scss
// ✅ 正確：僅使用 Material Design 斷點
@use '@angular/material' as mat;

.responsive-grid {
  display: grid;
  gap: mat.$spacing-unit;
  
  @media (min-width: mat.$breakpoint-sm) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: mat.$breakpoint-md) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: mat.$breakpoint-lg) {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### 避免自訂樣式
```scss
// ❌ 錯誤：避免以下自訂樣式
.custom-button {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 25px;
  border: none;
  padding: 12px 24px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  // 完全破壞 Material Design 一致性
}

// ✅ 正確：使用 Material 按鈕
// 在模板中使用 <button mat-raised-button color="primary">
```

### 元件樣式限制
```scss
// ✅ 正確：僅進行最小化的樣式調整
.user-profile {
  // 僅調整必要的間距
  margin-bottom: mat.$spacing-unit;
  
  // 使用 Material 顏色系統
  .mat-card {
    background-color: mat.get-color-from-palette(mat.$background-palette, 100);
  }
}

// ❌ 錯誤：避免大量自訂樣式
.user-profile {
  .mat-card {
    background: url('/assets/background.jpg') center/cover;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    transform: rotate(-2deg);
    // 過度自訂，破壞 Material Design
  }
}
```

### 主題自訂（僅在必要時）
```scss
// ✅ 正確：僅自訂 Material 主題變數
@use '@angular/material' as mat;

$custom-theme: mat.define-light-theme((
  color: (
    primary: mat.define-palette(mat.$indigo-palette),
    accent: mat.define-palette(mat.$pink-palette),
    warn: mat.define-palette(mat.$red-palette),
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

// 應用自訂主題
@include mat.all-component-themes($custom-theme);
```

### 樣式檔案組織
```
src/styles/
├── _theme.scss          # Material 主題配置
├── _variables.scss      # Material 變數（如需要）
└── styles.scss          # 主樣式檔案（最小化）
```

**注意**：樣式檔案應保持最小化，主要依賴 Angular Material 的內建樣式。

## 命名規範

### 檔案命名
```typescript
// ✅ 正確：kebab-case
user-profile.component.ts
user-profile.component.html
user-profile.component.scss
user-profile.component.spec.ts

// ✅ 正確：服務檔案
user.service.ts
auth.guard.ts
http-error.interceptor.ts
```

### 元件命名
```typescript
// ✅ 正確：PascalCase
export class UserProfileComponent {}
export class AuthGuard {}
export class HttpErrorInterceptor {}

// ❌ 錯誤：避免不當命名
export class userProfileComponent {} // 小寫開頭
export class User_Profile_Component {} // 底線
```

### 變數與函數命名
```typescript
// ✅ 正確：camelCase
const userName = 'John Doe';
const isUserActive = true;
const getUserById = (id: string) => { /* ... */ };

// ✅ 正確：常數使用 UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
```

### 介面命名
```typescript
// ✅ 正確：PascalCase，描述性名稱
interface UserProfile {
  id: string;
  email: string;
  displayName: string;
}

interface CreateUserRequest {
  email: string;
  password: string;
  displayName?: string;
}

// ❌ 錯誤：避免冗餘前綴
interface IUserProfile {} // 不需要 I 前綴
interface UserProfileInterface {} // 不需要 Interface 後綴
```

## 檔案組織規範

### 元件結構
```
src/app/features/users/
├── components/
│   ├── user-card/
│   │   ├── user-card.component.ts
│   │   ├── user-card.component.html
│   │   ├── user-card.component.scss
│   │   └── user-card.component.spec.ts
│   └── user-list/
│       ├── user-list.component.ts
│       ├── user-list.component.html
│       ├── user-list.component.scss
│       └── user-list.component.spec.ts
├── services/
│   └── user.service.ts
├── models/
│   └── user.types.ts
└── users.module.ts
```

### 服務組織
```typescript
// ✅ 正確：單一責任原則
@Injectable({ providedIn: 'root' })
export class UserService {
  // 只處理用戶相關的業務邏輯
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // 只處理認證相關的業務邏輯
}

// ❌ 錯誤：避免混合職責
@Injectable({ providedIn: 'root' })
export class UserAuthService {
  // 混合了用戶和認證邏輯
}
```

## 效能優化規範

### OnPush 變更檢測
```typescript
// ✅ 正確：使用 OnPush 策略
@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class UserCardComponent {
  @Input() user!: User;
}
```

### TrackBy 函數
```typescript
// ✅ 正確：使用 trackBy 優化 ngFor
@Component({
  template: `
    <div *ngFor="let user of users; trackBy: trackByUserId">
      {{ user.name }}
    </div>
  `
})
export class UserListComponent {
  trackByUserId(index: number, user: User): string {
    return user.id;
  }
}
```

### Async Pipe
```typescript
// ✅ 正確：使用 async pipe 自動管理訂閱
@Component({
  template: `
    <div *ngIf="users$ | async as users">
      <div *ngFor="let user of users">{{ user.name }}</div>
    </div>
  `
})
export class UserListComponent {
  users$ = this.userService.getUsers();
  
  constructor(private userService: UserService) {}
}
```

### 懶載入
```typescript
// ✅ 正確：使用懶載入
const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
  }
];
```

## 錯誤處理規範
遵循 [錯誤處理指南](ERROR_HANDLING_GUIDE.md) 中的統一規範，確保所有錯誤處理一致且用戶友善。

### 統一錯誤處理服務
所有錯誤處理都應使用 [錯誤處理指南](ERROR_HANDLING_GUIDE.md) 中定義的 `NotificationService`：

```typescript
// ✅ 正確：統一引用錯誤處理服務
import { NotificationService } from 'src/app/core/services/notification.service';

export class SomeComponent {
  constructor(private notificationService: NotificationService) {}
  
  handleError(error: any): void {
    console.error('操作失敗:', error);
    this.notificationService.showError('操作失敗，請重試');
  }
}
```

### 全域錯誤處理
```typescript
// ✅ 正確：全域錯誤處理器
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private notificationService: NotificationService) {}
  
  handleError(error: Error): void {
    console.error('全域錯誤:', error);
    
    // 顯示用戶友善的錯誤訊息
    this.notificationService.showError('發生錯誤，請稍後再試');
    
    // 可選：發送錯誤到監控服務
    // this.errorReportingService.report(error);
  }
}
```

### HTTP 錯誤攔截
```typescript
// ✅ 正確：HTTP 錯誤攔截器
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '發生未知錯誤';
        
        if (error.error instanceof ErrorEvent) {
          // 客戶端錯誤
          errorMessage = `錯誤: ${error.error.message}`;
        } else {
          // 伺服器錯誤
          switch (error.status) {
            case 401:
              errorMessage = '未授權，請重新登入';
              break;
            case 403:
              errorMessage = '權限不足';
              break;
            case 404:
              errorMessage = '資源不存在';
              break;
            case 500:
              errorMessage = '伺服器錯誤';
              break;
            default:
              errorMessage = `伺服器錯誤 (${error.status})`;
          }
        }
        
        this.notificationService.showError(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
```

### 元件錯誤處理
```typescript
// ✅ 正確：元件級錯誤處理
export class UserListComponent {
  constructor(private notificationService: NotificationService) {}
  
  async loadUsers(): Promise<void> {
    try {
      this.loading = true;
      this.users = await this.userService.getUsers();
    } catch (error) {
      console.error('載入用戶失敗:', error);
      this.notificationService.showError('載入用戶失敗');
    } finally {
      this.loading = false;
    }
  }
}
```

## 測試規範

### 單元測試
```typescript
// ✅ 正確：完整的單元測試
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('應該成功獲取用戶列表', (done) => {
    const mockUsers: User[] = [
      { id: '1', name: 'John', email: 'john@example.com' }
    ];
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
      done();
    });
    
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
  
  it('應該處理錯誤情況', (done) => {
    service.getUsers().subscribe({
      next: () => fail('應該失敗'),
      error: (error) => {
        expect(error.status).toBe(500);
        done();
      }
    });
    
    const req = httpMock.expectOne('/api/users');
    req.error(new ErrorEvent('Network error'));
  });
});
```

### 元件測試
```typescript
// ✅ 正確：元件測試
describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent, MatCardModule, MatButtonModule],
      providers: [NotificationService]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });
  
  it('應該正確顯示用戶資訊', () => {
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    component.user = mockUser;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('John Doe');
    expect(compiled.textContent).toContain('john@example.com');
  });
  
  it('應該在點擊編輯按鈕時發出事件', () => {
    const mockUser: User = { id: '1', name: 'John', email: 'john@example.com' };
    component.user = mockUser;
    fixture.detectChanges();
    
    spyOn(component.edit, 'emit');
    
    const editButton = fixture.nativeElement.querySelector('button');
    editButton.click();
    
    expect(component.edit.emit).toHaveBeenCalledWith('1');
  });
});
```

## Commit Message 規範
遵循 Conventional Commits 規範，確保提交歷史清晰、可追溯，並能自動生成 Changelog。

### 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 類型 (Type)
- **`feat`**：新功能
- **`fix`**：Bug 修復
- **`docs`**：文件變更
- **`style`**：不影響程式碼邏輯的樣式變更
- **`refactor`**：程式碼重構
- **`test`**：新增測試或修改現有測試
- **`chore`**：雜項變更

### 範例
```bash
# 新功能
feat(users): implement user registration with email verification

# Bug 修復
fix(auth): correct redirect after login failure

# 文件更新
docs(readme): update installation instructions

# 重構
refactor(services): extract common HTTP logic into base service

# 測試
test(users): add unit tests for user service

# 樣式
style(components): improve button hover effects
```

## 常見錯誤與修正

### 1. 記憶體洩漏
```typescript
// ❌ 錯誤：未取消訂閱
export class UserListComponent implements OnInit {
  private subscription: Subscription;
  
  ngOnInit() {
    this.subscription = this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
  // 缺少 ngOnDestroy
}

// ✅ 正確：正確管理訂閱
export class UserListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  
  ngOnInit() {
    this.subscription.add(
      this.userService.getUsers().subscribe(users => {
        this.users = users;
      })
    );
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

// ✅ 更好：使用 async pipe
export class UserListComponent {
  users$ = this.userService.getUsers();
}
```

### 2. 型別安全
```typescript
// ❌ 錯誤：使用 any
function processUser(user: any) {
  return user.name.toUpperCase();
}

// ✅ 正確：明確型別
function processUser(user: User) {
  return user.name.toUpperCase();
}
```

### 3. 效能問題
```typescript
// ❌ 錯誤：在模板中使用複雜計算
@Component({
  template: `
    <div *ngFor="let user of users">
      {{ user.firstName + ' ' + user.lastName }}
    </div>
  `
})

// ✅ 正確：預先計算
@Component({
  template: `
    <div *ngFor="let user of usersWithFullName">
      {{ user.fullName }}
    </div>
  `
})
export class UserListComponent {
  usersWithFullName = this.users.map(user => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`
  }));
}
```

### 4. 安全性問題
```typescript
// ❌ 錯誤：直接插入 HTML
@Component({
  template: `<div [innerHTML]="userComment"></div>`
})

// ✅ 正確：使用 DomSanitizer
@Component({
  template: `<div [innerHTML]="sanitizedComment"></div>`
})
export class CommentComponent {
  sanitizedComment = this.sanitizer.bypassSecurityTrustHtml(this.userComment);
  
  constructor(private sanitizer: DomSanitizer) {}
}
```

## 參考資料
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Angular 19 官方文檔](https://angular.io/docs)
- [Angular Material 設計指南](https://material.angular.io/guide/theming)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [專案結構與開發指南](PROJECT_STRUCTURE.md)
- [測試指南](TESTING_GUIDE.md)

---

本文件與 [專案結構與開發指南](PROJECT_STRUCTURE.md)、[測試指南](TESTING_GUIDE.md) 協同使用。
