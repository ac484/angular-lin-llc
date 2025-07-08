# 錯誤處理指南

## 目錄
- [簡介](#簡介)
- [錯誤類型](#錯誤類型)
- [全局錯誤處理](#全局錯誤處理)
- [HTTP 錯誤攔截](#http-錯誤攔截)
- [Firebase 錯誤處理](#firebase-錯誤處理)
- [錯誤通知與用戶體驗](#錯誤通知與用戶體驗)
- [開發與測試建議](#開發與測試建議)
- [檔案結構參考](#檔案結構參考)
- [參考資料](#參考資料)

## 簡介
此文件旨在定義專案中錯誤捕捉與處理的標準做法，確保前後端錯誤能被合理攔截、記錄，並提供友善的用戶提示，提升 AI 代碼生成時的錯誤處理準確性。

## 錯誤類型
- **同步錯誤**：程式邏輯錯誤、例外拋出 (例如：`ReferenceError`, `TypeError`)。
- **非同步錯誤**：HTTP 請求失敗、Promise 或 Observable 錯誤流 (例如：網路錯誤、API 返回狀態碼 4xx/5xx)。
- **系統錯誤**：Firebase 服務連線問題、第三方 SDK 錯誤等。

## 全局錯誤處理
透過 Angular 的 `ErrorHandler` 服務，集中捕捉應用程式中未被處理的同步錯誤。這有助於避免應用程式崩潰，並提供統一的錯誤記錄機制。

```typescript
// src/app/core/services/global-error-handler.ts
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
// 本檔案為全局錯誤處理服務，用於捕捉應用程式中未被處理的例外。

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private ngZone: NgZone) { }

  handleError(error: any): void {
    // 確保在 Angular Zone 之外執行，避免循環觸發變更檢測
    this.ngZone.run(() => {
      console.error('全局錯誤捕捉:', error);
      // TODO: 在生產環境中，將錯誤上報至錯誤監控服務 (如 Sentry 或 LogRocket)
      // this.notificationService.showError('應用程式發生錯誤，請稍後再試。'); // 可選：顯示友善提示
    });
  }
}
```

**註冊方式** (在 `app.config.ts` 或 `app.module.ts` 中提供)：
```typescript
import { provideErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './core/services/global-error-handler';

// 在 app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    // ... 其他 providers
    provideErrorHandler(GlobalErrorHandler),
  ]
};
```

## HTTP 錯誤攔截
使用 Angular 的 `HttpInterceptor` 統一處理所有 HTTP 請求的錯誤響應，這對於 API 錯誤、網路錯誤等非常有用。

```typescript
// src/app/core/services/http-error.interceptor.ts
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// 本檔案為 HTTP 錯誤攔截器，用於統一處理所有 HTTP 請求的錯誤。

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '發生未知錯誤';
        if (error.error instanceof ErrorEvent) {
          // 用戶端或網路錯誤
          errorMessage = `錯誤: ${error.error.message}`;
        } else {
          // 後端返回的錯誤
          errorMessage = `伺服器錯誤代碼: ${error.status}\n訊息: ${error.message}`;
          // 根據不同的狀態碼處理
          switch (error.status) {
            case 401: // 未授權
              // 例如：導向登入頁面
              break;
            case 403: // 禁止訪問
              // 例如：顯示權限不足提示
              break;
            case 404: // 資源未找到
              // 例如：顯示資源不存在提示
              break;
            case 500: // 伺服器內部錯誤
              // 例如：顯示通用伺服器錯誤提示
              break;
          }
        }
        console.error(errorMessage);
        // TODO: 可選：使用 NotificationService 顯示友善提示
        // this.notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
```

**註冊方式** (在 `app.config.ts` 或 `app.module.ts` 中提供)：
```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpErrorInterceptor } from './core/services/http-error.interceptor';

// 在 app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    // ... 其他 providers
    provideHttpClient(withInterceptors([
      (req, next) => new HttpErrorInterceptor().intercept(req, next)
    ])),
  ]
};
```

## Firebase 錯誤處理
Firebase SDK 操作可能產生特定的錯誤代碼，需要針對性處理以提供更精確的用戶回饋。直接在 Promise 的 `.catch()` 或 Observable 的 `catchError` 中處理。

```typescript
// 範例：處理 Firebase Authentication 錯誤
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Firebase Authentication。
import { AuthErrorCodes } from '@angular/fire/auth';

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
      // TODO: 使用 NotificationService 顯示 errorMessage
      throw error; // 重新拋出錯誤以便上層處理
    });
}
```

## 錯誤通知與用戶體驗
為了提升用戶體驗，應將原始錯誤訊息轉換為友善且可理解的提示，並透過統一的通知服務 (如 `NotificationService`) 顯示給用戶。

```typescript
// src/app/core/services/notification.service.ts (簡化範例)
import { Injectable } from '@angular/core';
// 本檔案為通知服務，用於向用戶顯示各種訊息 (成功、錯誤、警告)。

@Injectable({ providedIn: 'root' })
export class NotificationService {
  showSuccess(message: string): void {
    console.log('Success:', message); // 替換為實際的 UI 通知庫 (如 MatSnackBar)
  }

  showError(message: string): void {
    console.error('Error:', message); // 替換為實際的 UI 通知庫 (如 MatSnackBar)
  }

  showWarning(message: string): void {
    console.warn('Warning:', message); // 替換為實際的 UI 通知庫 (如 MatSnackBar)
  }
}
```

## 開發與測試建議
- **單元測試**：為 `GlobalErrorHandler`, `HttpErrorInterceptor` 和服務中的錯誤處理邏輯編寫單元測試。
- **整合測試**：在整合測試中模擬錯誤場景，驗證錯誤提示和狀態管理是否正確。
- **錯誤監控**：在生產環境中整合 Sentry 或 LogRocket 等錯誤監控工具，以便實時發現和分析問題。
- **日誌記錄**：在開發環境中詳細記錄錯誤日誌，幫助調試；在生產環境中則需謹慎記錄，避免敏感資訊洩露。

## 檔案結構參考
```
src/app/
├── core/
│   ├── services/
│   │   ├── global-error-handler.ts
│   │   ├── http-error.interceptor.ts
│   │   └── notification.service.ts
│   └── 
```

## 參考資料
- [Angular 錯誤處理官方文檔](https://angular.io/guide/error-handling-in-rxjs)
- [Angular HttpClient 攔截器](https://angular.io/guide/http#intercepting-requests-and-responses)
- [Firebase Authentication 錯誤代碼](https://firebase.google.com/docs/auth/admin/errors)
- [環境變數說明](ENVIRONMENT_VARIABLES.md)

---
