# 模組概覽

## 目錄
- [簡介](#簡介)
- [核心模組列表](#核心模組列表)
- [模組職責與依賴](#模組職責與依賴)
- [參考資料](#參考資料)

## 簡介
此文件提供 Angular 應用程式中各功能模組的概覽，旨在清晰定義每個模組的職責、核心元件與路由，幫助開發者快速理解專案的模組化結構，提升 AI 代碼生成時的準確性與一致性。

## 核心模組列表
本專案主要包含以下功能模組，每個模組負責應用程式的特定功能領域：

- **Home 模組**：應用程式的入口與歡迎頁。
- **Users 模組**：處理使用者認證、註冊、登入及個人資料管理。
- **Projects 模組**：管理專案、動態節點樹與任務。
- **Admin 模組**：提供系統管理員操作介面，如使用者管理、節點類型管理與日誌審核。

## 模組職責與依賴

### 1. Home 模組
- **路徑**：`src/app/home/`
- **核心元件**：`HomeComponent`
- **主要路由**：`/home` 或根路徑 `/`
- **職責**：提供應用程式的歡迎介面和主要導航入口，通常是未認證用戶的首頁。
- **依賴**：通常不依賴其他功能模組，但會依賴 `SharedModule` 中的通用元件。

### 2. Users 模組
- **路徑**：`src/app/users/`
- **核心元件**：`LoginComponent`, `RegisterComponent`, `ProfileComponent` 等
- **主要路由**：`/users` 或 `/auth` 下的子路由
- **職責**：集中處理所有與使用者身份相關的邏輯，包括登入、註冊、密碼重置和個人資料編輯。
- **依賴**：
  - 依賴 `CoreModule` 中的 `FirebaseService` 進行認證操作。
  - 依賴 `SharedModule` 中的 UI 元件和通用管道。
  - 與 [認證與權限指引](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md) 緊密相關。

### 3. Projects 模組
- **路徑**：`src/app/projects/`
- **核心元件**：`DynamicNodeTreeComponent`, `ProjectListComponent`, `TaskDetailComponent` 等
- **主要路由**：`/projects` 下的子路由
- **職責**：管理專案的核心業務邏輯，包括動態節點結構的展示、任務的創建與管理。
- **依賴**：
  - 依賴 `CoreModule` 中的 `FirebaseService` 進行資料庫操作。
  - 依賴 `SharedModule` 中的可重用元件。
  - 可能依賴 `UsersModule` 中的認證狀態來判斷用戶權限。

### 4. Admin 模組
- **路徑**：`src/app/admin/`
- **核心元件**：`AdminPanelComponent`, `UserManagementComponent`, `NodeTypeManagementComponent`, `AuditLogComponent` 等
- **主要路由**：`/admin` 下的受保護子路由
- **職責**：提供給具備管理權限的用戶使用的介面，負責使用者帳戶管理、系統配置與日誌審核。
- **依賴**：
  - 依賴 `CoreModule` 中的 `FirebaseService` 和 `PermissionGuard`。
  - 依賴 `SharedModule` 中的 UI 元件。
  - 與 [管理面板指南](ADMIN_PANEL_GUIDE.md) 和 [認證與權限指引](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md) 緊密相關。

## 參考資料
- [專案結構與開發指南](PROJECT_STRUCTURE.md)
- [認證與權限指引](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md)
- [管理面板指南](ADMIN_PANEL_GUIDE.md)

---
