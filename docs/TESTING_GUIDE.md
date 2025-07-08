# 測試指南（Testing Guide）

## 目錄
- [簡介](#簡介)
- [測試類型](#測試類型)
- [前置條件](#前置條件)
- [測試工具](#測試工具)
- [常用測試指令](#常用測試指令)
- [單元測試範例](#單元測試範例)
- [元件測試範例](#元件測試範例)
- [E2E 測試範例](#e2e-測試範例)
- [Mock/Spy 技巧](#mockspy-技巧)
- [測試覆蓋率與報告](#測試覆蓋率與報告)
- [CI/CD 自動化測試](#cicd-自動化測試)
- [常見問題與排除](#常見問題與排除)
- [最佳實踐建議](#最佳實踐建議)
- [參考資料](#參考資料)

---

## 簡介
本指南針對本專案的測試方法、流程與工具，協助團隊維持高品質開發。涵蓋單元測試、元件測試、端到端測試（E2E）、覆蓋率、常見問題與自動化流程。遵循這些指南將有助於 AI 生成更健壯且易於測試的程式碼，同時貫徹極簡主義的測試理念。

---

## 測試類型

- **單元測試 (Unit Test)**：驗證 service、pipe、function 等最小邏輯單元的正確性。
- **元件測試 (Component Test)**：測試 Angular component 的 DOM、事件與依賴注入。
- **整合測試 (Integration Test)**：測試多單元/模組協同作用。
- **端到端測試 (E2E Test)**：用 Cypress 等工具模擬用戶實際操作，驗證全流程。

---

## 前置條件

- Node.js (建議 20.x 以上，可用 nvm 管理)
- Angular CLI  
  ```bash
  npm install -g @angular/cli
  ```
- 安裝專案依賴  
  ```bash
  npm install
  ```
- 熟悉 Jasmine/Karma（單元/元件測試），Cypress（E2E 測試，推薦）

---

## 測試工具

- **Karma + Jasmine**：預設 Angular 測試環境
- **Cypress**：現代化 E2E 測試工具，支援錄影、快照
- **測試覆蓋率工具**：可自動產生報告，追蹤測試完整性

---

## 常用測試指令

| 目的 | 指令 |
|---|---|
| 執行所有單元測試 | `ng test` |
| 產生覆蓋率報告 | `ng test --code-coverage` |
| CI/CD 單次測試 | `ng test --watch=false --browsers=ChromeHeadless` |
| 執行 E2E 測試（Cypress） | `npx cypress run` 或 `npx cypress open` |

---

## 單元測試範例（Service）

```typescript
// src/app/core/services/firebase.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { FirebaseService } from './firebase.service';
import { Auth } from '@angular/fire/auth';
import { of, throwError } from 'rxjs';
// 本檔案為 FirebaseService 的單元測試，用於驗證其 Firebase 相關操作。

describe('FirebaseService', () => {
  let service: FirebaseService;
  let authMock: any;

  beforeEach(() => {
    authMock = {
      signInWithPopup: jasmine.createSpy().and.returnValue(Promise.resolve({ user: { uid: 'testUid', email: 'test@example.com' } })),
      signOut: jasmine.createSpy().and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        FirebaseService,
        { provide: Auth, useValue: authMock }
      ]
    });
    service = TestBed.inject(FirebaseService);
  });

  it('應該被創建', () => {
    expect(service).toBeTruthy();
  });

  it('應該成功登入 Google', (done) => {
    service.loginWithGoogle().subscribe(user => {
      expect(user.uid).toEqual('testUid');
      expect(authMock.signInWithPopup).toHaveBeenCalled();
      done();
    });
  });

  it('登入失敗應回傳錯誤', (done) => {
    authMock.signInWithPopup.and.returnValue(Promise.reject('登入錯誤'));
    service.loginWithGoogle().subscribe({
      error: err => {
        expect(err).toBe('登入錯誤');
        done();
      }
    });
  });

  it('應該可以登出', (done) => {
    service.logout().subscribe(() => {
      expect(authMock.signOut).toHaveBeenCalled();
      done();
    });
  });
});
```

---

## 元件測試範例（Component）

```typescript
// src/app/users/containers/login/login.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
// 本檔案為 LoginComponent 的單元測試，用於驗證登入元件的功能。

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let firebaseServiceMock: any;
  let permissionsServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    firebaseServiceMock = { loginWithGoogle: jasmine.createSpy('loginWithGoogle') };
    permissionsServiceMock = { loadPermissions: jasmine.createSpy('loadPermissions') };
    routerMock = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [MatButtonModule],
      declarations: [LoginComponent],
      providers: [
        { provide: FirebaseService, useValue: firebaseServiceMock },
        { provide: NgxPermissionsService, useValue: permissionsServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('應該被創建', () => {
    expect(component).toBeTruthy();
  });

  it('點擊 Google 登入後應調用登入服務並導向專案頁面', () => {
    const mockUser = { uid: '1', email: 'a@b.com', permissions: ['test'] };
    firebaseServiceMock.loginWithGoogle.and.returnValue(of(mockUser));

    component.login();

    expect(firebaseServiceMock.loginWithGoogle).toHaveBeenCalled();
    expect(permissionsServiceMock.loadPermissions).toHaveBeenCalledWith(mockUser.permissions);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/projects']);
  });

  it('登入失敗時應處理錯誤', () => {
    const error = new Error('登入失敗');
    firebaseServiceMock.loginWithGoogle.and.returnValue(throwError(() => error));
    spyOn(console, 'error');

    component.login();

    expect(firebaseServiceMock.loginWithGoogle).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('登入失敗:', error);
  });
});
```

---

## E2E 測試範例（Cypress）

```javascript
// cypress/e2e/login.cy.js
describe('登入流程', () => {
  it('應顯示登入頁面', () => {
    cy.visit('/login');
    cy.contains('Google 登入').should('be.visible');
  });

  it('點擊 Google 登入應導向專案頁', () => {
    // 可以 mock API 或設定測試帳號
    cy.intercept('POST', '/api/auth', { statusCode: 200, body: { uid: '1', email: 'a@b.com' } });
    cy.visit('/login');
    cy.get('button').contains('Google 登入').click();
    cy.url().should('include', '/projects');
  });
});
```

---

## Mock/Spy 技巧

- **Mock**：模擬依賴與回傳值，隔離測試重點。
- **Spy**：監控 function 是否被呼叫及參數。

```typescript
const serviceMock = {
  myMethod: jasmine.createSpy('myMethod').and.returnValue(of('mockData'))
};
spyOn(console, 'error');
```

---

## 測試覆蓋率與報告

- 執行  
  ```bash
  ng test --code-coverage
  ```
- 報告路徑：`coverage/index.html`，使用瀏覽器開啟檢視。
- `angular.json` 覆蓋率下限建議設定（只需片段）：
  ```json
  "test": {
    "options": {
      "codeCoverage": true,
      "codeCoverageExclude": [
        "src/main.ts",
        "src/polyfills.ts",
        "src/app/**/*.module.ts"
      ],
      "coverageThreshold": {
        "statements": 80,
        "branches": 80,
        "functions": 80,
        "lines": 80
      }
    }
  }
  ```

---

## CI/CD 自動化測試（GitHub Actions 範例）

```yaml
# .github/workflows/test.yml
name: Angular Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
      - run: npm ci
      - run: npm run test -- --watch=false --browsers=ChromeHeadless --code-coverage
      - name: 上傳覆蓋率報告
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
```

---

## 常見問題與排除

- **測試執行卡住**：檢查非同步測試有無呼叫 `done()` 或正確使用 `async/await`。
- **覆蓋率過低**：補強例外情境與錯誤處理測試。
- **外部 API 問題**：測試時請 mock API 或使用 stub。
- **CI/CD 跑測試失敗**：檢查 node/chrome 版本與依賴安裝。

---

## 最佳實踐建議

- 測試命名要明確，易懂
- 每個 public function 都應有對應測試
- 使用 mock/spy 隔離依賴、聚焦邏輯測試
- 新功能務必附測試，bug 修正要補回歸測試
- E2E 測試聚焦用戶實際操作流程

---

## 參考資料

- [Angular 測試官方文件](https://angular.io/guide/testing)
- [Jasmine 官方](https://jasmine.github.io/)
- [Karma 官方](https://karma-runner.github.io/)
- [Cypress 官方](https://docs.cypress.io/)
- [GitHub Actions 文檔](https://docs.github.com/en/actions)
- [錯誤處理指南](ERROR_HANDLING_GUIDE.md)

---
