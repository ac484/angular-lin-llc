# 訪客頁面指南

## 目錄
- [簡介](#簡介)
- [功能](#功能)
- [前置條件](#前置條件)
- [核心元件](#核心元件)
- [實作要點](#實作要點)
- [範例](#範例)
- [參考資料](#參考資料)

## 簡介
此文件說明訪客頁面的功能與限制，旨在提供未登入用戶瀏覽公開專案內容的介面，並強調只讀權限的實現，以符合極簡主義設計，同時提升 AI 代碼生成準確性。

## 功能
- **查看公開專案列表**：顯示所有被標記為公開的專案。
- **瀏覽專案詳情**：允許訪客查看專案的詳細資訊和其節點結構，但無法修改。
- **只讀介面**：所有操作均為讀取，不提供任何編輯、新增或刪除功能。

## 前置條件
- 已完成 [Firebase 設置指南](FIREBASE_SETUP.md) 中 Firebase Firestore 的初始化。
- Firestore 安全規則已配置，允許未認證用戶讀取公開資料。

## 核心元件
- `GuestPageComponent`：作為訪客頁面的主要入口元件，負責載入和顯示公開專案數據。

## 實作要點
1. **Firestore 公開讀取**：
   - 配置 Firestore 安全規則，允許未認證用戶讀取特定的集合（例如 `/publicProjects` 或 `projects` 集合中具有 `isPublic: true` 欄位的文檔）。
   - 在 `GuestPageComponent` 中，直接使用 `FirebaseService` 讀取這些公開資料。
2. **UI 限制**：
   - 在模板中，禁用所有可能導致資料修改的 UI 元素（例如：按鈕、輸入框、編輯圖示）。
   - 不顯示需要用戶登入才能使用的功能入口。
3. **簡潔的數據展示**：
   - 使用 Angular Material 的 `mat-card` 或 `mat-list` 來展示專案列表，保持 UI 簡潔。
   - 避免在訪客介面中顯示過於詳細或敏感的資訊。

## 範例
### 1. `GuestPageComponent` 讀取公開專案範例
```typescript
// src/app/features/guest/guest-page.component.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore。
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Observable } from 'rxjs';
import { Project } from 'src/app/core/models/project.types'; // 假設您有 Project 型別定義

@Component({
  selector: 'app-guest-page',
  template: `
    <div class="guest-container">
      <mat-card *ngFor="let project of publicProjects$ | async">
        <mat-card-header>
          <mat-card-title>{{ project.name }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>{{ project.description }}</p>
          <p>創建者: {{ project.ownerName }}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary" [routerLink]="'/projects/' + project.id">
            查看詳情
          </button>
        </mat-card-actions>
      </mat-card>
      <p *ngIf="!(publicProjects$ | async)?.length">目前沒有公開專案。</p>
    </div>
  `,
  styleUrls: ['./guest-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestPageComponent implements OnInit {
  publicProjects$: Observable<Project[]> | undefined;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    // 讀取所有 isPublic 為 true 的專案
    this.publicProjects$ = this.firebaseService.getPublicProjects();
  }
}
```

### 2. Firestore 安全規則範例 (允許公開讀取)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      // 允許所有用戶（包括未認證用戶）讀取 isPublic 為 true 的專案
      allow read: if resource.data.isPublic == true;
      // 禁止所有用戶寫入操作
      allow write: if false;
    }
    // 如果有單獨的公開集合，也可以這樣配置：
    // match /publicProjects/{docId} {
    //   allow read: if true;
    //   allow write: if false;
    // }
  }
}
```

## 參考資料
- [Firebase Firestore 官方文檔](https://firebase.google.com/docs/firestore)
- [Firebase 安全規則](https://firebase.google.com/docs/rules)
- [Firebase 設置指南](FIREBASE_SETUP.md)
- [專案結構與開發指南](PROJECT_STRUCTURE.md)

---

本文件與 [專案結構與開發指南](PROJECT_STRUCTURE.md)、[Firebase 設置指南](FIREBASE_SETUP.md)、[認證與權限指引](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md) 協同使用。

描述訪客可瀏覽的公共內容與互動限制。

## 功能
- 查看專案列表
- 查看任務與節點結構
- 只讀，不需登入

## 模組結構
```
src/app/features/guest/
└── guest-page.component.ts
```

## 實作要點
- 使用 Firestore 讀取公開資料
- 禁用編輯按鈕
- 使用 Angular Material Card 顯示列表

## 下一步
- 新增搜尋與篩選功能
