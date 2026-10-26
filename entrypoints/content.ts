import {
  Store,
  Equalizer,
  sendMessageToRuntime,
  isMediaCorsRestricted,
  cloneFilters,
  scoreMedia,
  extractMediaMetadata,
  buildDiscoveredMediaItem,
} from "../utils";
import type { AudioConnectionStatus, SendMsg, MsgToFormat, DiscoveredMediaItem } from "../utils";

export default defineContentScript({
  matches: ["https://*/*", "http://*/*"],
  allFrames: true,
  runAt: "document_idle",
  main() {
    let equalizer: Equalizer | null = null;
    let currentStatus: AudioConnectionStatus = "no_media";
    let activeMedia: HTMLMediaElement | null = null;
    let discoveredMedia: HTMLMediaElement[] = [];
    let activeMediaIndex: number = 0;
    let isPickerActive: boolean = false;
    let cleanupPicker: (() => void) | null = null;

    // 取得所有 DOM（包含 Open Shadow DOM）內的媒體元素
    function scanMediaElements(root: Node = document): HTMLMediaElement[] {
      const results: HTMLMediaElement[] = [];

      function traverse(node: Node) {
        if (node instanceof HTMLMediaElement) {
          results.push(node);
        }

        // 遞迴遍歷子節點
        node.childNodes.forEach(child => traverse(child));

        // 遞迴遍歷 Open Shadow Root
        if (node instanceof Element && node.shadowRoot) {
          node.shadowRoot.childNodes.forEach(child => traverse(child));
        }
      }

      traverse(root);
      return results;
    }

    // 計算媒體評分並產生 DiscoveredMediaItem 清單
    function getDiscoveredMediaList(): DiscoveredMediaItem[] {
      discoveredMedia = scanMediaElements();
      if (discoveredMedia.length === 0) return [];

      // 計算各媒體評分以決定推薦對象
      let maxScore = -1;
      let recommendedIdx = 0;
      discoveredMedia.forEach((media, idx) => {
        const score = scoreMedia(media, media === activeMedia);
        if (score > maxScore) {
          maxScore = score;
          recommendedIdx = idx;
        }
      });

      return discoveredMedia.map((media, idx) =>
        buildDiscoveredMediaItem(
          media,
          idx,
          media === activeMedia,
          idx === recommendedIdx,
          document
        )
      );
    }

    // 廣播當前狀態至 Popup
    function broadcastStatus() {
      const mediaList = getDiscoveredMediaList();
      sendMessageToRuntime("statusUpdate", {
        status: currentStatus,
        mediaIndex: discoveredMedia.length > 0 ? activeMediaIndex + 1 : 0,
        mediaTotal: discoveredMedia.length,
        bypass: equalizer ? equalizer.isBypassed : false,
        mediaList,
      });
    }

    // 將 Equalizer 繫結至指定媒體
    async function attachToMedia(media: HTMLMediaElement, index = activeMediaIndex) {
      if (!equalizer) {
        equalizer = new Equalizer();
      }

      activeMedia = media;
      activeMediaIndex = index;

      // 檢查 CORS
      if (isMediaCorsRestricted(media)) {
        currentStatus = "cors_restricted";
        console.warn("[Equalizer] Target media is restricted by CORS headers:", media.src || media.currentSrc);
      } else {
        currentStatus = "connected";
      }

      await equalizer.stream(media);
      broadcastStatus();
    }

    // 依最佳評分自動選取媒體
    async function autoSelectBest() {
      discoveredMedia = scanMediaElements();
      if (discoveredMedia.length === 0) {
        currentStatus = "no_media";
        activeMedia = null;
        activeMediaIndex = 0;
        // 子 iframe 無媒體時徹底保持靜默；頂層 Frame 則延遲 200ms 確認無子 Frame 回應後才廣播
        if (window === window.top) {
          setTimeout(() => {
            if (activeMedia === null && scanMediaElements().length === 0) {
              broadcastStatus();
            }
          }, 200);
        }
        return;
      }

      let bestIdx = 0;
      let bestScore = -1;
      discoveredMedia.forEach((media, idx) => {
        const score = scoreMedia(media, media === activeMedia);
        if (score > bestScore) {
          bestScore = score;
          bestIdx = idx;
        }
      });

      activeMediaIndex = bestIdx;
      const target = discoveredMedia[bestIdx];
      if (target) {
        await attachToMedia(target, bestIdx);
      }
    }

    // 嘗試自動發現並連接媒體
    async function tryConnect(cycle = false) {
      discoveredMedia = scanMediaElements();
      if (discoveredMedia.length === 0) {
        currentStatus = "no_media";
        activeMedia = null;
        activeMediaIndex = 0;
        // 子 iframe 無媒體時徹底保持靜默；頂層 Frame 則延遲 200ms 確認無子 Frame 回應後才廣播
        if (window === window.top) {
          setTimeout(() => {
            if (activeMedia === null && scanMediaElements().length === 0) {
              broadcastStatus();
            }
          }, 200);
        }
        return;
      }

      if (cycle && discoveredMedia.length > 1) {
        activeMediaIndex = (activeMediaIndex + 1) % discoveredMedia.length;
      } else {
        await autoSelectBest();
        return;
      }

      const target = discoveredMedia[activeMediaIndex] ?? discoveredMedia[0];
      if (target) {
        await attachToMedia(target, activeMediaIndex);
      }
    }

    // 顯示短暫 Toast 提示
    function showToast(text: string) {
      const toast = document.createElement("div");
      toast.id = "equalizer-picker-toast";
      Object.assign(toast.style, {
        position: "fixed",
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#1976d2",
        color: "#ffffff",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "bold",
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        zIndex: "2147483647",
        fontFamily: "system-ui, -apple-system, sans-serif",
        pointerEvents: "none",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      });
      toast.textContent = text;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(-10px)";
        setTimeout(() => toast.remove(), 350);
      }, 2000);
    }

    // 啟動畫面元素選取器 (Element Picker Overlay)
    function startElementPicker() {
      if (isPickerActive) {
        cleanupPicker?.();
      }
      isPickerActive = true;

      // 1. 建立高亮外框容器
      const highlightBox = document.createElement("div");
      highlightBox.id = "equalizer-picker-highlight";
      Object.assign(highlightBox.style, {
        position: "fixed",
        pointerEvents: "none",
        border: "2px dashed #1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.16)",
        borderRadius: "4px",
        zIndex: "2147483645",
        display: "none",
        boxSizing: "border-box",
        transition: "all 0.05s ease-out",
      });

      // 2. 建立浮動標籤
      const badge = document.createElement("div");
      badge.id = "equalizer-picker-badge";
      Object.assign(badge.style, {
        position: "absolute",
        top: "-28px",
        left: "0",
        backgroundColor: "#1976d2",
        color: "#ffffff",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "2px 8px",
        borderRadius: "4px",
        whiteSpace: "nowrap",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        fontFamily: "system-ui, sans-serif",
        pointerEvents: "none",
      });
      badge.textContent = browser.i18n.getMessage("pickerOverlayHint" as any) || "點擊選取以繫結等化器 (ESC 取消)";
      highlightBox.appendChild(badge);
      document.body.appendChild(highlightBox);

      // 3. 檢查是否有隱藏式背景音訊（例如 Spotify 或 0x0 音訊標籤）
      discoveredMedia = scanMediaElements();
      const hiddenAudio = discoveredMedia.find(el => {
        const rect = el.getBoundingClientRect();
        return el instanceof HTMLAudioElement || (rect.width === 0 && rect.height === 0);
      });

      let floatingPill: HTMLDivElement | null = null;
      if (hiddenAudio) {
        floatingPill = document.createElement("div");
        floatingPill.id = "equalizer-picker-spotify-pill";
        const meta = extractMediaMetadata(hiddenAudio, document);
        const pillText = browser.i18n.getMessage("floatingSpotifyHint" as any) || "🎵 偵測到背景播放音訊 (點此快速繫結)";
        floatingPill.textContent = `${pillText}: ${meta.title}`;
        Object.assign(floatingPill.style, {
          position: "fixed",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#1db954",
          color: "#ffffff",
          padding: "10px 22px",
          borderRadius: "30px",
          fontSize: "14px",
          fontWeight: "bold",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          zIndex: "2147483647",
          cursor: "pointer",
          fontFamily: "system-ui, sans-serif",
          transition: "transform 0.15s ease, background-color 0.15s ease",
        });

        floatingPill.onmouseenter = () => {
          if (floatingPill) floatingPill.style.transform = "translateX(-50%) scale(1.05)";
        };
        floatingPill.onmouseleave = () => {
          if (floatingPill) floatingPill.style.transform = "translateX(-50%) scale(1)";
        };

        floatingPill.addEventListener(
          "click",
          e => {
            e.preventDefault();
            e.stopPropagation();
            const idx = discoveredMedia.indexOf(hiddenAudio);
            attachToMedia(hiddenAudio, idx !== -1 ? idx : 0);
            showToast(browser.i18n.getMessage("pickerSuccessToast" as any) || "已成功繫結音訊目標！");
            cleanup();
          },
          true
        );

        document.body.appendChild(floatingPill);
      }

      // 輔助函式：尋找滑鼠目標下的媒體或播放器容器
      function findMediaTarget(target: Element | null): { media: HTMLMediaElement | null; container: Element | null } {
        if (!target) return { media: null, container: null };

        if (target instanceof HTMLMediaElement) {
          return { media: target, container: target };
        }

        // 常見主流播放器容器 (YouTube, Bilibili, Twitch, etc.)
        const container = target.closest(
          ".html5-video-player, #movie_player, .bpx-player-video-wrap, .bilibili-player-video, .video-player__container, [data-testid='now-playing-widget']"
        );
        if (container) {
          const innerMedia = container.querySelector("video, audio");
          if (innerMedia instanceof HTMLMediaElement) {
            return { media: innerMedia, container };
          }
        }

        const childMedia = target.querySelector("video, audio");
        if (childMedia instanceof HTMLMediaElement) {
          return { media: childMedia, container: target };
        }

        const parentMedia = target.closest("video, audio");
        if (parentMedia instanceof HTMLMediaElement) {
          return { media: parentMedia, container: parentMedia };
        }

        return { media: null, container: null };
      }

      let currentHoveredMedia: HTMLMediaElement | null = null;

      // 監聽滑鼠移動
      function onMouseMove(e: MouseEvent) {
        const target = document.elementFromPoint(e.clientX, e.clientY);
        const { media, container } = findMediaTarget(target);

        if (media && container) {
          currentHoveredMedia = media;
          const rect = container.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            highlightBox.style.display = "block";
            highlightBox.style.top = `${rect.top}px`;
            highlightBox.style.left = `${rect.left}px`;
            highlightBox.style.width = `${rect.width}px`;
            highlightBox.style.height = `${rect.height}px`;

            const meta = extractMediaMetadata(media, document);
            badge.textContent = `🎯 ${meta.title} (點擊繫結)`;
            return;
          }
        }

        currentHoveredMedia = null;
        highlightBox.style.display = "none";
      }

      // 監聽點擊選取
      function onClick(e: MouseEvent) {
        if (floatingPill && floatingPill.contains(e.target as Node)) {
          return;
        }

        if (currentHoveredMedia) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          const targetMedia = currentHoveredMedia;
          discoveredMedia = scanMediaElements();
          let idx = discoveredMedia.indexOf(targetMedia);
          if (idx === -1) {
            discoveredMedia.push(targetMedia);
            idx = discoveredMedia.length - 1;
          }

          attachToMedia(targetMedia, idx);
          showToast(browser.i18n.getMessage("pickerSuccessToast" as any) || "已成功繫結音訊目標！");
          cleanup();
        }
      }

      // 監聽鍵盤 ESC 取消
      function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          cleanup();
        }
      }

      // 清理選取器
      function cleanup() {
        window.removeEventListener("mousemove", onMouseMove, true);
        window.removeEventListener("click", onClick, true);
        window.removeEventListener("keydown", onKeyDown, true);
        highlightBox.remove();
        floatingPill?.remove();
        isPickerActive = false;
        cleanupPicker = null;
      }

      cleanupPicker = cleanup;
      window.addEventListener("mousemove", onMouseMove, true);
      window.addEventListener("click", onClick, true);
      window.addEventListener("keydown", onKeyDown, true);
    }

    // 初始化儲存與濾波器
    async function init() {
      const store = await Store.initStorage();
      equalizer = new Equalizer();

      const mainPreset =
        store.customMap[store.mainOption] ||
        store.alwaysExist[store.mainOption] ||
        store.alwaysExist["default"];

      if (mainPreset?.filters) {
        equalizer.setFilters(cloneFilters(mainPreset.filters));
      }

      // 嘗試初始連接
      await tryConnect();

      // 1. YouTube 等 SPA 換頁時重新掛載
      document.addEventListener("yt-navigate-finish", () => {
        setTimeout(() => tryConnect(false), 300);
      });

      // 2. 全域捕獲階段監聽媒體播放生命週期事件
      const mediaLifecycleEvents = ["play", "pause", "volumechange", "loadedmetadata", "loadstart", "ended"];
      mediaLifecycleEvents.forEach(evt => {
        document.addEventListener(
          evt,
          event => {
            if (event.target instanceof HTMLMediaElement) {
              if (evt === "play" && (!activeMedia || activeMedia.paused)) {
                attachToMedia(event.target);
              } else {
                broadcastStatus();
              }
            }
          },
          true
        );
      });

      // 3. 監聽 DOM 變動（動態載入的播放器標籤）
      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLMediaElement) {
              if (!activeMedia || activeMedia.paused) {
                attachToMedia(node);
              }
            } else if (node instanceof Element) {
              const media = node.querySelector("video, audio");
              if (media instanceof HTMLMediaElement) {
                if (!activeMedia || activeMedia.paused) {
                  attachToMedia(media);
                }
              }
            }
          }
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });

      // 4. 監聽來自 Popup 的指令
      browser.runtime.onMessage.addListener((msg: SendMsg) => {
        switch (msg.type) {
          case "open": {
            const mediaList = getDiscoveredMediaList();
            if (activeMedia !== null) {
              // 實際持有媒體的 Frame 立即響應（優先權最高）
              sendMessageToRuntime("initUI", {
                filters: equalizer ? equalizer.getCurrentFilters() : [],
                status: currentStatus,
                mediaIndex: discoveredMedia.length > 0 ? activeMediaIndex + 1 : 0,
                mediaTotal: discoveredMedia.length,
                bypass: equalizer ? equalizer.isBypassed : false,
                mediaList,
              });
            } else if (window === window.top) {
              // 若頂層 Frame 無媒體，延遲 150ms 響應，避免覆蓋子 iframe 已連線狀態
              setTimeout(() => {
                if (activeMedia === null) {
                  sendMessageToRuntime("initUI", {
                    filters: equalizer ? equalizer.getCurrentFilters() : [],
                    status: "no_media",
                    mediaIndex: 0,
                    mediaTotal: 0,
                    bypass: equalizer ? equalizer.isBypassed : false,
                    mediaList: [],
                  });
                }
              }, 150);
            }
            break;
          }

          case "connect": {
            const mediaList = scanMediaElements();
            if (mediaList.length > 0 || window === window.top) {
              const data = msg.data as MsgToFormat["connect"];
              tryConnect(Boolean(data?.cycle));
            }
            break;
          }

          case "autoSelectBest": {
            const mediaList = scanMediaElements();
            if (mediaList.length > 0 || window === window.top) {
              autoSelectBest();
            }
            break;
          }

          case "selectMedia": {
            const data = msg.data as MsgToFormat["selectMedia"];
            discoveredMedia = scanMediaElements();
            let targetIdx = -1;
            if (data.index !== undefined && data.index >= 0 && data.index < discoveredMedia.length) {
              targetIdx = data.index;
            } else if (data.id) {
              const parsedIdx = parseInt(data.id.replace("media-", ""), 10);
              if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < discoveredMedia.length) {
                targetIdx = parsedIdx;
              }
            }
            if (targetIdx !== -1) {
              const target = discoveredMedia[targetIdx];
              if (target) {
                attachToMedia(target, targetIdx);
              }
            }
            break;
          }

          case "startElementPicker": {
            startElementPicker();
            break;
          }

          case "toggleBypass": {
            if (equalizer && (activeMedia !== null || window === window.top)) {
              const data = msg.data as MsgToFormat["toggleBypass"];
              equalizer.setBypass(!data.enabled);
              broadcastStatus();
            }
            break;
          }

          case "ctrl": {
            if (equalizer && activeMedia !== null) {
              const gains = msg.data as MsgToFormat["ctrl"];
              equalizer.updateGains(gains);
            }
            break;
          }
        }
      });
    }

    init();
  },
});
