# 程式碼生成指南

## 目錄
- [簡介](#簡介)
- [前置條件](#前置條件)
- [核心命令](#核心命令)
- [常用選項](#常用選項)
- [範例](#範例)
- [參考資料](#參考資料)

## 簡介
此文件旨在提供 Angular CLI 程式碼生成的最佳實踐，幫助開發者快速、一致地建立專案元件、服務、模組等，確保生成程式碼符合極簡主義與專案規範，提升 AI 代碼生成準確性。

## 前置條件
- 已全域安裝 Angular CLI：`npm install -g @angular/cli`
- 專案已初始化並運行 `npm install`。

## 核心命令
- `ng generate (or ng g)`：用於生成新的 Angular 程式碼片段（schematics）。

## 常用選項
以下是生成元件、服務和模組時常用的選項，這些選項有助於生成符合極簡主義與專案規範的程式碼：
- `--standalone`：生成獨立元件 (Standalone Component)，減少對 NgModules 的依賴，符合 Angular 17+ 的趨勢。
- `--changeDetection=OnPush`：將變更檢測策略設置為 OnPush，提升應用程式效能，符合極簡主義效能優化原則。
- `--flat`：不為生成的文件創建專用資料夾，適用於單一檔案元件或服務。
- `--skip-tests`：不生成測試文件，用於快速原型開發或在不需要自動測試時使用。
- `--type=<type>`：為特定文件類型（如 `service` 或 `pipe`）生成別名，提高可讀性。

## 範例
### 1. 生成獨立元件 (Standalone Component)
這將在 `src/app/features/users/components/` 下生成一個獨立的 `LoginComponent`。
```bash
ng generate component features/users/components/login --standalone --changeDetection=OnPush
```

### 2. 生成服務
這將在 `src/app/core/services/` 下生成一個 `auth.service.ts`。
```bash
ng generate service core/services/auth --flat --skip-tests
```

### 3. 生成模組（帶路由）
這將在 `src/app/features/admin/` 下生成一個 `admin.module.ts` 和 `admin-routing.module.ts`。
```bash
ng generate module features/admin --flat --routing
```

### 4. 生成管道 (Pipe)
這將在 `src/app/shared/pipes/` 下生成一個 `truncate.pipe.ts`。
```bash
ng generate pipe shared/pipes/truncate --flat
```

## 參考資料
- [Angular CLI 官方文檔](https://angular.io/cli)
- [Angular 17+ Standalone Components](https://angular.io/guide/standalone-components)
- [專案結構與開發指南](PROJECT_STRUCTURE.md)

---
