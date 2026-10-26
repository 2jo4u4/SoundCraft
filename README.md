# Equalizer Browser Extension (等化器擴充功能)

高品質 Web Audio 5 頻段音訊等化器瀏覽器擴充功能。支援 Chrome、Edge、Brave 及 Firefox。

---

## 🚀 特色功能

- **高品質 5 頻段等化器**：60Hz、230Hz、910Hz、4kHz、14kHz，支援 -12dB 至 +12dB 微調。
- **透明防破音動態壓縮器 (DynamicsCompressorNode)**：終端內建 Peak Limiter，高增益時有效防止數位爆音與破音。
- **全域主動音訊捕獲**：
  - 捕獲階段監聽全頁播放事件 (`play`)，無縫銜接 YouTube 切換影片、Spotify 等 SPA 網站。
  - 遞迴穿透 Open Shadow DOM 與 iFrame (`all_frames: true`)，相容各類客製化 Web 播放器。
  - 智慧優先權判定：自動鎖定發聲播放中的媒體，過濾背景無聲廣告。
- **CORS 跨域限制安全偵測**：即時識別受 CORS 標頭限制之媒體，並於 Popup 狀態晶片友善提示。
- **多語系支援**：繁體中文 (預設) 與 英文。
- **現代化儲存與遷移**：修復舊版 `Map` 序列化遺失缺陷，升級版本時完整保留使用者的自訂預設。

---

## 🛠️ 開發與建置

本專案使用 [WXT](https://wxt.dev/)（基於 Vite 8）與 React 18 + MUI 進行建置。

### 安裝依賴
```bash
npm install
```

### 開發模式 (含熱重載 HMR)
```bash
npm run dev           # Chrome
npm run dev:firefox   # Firefox
```

### 生產建置
```bash
npm run build         # 建置 Chrome MV3 (.output/chrome-mv3)
npm run build:firefox # 建置 Firefox MV3 (.output/firefox-mv3)
```

### 型別檢查
```bash
npm run compile
```

### 打包發布檔 (Zip)
```bash
npm run zip           # 產出 Chrome Web Store zip (.output/equalizer-extension-1.0.0-chrome.zip)
npm run zip:firefox   # 產出 Firefox AMO zip 與審核源碼包
```

---

## 📦 如何在瀏覽器中載入測試

### Google Chrome / Edge / Brave:
1. 開啟瀏覽器並前往 `chrome://extensions/`（Edge 則為 `edge://extensions/`）。
2. 在右上角開啟「**開發人員模式** (Developer mode)」。
3. 點選「**載入未封裝項目** (Load unpacked)」。
4. 選擇專案資料夾下的 `.output/chrome-mv3` 目錄。

### Mozilla Firefox:
1. 開啟 Firefox 並前往 `about:debugging#/runtime/this-firefox`。
2. 點選「**載入暫時性附加元件** (Load Temporary Add-on)」。
3. 選擇專案資料夾下的 `.output/firefox-mv3/manifest.json`。
