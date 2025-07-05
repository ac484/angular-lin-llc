# 貢獻指南

## 目錄
- [簡介](#簡介)
- [前置條件](#前置條件)
- [分支命名](#分支命名)
- [Pull Request](#pull-request)
- [程式碼審查](#程式碼審查)
- [版本發布](#版本發布)
- [參考資料](#參考資料)

## 簡介
此文件提供了為本專案貢獻程式碼的指引，旨在確保貢獻流程順暢、程式碼品質高，並符合專案的極簡主義原則。

## 前置條件
- 熟悉 Git 基本操作（`fork`, `clone`, `branch`, `commit`, `push`, `pull request`）。
- 了解 [專案結構與開發指南](PROJECT_STRUCTURE.md) 和 [風格指南](STYLE_GUIDE.md)。
- 安裝所有專案依賴並能成功運行測試。

## 分支命名
請遵循以下分支命名規範：
- `feature/<功能描述>`：用於新增功能，例如：`feature/user-login`。
- `fix/<問題描述>`：用於修復 Bug，例如：`fix/auth-redirect-bug`。
- `chore/<任務描述>`：用於雜項維護，例如：`chore/update-dependencies`。
- `docs/<文件描述>`：用於文件更新，例如：`docs/update-contributing-guide`。

> **注意**：請使用英文小寫與連字號（kebab-case）描述分支名稱，清晰表達修改目的。

## Pull Request (PR) 流程
1. **Fork 專案**：將本專案 Fork 到您的 GitHub 帳號。
2. **建立分支**：從 `main` 分支切出一個新分支，名稱應符合上述命名規範。
3. **程式碼修改**：在您的新分支上進行程式碼修改與開發，確保遵循 [風格指南](STYLE_GUIDE.md)。
4. **本地測試**：在提交前，請確保所有單元測試和整合測試通過，並手動測試您的改動。
5. **提交程式碼**：撰寫清晰的 Commit Message，格式請參考 [風格指南](STYLE_GUIDE.md) 中的 Commit Message 規範。
6. **推送分支**：將您的新分支推送到您的 Fork 倉庫。
7. **開啟 Pull Request**：在 GitHub 上開啟一個 Pull Request，目標分支請選擇本專案的 `main` 分支。
8. **填寫 PR 模板**：詳細說明您的改動內容、解決了什麼問題、以及如何測試您的改動。連結相關的 Issues 或 ADRs。
9. **等待審查**：等待專案維護者進行程式碼審查 (Code Review)。

## 程式碼審查 (Code Review) 重點
- **符合規範**：程式碼是否符合 [風格指南](STYLE_GUIDE.md) 中定義的程式碼風格、命名規範和極簡主義原則。
- **測試覆蓋**：是否有相應的單元測試和整合測試，確保新功能或修復的穩定性。
- **可讀性與可維護性**：程式碼是否清晰、易於理解和維護。
- **效能與安全性**：是否考量到潛在的效能瓶頸和安全問題。
- **極簡原則**：確保沒有引入不必要的複雜性、過度抽象或單次使用的服務/元件。

## 版本發布
本專案遵循 [Semantic Versioning (SemVer)](https://semver.org/) 版本規範 (`MAJOR.MINOR.PATCH`)。
- **MAJOR**：當有不相容的 API 變更時。
- **MINOR**：當新增功能且向下相容時。
- **PATCH**：當進行 Bug 修復且向下相容時。
每次合併 PR 到 `main` 分支後，將會觸發自動化發布流程。

## 參考資料
- [專案結構與開發指南](PROJECT_STRUCTURE.md)
- [風格指南](STYLE_GUIDE.md)
- [測試指南](TESTING_GUIDE.md)
- [開發路線圖](ROADMAP.md)
- [架構決策記錄](ADR.md)

---

## 分支命名規範

- `feature/<描述>`：新增功能  
- `fix/<描述>`：修復 Bug  
- `chore/<描述>`：雜項維護，如文件更新、環境調整等  

> 請使用英文小寫與連字號（kebab-case）描述分支名稱，清楚表達修改目的。

---

## Pull Request 流程

1. Fork 本專案至你的 GitHub 帳號。  
2. 建立符合命名規範的新分支，進行修改。  
3. 本地完整測試後，提交代碼並推送分支。  
4. 開啟 Pull Request，目標分支請選 `main`。  
5. 填寫 PR 模板，說明改動內容與原因。  
6. 指派 Reviewer 進行 Code Review。  

---

## Code Review 重點

- 是否符合專案的[程式碼風格指南](#)  
- 代碼是否有相應的單元測試或集成測試覆蓋  
- PR 說明是否完整且易於理解  
- 是否有充分考慮效能與安全性  

---

## 發版與版本號

- 採用 [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`)  
- 每次合併 PR 至 `main` 分支即觸發自動發版流程  
- 大版本更新（MAJOR）表示相容性破壞性變更  
- 次版本更新（MINOR）表示新增功能，且向下相容  
- 修訂版本（PATCH）表示修復 Bug，且向下相容  

---

感謝你對本專案的支持與貢獻！  
若有任何疑問，歡迎在 Issues 提問或與 Maintainer 聯繫。
