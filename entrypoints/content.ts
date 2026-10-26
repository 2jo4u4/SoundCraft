import {
  Store,
  Equalizer,
  sendMessageToRuntime,
  isMediaCorsRestricted,
  cloneFilters,
} from "../utils";
import type { AudioConnectionStatus, SendMsg, MsgToFormat } from "../utils";

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

    // 廣播當前狀態至 Popup
    function broadcastStatus() {
      sendMessageToRuntime("statusUpdate", {
        status: currentStatus,
        mediaIndex: discoveredMedia.length > 0 ? activeMediaIndex + 1 : 0,
        mediaTotal: discoveredMedia.length,
        bypass: equalizer ? equalizer.isBypassed : false,
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

    // 嘗試自動發現並連接媒體
    async function tryConnect(cycle = false) {
      discoveredMedia = scanMediaElements();
      if (discoveredMedia.length === 0) {
        currentStatus = "no_media";
        activeMedia = null;
        activeMediaIndex = 0;
        broadcastStatus();
        return;
      }

      if (cycle && discoveredMedia.length > 1) {
        // 循環切換到下一個媒體（避免被 audibleIdx 強制拉回）
        activeMediaIndex = (activeMediaIndex + 1) % discoveredMedia.length;
      } else {
        // 1. 優先選取發聲播放中的媒體
        const audibleIdx = discoveredMedia.findIndex(
          el => !el.paused && !el.ended && !el.muted && el.volume > 0
        );
        if (audibleIdx !== -1) {
          activeMediaIndex = audibleIdx;
        } else {
          // 2. 其次選取播放中的媒體
          const playingIdx = discoveredMedia.findIndex(el => !el.paused && !el.ended);
          if (playingIdx !== -1) {
            activeMediaIndex = playingIdx;
          } else if (activeMediaIndex >= discoveredMedia.length) {
            activeMediaIndex = 0;
          }
        }
      }

      const target = discoveredMedia[activeMediaIndex] ?? discoveredMedia[0];
      if (target) {
        await attachToMedia(target, activeMediaIndex);
      }
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

      // 1. 全域捕獲階段監聽任何 play 事件
      document.addEventListener(
        "play",
        event => {
          if (event.target instanceof HTMLMediaElement) {
            attachToMedia(event.target);
          }
        },
        true
      );

      // 2. 監聽 DOM 變動（動態載入的播放器標籤）
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

      // 3. 監聽來自 Popup 的指令
      browser.runtime.onMessage.addListener((msg: SendMsg) => {
        switch (msg.type) {
          case "open": {
            if (activeMedia !== null) {
              // 實際持有媒體的 Frame 立即響應（優先權最高）
              sendMessageToRuntime("initUI", {
                filters: equalizer ? equalizer.getCurrentFilters() : [],
                status: currentStatus,
                mediaIndex: discoveredMedia.length > 0 ? activeMediaIndex + 1 : 0,
                mediaTotal: discoveredMedia.length,
                bypass: equalizer ? equalizer.isBypassed : false,
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
