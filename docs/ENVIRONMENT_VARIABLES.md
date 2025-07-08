# 環境變數說明

## 目錄
- [簡介](#簡介)
- [Angular 環境配置](#angular-環境配置)
- [.env 檔案](#env-檔案)
- [安全與最佳實踐](#安全與最佳實踐)
- [參考資料](#參考資料)

## 簡介
此文件說明專案中環境變數的配置與使用方式，旨在確保應用程式在不同環境（開發、生產）下能正確運行，並保障敏感資訊的安全。

## Angular 環境配置
Angular 專案透過 `src/environments/` 目錄下的檔案來管理不同環境的配置。

- **`src/environments/environment.ts` (開發環境)**：
  用於本地開發模式的配置。所有非敏感或開發專用的變數應在此定義。
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
    // 其他開發環境專用變數
    // recaptchaSecretKey: 'YOUR_RECAPTCHA_SECRET_KEY',   // reCAPTCHA Secret Key（僅後端用）
  };
  ```

- **`src/environments/environment.prod.ts` (生產環境)**：
  用於生產部署的配置。此檔案應包含所有正式環境的配置，並在建構時替換 `environment.ts`。
  ```typescript
  export const environment = {
    production: true,
    firebase: {
      apiKey: "YOUR_PROD_API_KEY",
      authDomain: "YOUR_PROD_PROJECT.firebaseapp.com",
      projectId: "YOUR_PROD_PROJECT",
      storageBucket: "YOUR_PROD_PROJECT.appspot.com",
      messagingSenderId: "YOUR_PROD_MESSAGING_SENDER_ID",
      appId: "YOUR_PROD_APP_ID",
      measurementId: "YOUR_PROD_MEASUREMENT_ID"
    },
    openWeatherMapApiKey: 'YOUR_OPENWEATHERMAP_API_KEY', // OpenWeatherMap 天氣 API 金鑰
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',        // Google Maps API 金鑰
    vapidKey: 'YOUR_FCM_VAPID_KEY',                      // FCM 推播用 VAPID 公鑰
    recaptchaSiteKey: 'YOUR_RECAPTCHA_SITE_KEY',         // reCAPTCHA Site Key（前端用）
    // 其他生產環境專用變數
    // recaptchaSecretKey: 'YOUR_RECAPTCHA_SECRET_KEY',   // reCAPTCHA Secret Key（僅後端用）
  };
  ```

### reCAPTCHA Site Key 與 Secret Key 說明
- **Site Key**：用於前端（瀏覽器端）與 Google reCAPTCHA 互動，嵌入於 HTML 或 Angular 程式碼中。
- **Secret Key**：僅用於後端伺服器，驗證 reCAPTCHA token 是否有效，**嚴禁放在前端程式碼或公開於瀏覽器**。

### 使用方式
在您的 Angular 程式碼中，可以直接匯入並使用 `environment` 物件：
```typescript
import { environment } from '../environments/environment';

// 例如：訪問 reCAPTCHA Site Key
const recaptchaSiteKey = environment.recaptchaSiteKey;
```

> **注意**：reCAPTCHA Secret Key 僅能用於後端（如 Cloud Functions、Node.js 伺服器），不可出現在前端程式碼。

## .env 檔案 (本地開發可選)
儘管 Angular 內建環境配置機制，但在本地開發時，您也可以選擇使用 `.env` 檔案來管理敏感或常用的環境變數。這通常需要額外的工具（如 `dotenv` 或 Angular Builder 配置）來將 `.env` 變數載入到 Node.js 環境或注入到 Angular 應用中。

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

## 安全與最佳實踐
- **敏感資訊**：永遠不要將敏感資訊（如 API 金鑰、私鑰、OpenWeatherMap/Google Maps/FCM VAPID Key、reCAPTCHA Secret Key）直接提交到版本控制系統中。使用環境變數或專用的安全配置服務 (如 Firebase Functions 的環境變數、CI/CD Secret)。
- **reCAPTCHA Secret Key 僅限後端**：reCAPTCHA Secret Key 僅能用於後端伺服器（如 Node.js、Cloud Functions），**嚴禁出現在前端程式碼或公開於瀏覽器**。
- **前端限制**：請注意，即使使用環境變數，前端應用中的任何變數在瀏覽器中仍是可見的。對於極度敏感的資訊，應僅在後端（如 Firebase Cloud Functions）處理。
- **CI/CD 整合**：在 CI/CD 流程中，應配置 CI/CD 工具來注入生產環境的環境變數，而不是直接從程式碼庫讀取。
- **版本控制**：`environment.ts` 和 `environment.prod.ts` 可以被版本控制，但其中的實際值（`YOUR_API_KEY` 等）應替換為佔位符，或在 CI/CD 中進行替換。

## 參考資料
- [Angular Environments 官方文檔](https://angular.io/guide/build#configure-environment-specific-defaults)
- [Google reCAPTCHA 官方文件](https://developers.google.com/recaptcha/docs/v3)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Google Maps Platform](https://developers.google.com/maps/documentation)
- [Firebase Cloud Messaging 官方文檔](https://firebase.google.com/docs/cloud-messaging)
- [Firebase 設置指南](FIREBASE_SETUP.md)
- [錯誤處理指南](ERROR_HANDLING_GUIDE.md)

---

本文件與 [Firebase 設置指南](FIREBASE_SETUP.md) 協同使用。

## Angular 環境配置
- `src/environments/environment.ts`
  - `firebase.apiKey`
  - `firebase.authDomain`
  - `firebase.projectId`
  - `firebase.storageBucket`
  - `firebase.messagingSenderId`
  - `firebase.appId`
  - `firebase.measurementId`

- `src/environments/environment.prod.ts`
  - 同上

## .env 檔（可選）
```
API_KEY=...
AUTH_DOMAIN=...
