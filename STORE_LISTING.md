# SoundCraft EQ - 雙平台商店上架文案與審核指南手冊 (Store Listing & Reviewer Pack)

> 本文件彙整 **Chrome Web Store** 與 **Mozilla Firefox Add-ons (AMO)** 上架所需的全部中英文文案、權限宣告、審核人員備註（Notes to Reviewer）與源碼重現指南，可直接複製貼上使用。

---

## 📑 目錄

1. [基本資訊與中英文名稱](#1-基本資訊與中英文名稱)
2. [短描述 / 摘要 (Summary / Short Description)](#2-短描述--摘要-summary--short-description)
3. [完整詳細介紹 (Detailed Description) - 英文版](#3-完整詳細介紹-detailed-description---英文版)
4. [完整詳細介紹 (Detailed Description) - 繁體中文版](#4-完整詳細介紹-detailed-description---繁體中文版)
5. [權限使用理由 (Permissions Justification - 審核專用)](#5-權限使用理由-permissions-justification---審核專用)
6. [審核人員測試備註 (Notes to Reviewer)](#6-審核人員測試備註-notes-to-reviewer)
7. [源碼打包與審核編譯說明 (AMO Source Code Build Guide)](#7-源碼打包與審核編譯說明-amo-source-code-build-guide)
8. [商店展示截圖文案 (Screenshot Captions 1280x800)](#8-商店展示截圖文案-screenshot-captions-1280x800)
9. [隱私與資料收集宣告 (Privacy & Data Declarations)](#9-隱私與資料收集宣告-privacy--data-declarations)

---

## 1. 基本資訊與中英文名稱

| 項目 | 英文 (en) | 繁體中文 (zh-TW) |
| :--- | :--- | :--- |
| **擴充功能名稱 (Name)** | `SoundCraft EQ - Audio Equalizer` | `SoundCraft EQ - 專業音訊調音等化器` |
| **套件 ID (Firefox AMO)** | `soundcraft-eq@jay.addons.mozilla.org` | 同左 |
| **版本號 (Version)** | `1.0.0` | `1.0.0` |
| **主分類 (Category)** | Music, Audio & Video / Media | 音樂、影音與相片 |
| **支援瀏覽器** | Chrome, Edge, Brave, Opera, Firefox | Chrome, Edge, Brave, Opera, Firefox |
| **預設語言** | English (en) | 繁體中文 (zh-TW) |

---

## 2. 短描述 / 摘要 (Summary / Short Description)

> **字數限制提醒**：Firefox AMO 限制 250 字元以內；Chrome Web Store 限制 132 字元以內。

### 英文版 (English)
- **AMO 摘要 (Summary, 250 字元)**:
  > High-fidelity 5-band Web Audio equalizer with transparent peak limiter, true bypass, per-tab preset isolation, and intelligent in-page media picker for YouTube, Spotify, and streaming sites.
- **Chrome Web Store 簡短說明 (Short Description, 132 字元)**:
  > High-fidelity 5-band Web Audio EQ with peak limiter, true bypass, per-tab memory, and media picker for YouTube & streaming.

### 繁體中文版 (Traditional Chinese)
- **AMO 摘要 (Summary, 250 字元)**:
  > 專為影音串流打造的高音質 5 頻段 Web Audio 等化器。具備防破音峰值限制器、硬體級透明直通、多分頁獨立記憶，以及智慧畫面元素拾取功能。
- **Chrome Web Store 簡短說明 (Short Description, 132 字元)**:
  > 高音質 5 頻段 Web Audio 等化器，內建防破音限制器、0ms 旁路直通、多分頁獨立記憶與畫面拾取功能。

---

## 3. 完整詳細介紹 (Detailed Description) - 英文版

```markdown
SoundCraft EQ is a high-fidelity, ultra-low-latency 5-band Web Audio equalizer browser extension engineered for YouTube, Bilibili, Spotify Web, Netflix, Twitch, and all modern streaming media.

Built with native Web Audio API DSP and modern React 18, SoundCraft EQ delivers studio-grade acoustics directly in your browser without digital distortion or unwanted clipping.

==================================================
🌟 KEY FEATURES
==================================================

🎵 5-Band Studio Grade Filter Chain
Fine-tune your acoustics across 5 golden frequency bands:
• 60 Hz: Sub-bass & low-end rumble
• 230 Hz: Bass body, warmth & fullness
• 910 Hz: Midrange, vocal clarity & instruments
• 4 kHz: Presence, articulation & attack
• 14 kHz: Brilliance & high-frequency air
Gain range: -12 dB to +12 dB with smooth, click-free parameter transitions.

🛡️ Transparent Peak Limiter (Anti-Clipping)
Equipped with an integrated DynamicsCompressorNode (-0.5 dB threshold, 20:1 ratio, 3ms attack). Boost any frequency band to the maximum without fear of digital clipping, harsh distortion, or audio pops.

⚡ True Hardware-Grade Bypass
Toggling the power switch routes audio directly from the source to your speakers with 0ms latency and 0 CPU overhead, completely disengaging the DSP pipeline.

🎯 In-Page Visual Element Picker Overlay
Having trouble on pages with multiple audio/video streams? Click "Pick from page" to enter the full-screen visual inspector:
• Hover over any video or player container (YouTube, Bilibili, Spotify) to highlight it with an intuitive dashed overlay and target badge.
• Click to bind audio instantly without interrupting playback.
• Automatically displays a floating control capsule for zero-pixel background music streams.

📑 Per-Tab Preset Memory & Isolation
Each browser tab independently preserves its active preset and custom slider tweaks. Switching presets on Tab A will never disrupt playback or settings on Tab B. Newly opened tabs automatically inherit your designated Favorite preset.

💾 Presets Management & Dirty State Tracking
• Built-in system presets: Standard Flat, Bass Boost, Bass Cut, Treble Boost, Vocal Boost.
• Custom preset features: Set as Global Favorite (★), Overwrite (💾), Save As New (➕), Revert Tweaks (⟲), Delete (🗑).
• Smart dirty-state detection enables Save As / Revert as soon as sliders differ from their original values.

🌐 Per-Domain Persistence & Safe Defaults
SoundCraft EQ remembers your on/off preference per website (e.g., active on YouTube, bypassed on GitHub). Newly visited websites are safely bypassed by default.

🔒 100% Private & Offline
Zero analytics, zero tracking, and zero remote network requests. All audio processing and settings are stored locally in your browser.
```

---

## 4. 完整詳細介紹 (Detailed Description) - 繁體中文版

```markdown
SoundCraft EQ 是一款專為 YouTube、Bilibili、Spotify Web、Netflix、Twitch 以及各大影音串流平台打造的高效能、低延遲 5 頻段 Web Audio 等化器擴充功能。

基於原生 Web Audio API DSP 訊號處理技術與現代化 React 18 架構，讓您在瀏覽器中享受錄音室等級的細緻音質，徹底告別傳統調音常見的爆音與破音失真。

==================================================
🌟 核心功能亮點
==================================================

🎵 5 頻段專業濾波器鏈
精選 5 個調音黃金頻段，支援 -12dB 至 +12dB 即時無爆音微調：
• 60 Hz（重低音）：震撼包覆感與極低頻潛水感
• 230 Hz（低頻厚度）：溫暖厚實的人聲與打擊樂衝擊力
• 910 Hz（人聲核心）：核心中頻、人聲輪廓與樂器主體
• 4 kHz（清晰度）：咬字細節、吉他刷弦與穿透力
• 14 kHz（超高頻空氣感）：清脆通透的殘響與空間開闊感

🛡️ 透明防破音峰值限制器 (Peak Limiter)
後端串接專業級動態壓縮限制器（DynamicsCompressorNode，-0.5dB 門檻值、20:1 壓縮比、3ms 超快起音時間）。即使將低音或高音頻段大幅推滿，也能自動抚平突波，杜絕數位削波破音。

⚡ 硬體級透明直通 (True Bypass)
一鍵電源開關。關閉時音訊直接從播放器直通輸出至揚聲器，濾波器停止運算，實現 0 運算消耗與 0 毫秒額外延遲。

🎯 視覺化畫面元素拾取模式 (In-Page Picker)
網頁有多個播放器或廣告干擾？點擊「畫面選取目標」即可開啟全螢幕巡檢：
• 滑鼠懸停於視訊或播放器容器（YouTube, Bilibili, Spotify 等）時即時高亮藍色虛線框並顯示標籤。
• 點擊即可安全繫結音訊，完全不打斷影片播放或跳轉進度條。
• 針對 Spotify Web 等無像素背景音樂，自動生成畫面底部懸浮膠囊，一鍵點選。

📑 多分頁獨立狀態記憶 (Per-Tab Preset Memory & Isolation)
每個瀏覽器分頁獨立在記憶體中維護其活躍預設與調音數值。分頁 A 切換至「Bass Cut」，完全不干擾分頁 B 的「Standard Flat」；新開分頁自動套用您的「全域首選（最愛）」。

💾 專業調音預設體系
• 內建 5 款系統調音檔：Standard Flat（標準平直）、Bass Boost（低音強化）、Bass Cut（低音衰減）、Treble Boost（高音強化）、Vocal Boost（人聲強化）。
• 完整自訂操作：★ 設為首選、💾 覆蓋儲存、➕ 另存新檔、⟲ 還原變更、🗑 刪除預設。
• 智慧更動（Dirty）偵測：微調滑桿時自動解鎖另存與還原按鈕。

🌐 依網域獨立記憶與安全預設
自動記錄您在各網站的使用習慣（例如：YouTube 保持開啟、一般辦公網站保持關閉）。首次開啟新網站預設為旁路直通（Bypassed），保護網頁原生音質。

🔒 100% 本地運算與純淨隱私
無任何第三方追蹤代碼、無分析腳本、無遠端伺服器請求。所有音訊處理與個人調音檔案均完全儲存於本機。
```

---

## 5. 權限使用理由 (Permissions Justification - 審核專用)

> 上架 Chrome Web Store 及 Firefox AMO 時，請直接複製以下對應中英文：

### 英文版 (Reviewer Justification)
- **`storage`**:
  > Used exclusively to store user equalizer presets, favorite preset preference, and per-domain bypass configurations locally on the user's device via browser.storage.local. No data is transmitted externally.
- **`tabs`**:
  > Required to retrieve the active tab's domain name to apply per-domain equalizer configurations and to route audio control messages (open, ctrl, toggleBypass) between the popup interface and the active tab's content script.
- **`host_permissions (<all_urls>)`**:
  > The extension needs to inject its content script into media-playing websites (such as YouTube, Bilibili, Spotify Web, Vimeo, Netflix, etc.) to capture `<video>` and `<audio>` elements via the Web Audio API (`createMediaElementSource`). Without host access, audio processing cannot be attached.

### 繁體中文版
- **`storage`**:
  > 僅用於透過 `browser.storage.local` 在使用者本機儲存自訂等化器預設、全域首選預設以及各網域獨立開關設定。絕不對外傳輸任何資料。
- **`tabs`**:
  > 用於讀取當前分頁之網域名稱以套用依網域記憶之等化器偏好，並在 Popup 介面與分頁 Content Script 之間傳遞音訊控制指令。
- **`主機存取權限 (<all_urls>)`**:
  > 擴充功能必須將 Content Script 注入至使用者瀏覽之影音網站（如 YouTube、Bilibili、Spotify Web 等），以透過 Web Audio API (`createMediaElementSource`) 連接視訊與音訊標籤以執行調音處理。

---

## 6. 審核人員測試備註 (Notes to Reviewer)

> 填寫於 Firefox AMO 的「Notes to Reviewer」或 Chrome Web Store 的「Testing Instructions」：

```
Hello Reviewer,

Thank you for reviewing SoundCraft EQ!

1. HOW TO TEST THE EXTENSION:
   a. Open YouTube (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ) or Spotify Web (https://open.spotify.com).
   b. Play any video or song.
   c. Click the SoundCraft EQ icon in the browser toolbar to open the popup.
   d. The audio status chip will show "Connected" (or "已連線") with green indicator.
   e. Turn the "EQ Bypass" switch to "ON" (active).
   f. Select the "Bass Boost" preset or drag the 60Hz slider upwards. You will immediately hear the rich bass enhancement in real-time.
   g. Open a second tab (Tab B), play another video, and open popup: notice Tab B maintains its own isolated preset state.
   h. Test the In-Page Picker: Click the media status dropdown -> select "Pick from page" -> hover over the video player on the page -> click to bind.

2. SPECIAL CAPABILITIES:
   • True Bypass: When turned off, the audio signal routes directly to AudioContext.destination with 0ms latency and 0 CPU overhead.
   • Spotify Web: Compatible with detached media and audibility scoring (+800 bonus to audible music over muted canvas loop videos).
   • Zero Data Collection: The extension is 100% offline and collects no personal data or analytics.

3. SOURCE CODE & BUILD INSTRUCTIONS:
   Please refer to the attached source zip file and the section below for deterministic build steps.
```

---

## 7. 源碼打包與審核編譯說明 (AMO Source Code Build Guide)

> Firefox AMO 要求上架包含預編譯代碼的擴充功能時提供源碼與重現指南：

### 審核編譯資訊
- **Node.js 版本**: `>= 18.0.0` (推薦 Node 20 LTS)
- **套件管理工具**: `npm`
- **建置框架**: WXT 0.21.5 (基於 Vite 8 + React 18 + TypeScript 5)

### 重現指令 (Deterministic Build Steps)
```bash
# 1. 解壓縮源碼包後進入專案目錄
cd equalizer-extension

# 2. 安裝依賴套件 (乾淨安裝)
npm ci
# 或一般安裝: npm install

# 3. 執行 TypeScript 型別檢查
npm run compile

# 4. 執行自動化測試 (28 項測試全數通過)
npm test

# 5. 建置 Firefox 生產版本
npm run build:firefox

# 產物將位於: .output/firefox-mv3/
# 打包 ZIP 產物: .output/equalizer-extension-1.0.0-firefox.zip
```

---

## 8. 商店展示截圖文案 (Screenshot Captions 1280x800)

本專案於 `release/portfolio_screenshots/` 目錄下提供 5 張符合商店規格之 1280×800 實機截圖：

| 檔案名稱 | 截圖主題 | 英文展示標籤 (Caption) | 繁中展示標籤 |
| :--- | :--- | :--- | :--- |
| `01_hero_equalizer.png` | **主控制面板** | Modern 5-Band Studio Equalizer & Real-time DSP Controls | 現代化 5 頻段專業等化器面板與即時 DSP 控制 |
| `02_media_picker_menu.png` | **智慧媒體選單** | Smart Audio Stream Discovery & Auto-Recommendation | 智慧多媒體探索選單、播放狀態與推薦指標 |
| `03_inpage_picker_overlay.png` | **畫面元素拾取** | In-Page Visual Element Picker with Non-destructive Binding | 網頁全螢幕視覺化元素拾取模式，一鍵直覺繫結 |
| `04_preset_selector_menu.png` | **調音預設集** | Versatile Built-in & Custom Acoustic Presets | 豐富的系統調音預設集與自訂預設管理 |
| `05_band_guide.png` | **頻段聲學導引** | Acoustic Engineering Frequency Guide & Tuning Knowledge | 5 大核心頻段聲學調整教育指南與調音心法 |

---

## 9. 隱私與資料收集宣告 (Privacy & Data Declarations)

### Chrome Web Store 隱私權問卷選項填寫指引
- **Single Purpose (單一用途說明)**:
  > SoundCraft EQ provides a 5-band Web Audio equalizer and peak limiter to adjust audio frequencies for streaming media playing in the browser.
- **Permission Justification Checkboxes**:
  - `storage`: Checked (Store user presets locally).
  - `tabs`: Checked (Communicate with active tab to control audio DSP).
- **Data Usage / Data Collection Checkboxes**:
  - Does the extension collect user data? **NO (No data collected)**.
  - Does the extension transmit data to third-party servers? **NO (100% offline)**.
  - Does the extension sell user data? **NO**.

### Firefox AMO 資料收集宣告
- **Data Collection Permissions**:
  - `browser_specific_settings.gecko.data_collection_permissions.required: ["none"]`
- **Privacy Policy URL**:
  - 專案根目錄提供 [`PRIVACY.md`](file:///d:/project/equalizer-extension/PRIVACY.md)。
