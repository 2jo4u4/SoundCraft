# SoundCraft EQ - 雙平台商店上架文案與審核指南手冊 (Store Listing & Reviewer Pack)

> 本文件彙整 **Chrome Web Store** 與 **Mozilla Firefox Add-ons (AMO)** 上架所需的全部中英文文案、權限宣告、審核人員備註（Notes to Reviewer）與源碼重現指南，可直接複製貼上使用。

---

## 📑 目錄

1. [基本資訊與多語系名稱](#1-基本資訊與多語系名稱)
2. [短描述 / 摘要 (Summary / Short Description)](#2-短描述--摘要-summary--short-description)
3. [版本新功能摘要 (What's New in v1.1.0) - 商店更新欄位專用](#3-版本新功能摘要-whats-new-in-v110---商店更新欄位專用)
4. [完整詳細介紹 (Detailed Description) - 英文版](#4-完整詳細介紹-detailed-description---英文版)
5. [完整詳細介紹 (Detailed Description) - 中文版 (繁體 / 簡體)](#5-完整詳細介紹-detailed-description---中文版-繁體--簡體)
6. [權限使用理由 (Permissions Justification - 審核專用)](#6-權限使用理由-permissions-justification---審核專用)
7. [審核人員測試備註 (Notes to Reviewer)](#7-審核人員測試備註-notes-to-reviewer)
8. [源碼打包與審核編譯說明 (AMO Source Code Build Guide)](#8-源碼打包與審核編譯說明-amo-source-code-build-guide)
9. [商店展示截圖文案 (Screenshot Captions 1280x800)](#9-商店展示截圖文案-screenshot-captions-1280x800)
10. [隱私與資料收集宣告 (Privacy & Data Declarations)](#10-隱私與資料收集宣告-privacy--data-declarations)

---

## 1. 基本資訊與多語系名稱

| 項目 | 英文 (en) | 繁體中文 (zh_TW) | 簡體中文 (zh_CN) |
| :--- | :--- | :--- | :--- |
| **擴充功能名稱 (Name)** | `SoundCraft EQ - Audio Equalizer` | `SoundCraft EQ - 專業音訊調音等化器` | `SoundCraft EQ - 专业音频调音均衡器` |
| **套件 ID (Firefox AMO)** | `soundcraft-eq@jay.addons.mozilla.org` | 同左 | 同左 |
| **版本號 (Version)** | `1.1.0` | `1.1.0` | `1.1.0` |
| **主分類 (Category)** | Music, Audio & Video / Media | 音樂、影音與相片 | 音乐、音视频与照片 |
| **支援瀏覽器** | Chrome, Edge, Brave, Opera, Firefox | Chrome, Edge, Brave, Opera, Firefox | Chrome, Edge, Brave, Opera, Firefox |
| **語系代碼 (Locale Code)** | `en` | `zh_TW` | `zh_CN` |
| **預設語言 (default_locale)** | `en` (全域兜底) | `en` (全域兜底) | `en` (全域兜底) |

---

## 2. 短描述 / 摘要 (Summary / Short Description)

> **字數限制提醒**：Firefox AMO 限制 250 字元以內；Chrome Web Store 限制 132 字元以內。

### 英文版 (English - en)
- **AMO 摘要 (Summary, 250 字元)**:
  > High-fidelity 5-band Web Audio equalizer with transparent peak limiter, true bypass, per-tab preset isolation, and intelligent in-page media picker for YouTube, Spotify, and streaming sites.
- **Chrome Web Store 簡短說明 (Short Description, 132 字元)**:
  > High-fidelity 5-band Web Audio EQ with peak limiter, true bypass, per-tab memory, and media picker for YouTube & streaming.

### 繁體中文版 (Traditional Chinese - zh_TW)
- **AMO 摘要 (Summary, 250 字元)**:
  > 專為影音串流打造的高音質 5 頻段 Web Audio 等化器。具備防破音峰值限制器、硬體級透明直通、多分頁獨立記憶，以及智慧畫面元素拾取功能。
- **Chrome Web Store 簡短說明 (Short Description, 132 字元)**:
  > 高音質 5 頻段 Web Audio 等化器，內建防破音限制器、0ms 旁路直通、多分頁獨立記憶與畫面拾取功能。

### 簡體中文版 (Simplified Chinese - zh_CN)
- **AMO 摘要 (Summary, 250 字元)**:
  > 专为流媒体打造的高品质 5 频段 Web Audio 均衡器。具备防破音峰值限制器、硬件级透明直通、多标签独立记忆，以及智能画面元素拾取功能。
- **Chrome Web Store 简短说明 (Short Description, 132 字元)**:
  > 高品质 5 频段 Web Audio 均衡器，内置防破音限制器、0ms 旁路直通、多标签独立记忆与画面选取功能。

---

## 3. 版本新功能摘要 (What's New in v1.1.0) - 商店更新欄位專用

> 商店上傳新版本時，後台「What's new in this version / 此版本新功能」欄位直接複製對應語系：

### 英文版 (English)
```text
What's New in v1.1.0:
• ✨ Per-Tab Preset Memory: Each tab now independently preserves its active preset and custom gain adjustments without altering your global favorite default.
• 🌐 Multi-Language Compliance: Restructured localization supporting Traditional Chinese (zh_TW) and Simplified Chinese (zh_CN) per Chrome Web Store standards.
• ⚡ Audio Pipeline Stability: Optimized YouTube SPA auto-reconnect and Spotify Web background music audibility priority scoring.
• 🛡️ Frame Routing Safety: Enhanced multi-frame silence guard preventing unneeded status downgrades in nested iframes.
```

### 繁體中文版 (Traditional Chinese - zh_TW)
```text
v1.1.0 更新內容：
• ✨ 多分頁獨立狀態記憶：各分頁現在完全獨立記憶其目前使用的等化器預設與微調數值，切換分頁不會互相干擾，且不再意外覆蓋全域首選（最愛）。
• 🌐 Chrome 商店語系規範全面支援：重整語系架構，完整支援台灣繁體中文（zh_TW）與簡體中文（zh_CN）。
• ⚡ 音訊引擎穩定性優化：強化 YouTube SPA 換頁自動重掛載與 Spotify 背景音樂的發聲優先權判定。
• 🛡️ 多 Frame 通訊防禦：強化 iframe 靜默防護，杜絕巢狀廣告頁面干擾主視訊等化狀態。
```

### 簡體中文版 (Simplified Chinese - zh_CN)
```text
v1.1.0 更新内容：
• ✨ 多标签独立状态记忆：各个标签页现在完全独立记忆其当前使用的均衡器预设与微调数值，切换标签不会相互干扰，且不再意外覆盖全局首选。
• 🌐 Chrome 商店语言规范全面支持：重构语言架构，完整支持简体中文（zh_CN）与繁体中文（zh_TW）。
• ⚡ 音频引擎稳定性优化：强化 YouTube SPA 切页自动重挂载与 Spotify 背景音乐的发声优先级判定。
• 🛡️ 多 Frame 通讯防御：强化 iframe 静默防护，杜绝嵌套广告页面干扰主视频均衡状态。
```

---

## 4. 完整詳細介紹 (Detailed Description) - 英文版

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

## 5. 完整詳細介紹 (Detailed Description) - 中文版 (繁體 / 簡體)

### 4.1 繁體中文版 (Traditional Chinese - zh_TW)

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

### 4.2 簡體中文版 (Simplified Chinese - zh_CN)

```markdown
SoundCraft EQ 是一款专为 YouTube、Bilibili、Spotify Web、Netflix、Twitch 以及各大流媒体平台打造的高性能、低延迟 5 频段 Web Audio 均衡器扩展。

基于原生 Web Audio API DSP 信号处理技术与现代化 React 18 架构，让您在浏览器中享受录音室级别的细腻音质，彻底告别传统调音常见的爆音与破音失真。

==================================================
🌟 核心功能亮点
==================================================

🎵 5 频段专业滤波器链
精选 5 个调音黄金频段，支持 -12dB 至 +12dB 实时无爆音微调：
• 60 Hz（重低音）：震撼包围感与极低频下潜感
• 230 Hz（低频厚度）：温暖厚实的人声与打击乐冲击力
• 910 Hz（人声核心）：核心中频、人声轮廓与乐器主体
• 4 kHz（清晰度）：咬字细节、吉他扫弦与穿透力
• 14 kHz（超高频空气感）：清脆通透的残响与空间开阔感

🛡️ 透明防破音峰值限制器 (Peak Limiter)
后端串接专业级动态压缩限制器（DynamicsCompressorNode，-0.5dB 阈值、20:1 压缩比、3ms 超快起音时间）。即使将低音或高音大幅推满，也能自动平滑突波，杜绝数码削波破音。

⚡ 硬件级透明直通 (True Bypass)
一键电源开关。关闭时音频直接从播放器直通输出至扬声器，滤波器停止运算，实现 0 运算消耗与 0 毫秒额外延迟。

🎯 可视化画面元素拾取模式 (In-Page Picker)
网页有多个播放器或广告干扰？点击“画面选取目标”即可开启全屏巡检：
• 鼠标悬停于视频或播放器容器（YouTube, Bilibili, Spotify 等）时即时高亮蓝色虚线框并显示标签。
• 点击即可安全绑定音频，完全不打断视频播放或跳转进度条。
• 针对 Spotify Web 等无像素背景音乐，自动生成画面底部悬浮胶囊，一键点选。

📑 多标签独立状态记忆 (Per-Tab Preset Memory & Isolation)
每个浏览器标签独立在内存中维护其活跃预设与调音数值。标签 A 切换至“Bass Cut”，完全不干扰标签 B 的“Standard Flat”；新开标签自动套用您的“全局首选（最爱）”。

💾 专业调音预设体系
• 内置 5 款系统调音档：Standard Flat（标准均衡）、Bass Boost（低频增强）、Bass Cut（低频衰减）、Treble Boost（高频增强）、Vocal Boost（人声增强）。
• 完整自定义操作：★ 设为首选、💾 覆盖保存、➕ 另存新档、⟲ 还原变更、🗑 删除预设。
• 智能变动（Dirty）检测：微调滑块时自动解锁另存与还原按钮。

🌐 依域名独立记忆与安全预设
自动记录您在各网站的使用习惯（例如：YouTube 保持开启、办公网站保持关闭）。首次开启新网站默认为旁路直通（Bypassed），保护网页原生音质。

🔒 100% 本地运算与纯净隐私
无任何第三方追踪代码、无分析脚本、无远程服务器请求。所有音频处理与个人调音档案均完全保存在本地。
```

---

## 6. 權限使用理由 (Permissions Justification - 審核專用)

> 上架 Chrome Web Store 及 Firefox AMO 時，請直接複製以下對應中英文：

### 英文版 (Reviewer Justification)
- **`storage`**:
  > Used exclusively to store user equalizer presets, favorite preset preference, and per-domain bypass configurations locally on the user's device via browser.storage.local. No data is transmitted externally.
- **`tabs`**:
  > Required to retrieve the active tab's domain name to apply per-domain equalizer configurations and to route audio control messages (open, ctrl, toggleBypass) between the popup interface and the active tab's content script.
- **`host_permissions (<all_urls>)`**:
  > The extension needs to inject its content script into media-playing websites (such as YouTube, Bilibili, Spotify Web, Vimeo, Netflix, etc.) to capture `<video>` and `<audio>` elements via the Web Audio API (`createMediaElementSource`). Without host access, audio processing cannot be attached.

### 繁體中文版 (zh_TW)
- **`storage`**:
  > 僅用於透過 `browser.storage.local` 在使用者本機儲存自訂等化器預設、全域首選預設以及各網域獨立開關設定。絕不對外傳輸任何資料。
- **`tabs`**:
  > 用於讀取當前分頁之網域名稱以套用依網域記憶之等化器偏好，並在 Popup 介面與分頁 Content Script 之間傳遞音訊控制指令。
- **`主機存取權限 (<all_urls>)`**:
  > 擴充功能必須將 Content Script 注入至使用者瀏覽之影音網站（如 YouTube、Bilibili、Spotify Web 等），以透過 Web Audio API (`createMediaElementSource`) 連接視訊與音訊標籤以執行調音處理。

### 簡體中文版 (zh_CN)
- **`storage`**:
  > 仅用于通过 `browser.storage.local` 在用户本地存储自定义均衡器预设、全局首选预设以及各域名独立开关设置。绝不对外传输任何数据。
- **`tabs`**:
  > 用于读取当前标签页的域名以应用依域名记忆的均衡器偏好，并在 Popup 界面与标签页 Content Script 之间传递音频控制指令。
- **`主机访问权限 (<all_urls>)`**:
  > 扩展程序必须将 Content Script 注入到用户浏览的音视频网站（如 YouTube、Bilibili、Spotify Web 等），以通过 Web Audio API (`createMediaElementSource`) 连接音频与视频标签以执行调音处理。

---

## 7. 審核人員測試備註 (Notes to Reviewer)

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

## 8. 源碼打包與審核編譯說明 (AMO Source Code Build Guide)

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
# 打包 ZIP 產物: .output/equalizer-extension-1.1.0-firefox.zip
```

---

## 9. 商店展示截圖文案 (Screenshot Captions 1280x800)

本專案於 `release/portfolio_screenshots/` 目錄下提供 5 張符合商店規格之 1280×800 實機截圖：

| 檔案名稱 | 截圖主題 | 英文展示標籤 (Caption) | 繁中展示標籤 |
| :--- | :--- | :--- | :--- |
| `01_hero_equalizer.png` | **主控制面板** | Modern 5-Band Studio Equalizer & Real-time DSP Controls | 現代化 5 頻段專業等化器面板與即時 DSP 控制 |
| `02_media_picker_menu.png` | **智慧媒體選單** | Smart Audio Stream Discovery & Auto-Recommendation | 智慧多媒體探索選單、播放狀態與推薦指標 |
| `03_inpage_picker_overlay.png` | **畫面元素拾取** | In-Page Visual Element Picker with Non-destructive Binding | 網頁全螢幕視覺化元素拾取模式，一鍵直覺繫結 |
| `04_preset_selector_menu.png` | **調音預設集** | Versatile Built-in & Custom Acoustic Presets | 豐富的系統調音預設集與自訂預設管理 |
| `05_band_guide.png` | **頻段聲學導引** | Acoustic Engineering Frequency Guide & Tuning Knowledge | 5 大核心頻段聲學調整教育指南與調音心法 |

---

## 10. 隱私與資料收集宣告 (Privacy & Data Declarations)

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
