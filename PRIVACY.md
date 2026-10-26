# Privacy Policy for SoundCraft EQ

**Effective Date:** October 26, 2026  
**Last Updated:** October 26, 2026  

SoundCraft EQ ("the Extension") is committed to protecting your privacy. This Privacy Policy explains our practices regarding user information.

---

### 1. Zero Data Collection
SoundCraft EQ **does not collect, store, transmit, or sell any personal information or browsing data**.
- No analytics services or telemetry tracking libraries are included.
- No cookies or remote tracking identifiers are created or read.
- No network requests are made to external servers by this extension.

### 2. Local Storage Usage (`browser.storage.local`)
The Extension uses your browser's local storage solely to save your personal preferences on your own device:
- Custom frequency equalizer presets.
- Favorite preset selections.
- Per-domain enabled/bypassed toggle states.

All stored data remains strictly on your local machine and is never shared, synced to unauthorized third parties, or transmitted over the internet.

### 3. Media & Audio Processing
All audio equalization is performed 100% on the client side using the standard browser Web Audio API. The Extension does not record, intercept, or send your audio/video content anywhere.

### 4. Permissions Justification
- `activeTab`: Used solely to detect and connect to media elements on the current tab when the popup is opened.
- `storage`: Used solely to persist your EQ settings locally.
- Host permissions (`http://*/*`, `https://*/*`): Required exclusively to allow the equalizer to attach to HTML5 `<audio>` and `<video>` elements across websites you visit.

### 5. Contact
If you have any questions about this Privacy Policy, you can open an issue on the project's repository.

---

# SoundCraft EQ 隱私權政策 (繁體中文)

**生效日期：** 2026 年 10 月 26 日  

SoundCraft EQ（以下簡稱「本擴充功能」）非常重視您的個人隱私。本政策說明本擴充功能對使用者資訊的處理原則：

1. **不收集任何個人資料**：本擴充功能不收集、不傳輸、不販售任何個人資訊、上網瀏覽紀錄或帳號數據。
2. **本地端儲存 (`storage`)**：僅用於在使用者自己的裝置本機端儲存等化器設定（如自訂調音、常用收藏與各網域開關狀態），絕不對外傳輸。
3. **純本機音訊處理**：所有等化音效均透過瀏覽器原生的 Web Audio API 於本機端即時運算，絕不側錄或外傳任何聲音或影片內容。
4. **無第三方追蹤**：未嵌入任何第三方統計工具、分析外掛或廣告 SDK。
