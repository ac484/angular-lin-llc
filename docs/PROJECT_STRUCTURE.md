# 專案結構與開發指南

## 目錄
- [簡介](#簡介)
- [設計理念](#設計理念)
- [核心目錄結構](#核心目錄結構)
- [功能模組概覽](#功能模組概覽)
- [核心型別定義](#核心型別定義)
- [開發與部署](#開發與部署)
- [參考資料](#參考資料)

## 簡介
此文件旨在詳細介紹 Angular 專案的核心目錄結構、各模組的職責、關鍵型別定義以及開發與部署流程，以確保程式碼組織清晰、易於維護和擴展，並提升 AI 代碼生成的準確性。

## 設計理念
本專案遵循以下設計理念，以貫徹極簡主義原則：
- **單一責任原則**：每個檔案、元件、服務和模組都應只負責單一明確的功能。
- **模組化**：將應用程式劃分為獨立的功能模組，便於團隊協作和程式碼管理。
- **數據驅動**：強調數據模型清晰，UI 和業務邏輯基於數據流動設計。
- **效能優先**：透過 `OnPush` 變更檢測、Lazy Loading 等策略優化應用效能。
- **扁平化結構**：在不犧牲可讀性的前提下，盡量減少目錄嵌套層級。

## 核心目錄結構
```
src/
├── app/                    # Angular 應用程式的核心程式碼
│   ├── core/              # 核心服務、守衛、模型和攔截器
│   │   ├── models/        # 專案中使用的 TypeScript 型別定義
│   │   └── services/      # 全域性服務 (如 Firebase 服務、錯誤處理)
│   ├── shared/            # 共享元件、管道和指令 (可跨多個功能模組重用)
│   ├── features/          # 應用程式的主要功能模組
│   │   ├── home/          # 首頁或歡迎頁面
│   │   ├── users/         # 使用者認證與個人資料管理
│   │   ├── projects/      # 專案和任務管理 (動態節點樹)
│   │   └── admin/         # 管理面板 (使用者管理、節點類型管理)
│   ├── app.config.ts      # Angular 應用程式的根配置 (standalone)
│   ├── app.routes.ts      # 應用程式的根路由配置
│   ├── app.component.ts   # 根元件
│   └── app.scss           # 全域應用程式樣式
├── assets/                # 靜態資源 (圖片、字體等)
├── environments/          # 環境配置檔案 (開發、生產)
├── index.html             # 應用程式的入口 HTML 檔案
└── styles.scss            # 全域 SCSS 樣式檔案
```

## 功能模組概覽
- **Home 模組**：提供應用程式的歡迎介面和主要導航入口。
- **Users 模組**：處理使用者註冊、登入、個人資料管理和認證相關邏輯。
- **Projects 模組**：管理應用程式的核心數據，包括專案、任務、動態節點結構，以及「節點類型管理」等功能。節點類型管理僅開放給有權限的管理職（如 manager、project.admin）於用戶主頁（如專案頁）操作，並加上權限守衛。
- **Admin 模組**：僅提供全域帳號、角色、權限、全域節點分析、審核日誌等系統級管理功能，不包含節點類型管理。

> 權限分工說明：
> - 「節點類型管理」等專案/節點細節功能，僅限有權限的管理職（如 manager、project.admin）於用戶主頁操作。
> - Admin 模組僅負責全域帳號、角色、權限、全域節點分析、審核日誌等。

> 詳細資訊請參考 [模組概覽](MODULE_OVERVIEW.md)。

## 核心型別定義
所有重要的數據模型都應在 `src/app/core/models/project.types.ts` 中嚴格定義，確保型別安全和程式碼可讀性。

```typescript
// src/app/core/models/project.types.ts
// 本檔案定義了專案中使用的核心數據模型型別。

/**
 * @interface ProjectUser
 * @description 定義應用程式使用者的介面。
 */
export interface ProjectUser {
  uid: string;           // Firebase User ID
  email: string;         // 用戶電子郵件
  displayName?: string;  // 用戶顯示名稱
  role: 'admin' | 'manager' | 'worker' | 'auditor' | 'guest'; // 用戶角色
  permissions: string[]; // 角色擁有的權限列表 (例如: ['project.view', 'task.edit'])
  isActive: boolean;     // 用戶帳戶是否活躍
  createdAt: Date;       // 帳戶創建時間
  lastLoginAt?: Date;    // 最後登入時間
  // 可選的自訂欄位，用於彈性擴展用戶資訊
  customFields?: Record<string, unknown>; 
}

/**
 * @interface Project
 * @description 定義專案的介面。
 */
export interface Project {
  id: string;            // 專案唯一 ID
  name: string;          // 專案名稱
  description?: string;  // 專案描述
  ownerId: string;       // 專案擁有者的 UID
  isPublic: boolean;     // 專案是否對訪客可見
  createdAt: Date;       // 專案創建時間
  updatedAt: Date;       // 專案最後更新時間
  // 可選的自訂欄位
  customFields?: Record<string, unknown>;
}

/**
 * @interface ProjectNode
 * @description 定義專案中的動態節點介面，用於構建樹狀結構。
 */
export interface ProjectNode {
  id: string;            // 節點唯一 ID
  projectId: string;     // 所屬專案 ID
  parentId: string | null; // 父節點 ID，根節點為 null
  name: string;          // 節點名稱
  type: string;          // 節點類型 (例如: 'folder', 'task', 'milestone')
  order: number;         // 節點在同層級下的排序順序
  // 可選的自訂欄位，根據 node.type 而異
  customFields?: Record<string, unknown>;
}

/**
 * @interface Task
 * @description 定義任務的介面。
 */
export interface Task {
  id: string;            // 任務唯一 ID
  projectId: string;     // 所屬專案 ID
  nodeId: string;        // 所屬節點 ID
  title: string;         // 任務標題
  description?: string;  // 任務描述
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'; // 任務狀態
  assignedToId?: string; // 指派給的使用者 UID
  dueDate?: Date;        // 截止日期
  createdAt: Date;       // 任務創建時間
  updatedAt: Date;       // 任務最後更新時間
  // 可選的自訂欄位
  customFields?: Record<string, unknown>;
}
```

## 開發與部署
1. **安裝依賴**：
   ```bash
   npm install
   ```
2. **配置 Firebase**：參考 [Firebase 設置指南](FIREBASE_SETUP.md) 完成 Firebase 專案配置和服務初始化。
3. **本地開發**：
   ```bash
   ng serve
   ```
4. **建構生產包**：
   ```bash
   ng build --configuration=production
   ```
5. **部署到 Firebase Hosting**：
   ```bash
   firebase deploy --only hosting
   ```

## 參考資料
- [環境變數說明](ENVIRONMENT_VARIABLES.md)
- [Firebase 設置指南](FIREBASE_SETUP.md)
- [認證與權限指引](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md)
- [使用者入口指南](USER_PORTAL_GUIDE.md)
- [訪客頁面指南](GUEST_PAGE_GUIDE.md)
- [管理面板指南](ADMIN_PANEL_GUIDE.md)
- [程式碼生成指南](CODE_GENERATION_GUIDE.md)
- [風格指南](STYLE_GUIDE.md)
- [貢獻指南](CONTRIBUTING.md)
- [測試指南](TESTING_GUIDE.md)
- [開發路線圖](ROADMAP.md)
- [架構決策記錄](ADR.md)
- [模組概覽](MODULE_OVERVIEW.md)

--- 