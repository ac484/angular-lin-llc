# Firebase 設置指南

## 目錄
- [簡介](#簡介)
- [前置條件](#前置條件)
- [核心服務](#核心服務)
- [配置步驟](#配置步驟)
- [安全規則範例](#安全規則範例)
- [參考資料](#參考資料)

## 簡介
此文件旨在引導開發者在 Angular 專案中正確配置 Firebase，確保各項服務（認證、Firestore、儲存等）能順暢運行，並符合專案的極簡主義開發規範。

## 前置條件
- 已擁有一個有效的 [Firebase Console 帳號](https://console.firebase.google.com)。
- 已安裝 Node.js (推薦 20.x 版本)。
- 已全域安裝 Angular CLI：`npm install -g @angular/cli`。
- 已在專案中安裝 Firebase 相關套件：`npm install firebase @angular/fire ngx-permissions`。

## 核心服務
本專案主要使用以下 Firebase 服務：
- **Firebase Authentication**：提供用戶身份驗證（電子郵件/密碼、Google 登入）。
- **Firebase Firestore**：NoSQL 資料庫，用於儲存應用程式資料。
- **Firebase Storage**：用於儲存用戶上傳的檔案。
- **Firebase Hosting**：用於部署 Angular 前端應用程式。
- **Firebase App Check**：提供應用程式完整性保護，防止未經授權的 API 存取。
- **Firebase Cloud Messaging (FCM)**：用於推送通知 (可選)。

## 配置步驟

### 1. 建立 Firebase 專案與取得配置
前往 [Firebase Console](https://console.firebase.google.com)，建立一個新專案或選擇現有專案。在專案設定中，為您的 Web 應用程式新增應用程式，並取得 Firebase 配置物件。

### 2. 更新 Angular 環境檔案
將從 Firebase Console 取得的配置物件填入 `src/environments/environment.ts` (開發環境) 和 `src/environments/environment.prod.ts` (生產環境) 中。請確保敏感資訊（如 `apiKey`）在生產環境中受到適當保護。

**`src/environments/environment.ts` 範例**：
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_DEV_API_KEY",
    authDomain: "YOUR_DEV_PROJECT.firebaseapp.com",
    projectId: "YOUR_DEV_PROJECT",
    storageBucket: "YOUR_DEV_PROJECT.appspot.com",
    messagingSenderId: "YOUR_DEV_MESSAGING_SENDER_ID",
    appId: "YOUR_DEV_APP_ID",
    measurementId: "YOUR_DEV_MEASUREMENT_ID"
  },
  openWeatherMapApiKey: 'YOUR_OPENWEATHERMAP_API_KEY', // OpenWeatherMap 天氣 API 金鑰
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',        // Google Maps API 金鑰
  vapidKey: 'YOUR_FCM_VAPID_KEY',                      // FCM 推播用 VAPID 公鑰
  recaptchaSiteKey: 'YOUR_RECAPTCHA_SITE_KEY',         // reCAPTCHA Site Key（前端用）
  // recaptchaSecretKey: 'YOUR_RECAPTCHA_SECRET_KEY',   // reCAPTCHA Secret Key（僅後端用）
};
```

### 3. 初始化 Firebase 服務 (在 `app.config.ts` 或 `app.module.ts` 中)
建議在 `app.config.ts` (或 `app.module.ts`，如果您使用舊版模組) 中進行 Firebase 服務的初始化。此處應只使用官方 `@angular/fire` 和 `firebase` 客戶端 SDK。

```typescript
// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAppCheck, initializeAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';
import { provideMessaging, getMessaging } from '@angular/fire/messaging'; // 如需推送通知

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... 其他 providers
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
      provideAppCheck(() => initializeAppCheck(initializeApp(environment.firebase), {
        provider: new ReCaptchaV3Provider(environment.recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true
      })),
      provideMessaging(() => getMessaging()) // 如需推送通知
    )
  ]
};
```

### 4. 配置 Firebase App Check
App Check 有助於保護您的後端資源免受濫用，例如未經授權的客戶端發出的帳單欺詐或網路釣魚。強烈建議在生產環境中啟用並配置為強制模式。

- 在 Firebase Console 中為您的應用程式啟用 reCAPTCHA v3 或其他供應商。
- 將 reCAPTCHA Site Key 配置到 `environment.ts` 和 `environment.prod.ts`。
- **reCAPTCHA Secret Key 僅用於後端驗證，不可放在前端程式碼。**
- 確保 `initializeAppCheck` 中的 `isTokenAutoRefreshEnabled` 設置為 `true`。

### 5. 設定 Cloud Messaging (FCM) 與 VAPID Key
如果您的應用程式需要接收推送通知，請配置 Firebase Cloud Messaging (FCM)。

- 在 Firebase Console 中啟用 Cloud Messaging。
- 獲取並配置您的 VAPID 金鑰（`vapidKey`）。
- 在 `environment.ts`/`.env` 中設置 `vapidKey`。

### 6. 其他第三方 API 金鑰
- **OpenWeatherMap**：請於 [OpenWeatherMap](https://openweathermap.org/api) 申請 API Key，並設置於 `openWeatherMapApiKey`。
- **Google Maps**：請於 [Google Cloud Console](https://console.cloud.google.com/) 申請 Maps API Key，並設置於 `googleMapsApiKey`。

## .env 檔案 (本地開發可選)

**範例 `.env` 檔案 (根目錄)**：
```dotenv
# Firebase 配置（僅用於本地開發，生產環境請直接配置 environment.prod.ts 或 CI/CD 變數）
FIREBASE_API_KEY="YOUR_LOCAL_FIREBASE_API_KEY"
FIREBASE_AUTH_DOMAIN="YOUR_LOCAL_FIREBASE_AUTH_DOMAIN"

# OpenWeatherMap
OPENWEATHERMAP_API_KEY="YOUR_OPENWEATHERMAP_API_KEY"

# Google Maps
GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"

# Firebase Cloud Messaging (FCM) VAPID
FCM_VAPID_KEY="YOUR_FCM_VAPID_KEY"

# reCAPTCHA Site Key（前端用）
RECAPTCHA_SITE_KEY="YOUR_RECAPTCHA_SITE_KEY"
# reCAPTCHA Secret Key（僅後端用，請勿放在前端）
RECAPTCHA_SECRET_KEY="YOUR_RECAPTCHA_SECRET_KEY"
```

**注意**：`.env` 檔案應被添加到 `.gitignore` 中，避免將敏感資訊提交到版本控制。

## 安全規則範例
為了保障資料安全，必須在 Firebase Console 中配置 Firestore 和 Storage 的安全規則。以下是一些基本範例：

### Firestore 安全規則
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允許已登入用戶讀寫自己的用戶資料
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    // 允許所有用戶讀取公開專案列表
    match /projects/{projectId} {
      allow read: if true; // 所有人可讀
      allow write: if request.auth != null && request.auth.uid == resource.data.ownerId; // 僅擁有者可寫
    }
    // 其他集合的規則... (例如，管理員才能寫入某些集合)
  }
}
```

### Storage 安全規則
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 允許已登入用戶讀寫自己目錄下的檔案
    match /users/{uid}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    // 允許所有用戶讀取公開檔案
    match /public/{allPaths=**} {
      allow read: if true;
    }
  }
}
```

## 參考資料
- [Firebase 官方文件](https://firebase.google.com/docs)
- [AngularFire 官方文件](https://github.com/angular/angularfire)
- [環境變數說明](ENVIRONMENT_VARIABLES.md)
- [認證與權限指引](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md)
- [錯誤處理指南](ERROR_HANDLING_GUIDE.md)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Google Maps Platform](https://developers.google.com/maps/documentation)
- [Firebase Cloud Messaging 官方文檔](https://firebase.google.com/docs/cloud-messaging)
- [Google reCAPTCHA 官方文件](https://developers.google.com/recaptcha/docs/v3)

---

本文件與 [專案結構與開發指南](PROJECT_STRUCTURE.md)、[認證與權限指引](AUTH_FIREBASE_NGX_PERMISSIONS_GUIDE.md)、[環境變數說明](ENVIRONMENT_VARIABLES.md) 協同使用。

## 已安裝套件
- `@angular/fire`
- `firebase`
- `ngx-permissions`

## 配置步驟

1. **建立 Firebase 專案**  
   前往 Firebase Console，新增 Web 應用並取得配置物件。

2. **更新環境檔**  
   在 `src/environments/environment.ts`（開發）及 `environment.prod.ts`（生產）填入：
   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT",
       storageBucket: "YOUR_PROJECT.appspot.com",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID"
     }
   };
   ```

3. **初始化 App Check (reCAPTCHA v3)**  
   ```typescript
   import { provideAppCheck, initializeAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';
   provideAppCheck(() => initializeAppCheck(undefined, {
     provider: new ReCaptchaV3Provider('YOUR_SITE_KEY'),
     isTokenAutoRefreshEnabled: true
   }));
   ```

4. **設定 Cloud Messaging (VAPID)**  
   ```typescript
   import { provideMessaging, getMessaging, getToken } from '@angular/fire/messaging';
   provideMessaging(() => getMessaging());
   getToken(getMessaging(), { vapidKey: 'YOUR_VAPID_KEY' });
   ```

5. **測試與驗證**  
   - 認證：登入、註冊  
   - Firestore：CRUD 操作  
   - Storage：檔案上傳/刪除

## 安全規則範例

- **Firestore**
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{uid} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
  ```

- **Storage**
  ```javascript
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /users/{uid}/{allPaths=**} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
  ```

## 下一步
- 在 Firebase Console 部署安全規則
- 優化 App Check 與 Messaging 