# 專案說明

## 目錄
- [簡介](#簡介)
- [快速開始](#快速開始)
- [核心技術](#核心技術)
- [文件索引](#文件索引)
- [文件交叉引用](#文件交叉引用)

## 簡介
此專案是一個基於 Angular 19 和 Firebase 的極簡主義 Web 應用程式，旨在提供一個高效率、可擴展且易於維護的開發範例。它涵蓋了用戶認證、專案管理、動態節點樹結構以及管理面板等核心功能。

## 快速開始
遵循以下步驟，即可在本地環境啟動本專案：

1. **複製專案倉庫**：
   ```bash
   git clone https://github.com/your-username/angular-lin-llc.git
   cd angular-lin-llc
   ```

2. **安裝專案依賴**：
   ```bash
   npm install
   ```

3. **配置 Firebase**：
   請參考 [Firebase 設置指南](docs/FIREBASE_SETUP.md)，完成您的 Firebase 專案配置和 `src/environments/` 檔案的更新。

4. **啟動本地開發伺服器**：
   ```bash
   ng serve
   ```
   應用程式將在 `http://localhost:4200/` 運行，並在您修改程式碼時自動重新載入。

## 核心技術
- **前端框架**：Angular 19
- **語言**：TypeScript 5 (嚴格模式)
- **後端/資料庫**：Firebase (Authentication, Firestore, Storage, Hosting, App Check)
- **UI/UX**：Angular Material
- **權限管理**：ngx-permissions

## 文件索引
為了更深入了解專案的各個方面，請參考以下詳細文件：

### 核心架構文件
- [專案結構與開發指南](docs/PROJECT_STRUCTURE.md)
- [模組概覽](docs/MODULE_OVERVIEW.md)
- [架構決策記錄](docs/ADR.md)

### Firebase 與後端
- [Firebase 設置指南](docs/FIREBASE_SETUP.md)
- [認證與權限指引](docs/AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md)
- [環境變數說明](docs/ENVIRONMENT_VARIABLES.md)

### 功能模組
- [使用者入口指南](docs/USER_PORTAL_GUIDE.md)
- [訪客頁面指南](docs/GUEST_PAGE_GUIDE.md)
- [管理面板指南](docs/ADMIN_PANEL_GUIDE.md)

### 開發工具
- [錯誤處理指南](docs/ERROR_HANDLING_GUIDE.md)
- [程式碼生成指南](docs/CODE_GENERATION_GUIDE.md)
- [風格指南](docs/STYLE_GUIDE.md)
- [測試指南](docs/TESTING_GUIDE.md)

### 專案管理
- [貢獻指南](docs/CONTRIBUTING.md)
- [開發路線圖](docs/ROADMAP.md)

## 文件交叉引用
為了幫助您更好地理解文件間的關係和依賴，我們提供了完整的 [文件交叉引用索引](docs/DOCUMENTATION_INDEX.md)，包含：

- **文件依賴關係圖**：視覺化展示各文件間的引用關係
- **服務與組件引用關係**：核心服務和組件的使用位置
- **錯誤處理統一引用**：所有錯誤處理的統一規範
- **快速導航**：按功能、開發階段、技術棧分類的導航

### 推薦閱讀順序
1. **開始開發**：README.md → PROJECT_STRUCTURE.md → FIREBASE_SETUP.md
2. **功能開發**：AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md → USER_PORTAL_GUIDE.md → ADMIN_PANEL_GUIDE.md
3. **程式碼品質**：STYLE_GUIDE.md → TESTING_GUIDE.md → ERROR_HANDLING_GUIDE.md
4. **專案維護**：CONTRIBUTING.md → ROADMAP.md → ADR.md

---
