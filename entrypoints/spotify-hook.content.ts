export default defineContentScript({
  matches: ["https://*/*", "http://*/*"],
  world: "MAIN",
  runAt: "document_start",
  allFrames: true,
  main() {
    function ensureAttached(media: HTMLMediaElement) {
      try {
        if (!media.isConnected && media.parentNode === null) {
          let container = document.getElementById("__equalizer_media_bridge__");
          if (!container) {
            container = document.createElement("div");
            container.id = "__equalizer_media_bridge__";
            // 保持不可見但處於排版樹中，切勿使用 display: none 以免觸發瀏覽器視訊解碼暫停/掛起機制
            container.style.cssText =
              "position:fixed!important;width:1px!important;height:1px!important;top:-9999px!important;left:-9999px!important;opacity:0.001!important;pointer-events:none!important;z-index:-99999!important;";
            const root = document.documentElement || document.body || document.head;
            if (root) {
              root.appendChild(container);
            } else {
              document.addEventListener(
                "DOMContentLoaded",
                () => {
                  (document.documentElement || document.body || document.head)?.appendChild(container!);
                },
                { once: true }
              );
            }
          }
          if (media.parentNode !== container) {
            container.appendChild(media);
            // 透過自訂事件跨世界通知 content script 即時繫結
            document.dispatchEvent(new CustomEvent("__equalizer_media_bridge_attached__"));
          }
        }
      } catch (e) {
        // 忽略跨域或節點掛載保護
      }
    }

    // 1. 攔截 HTMLMediaElement.prototype.play
    try {
      const origPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
        ensureAttached(this);
        return origPlay.call(this);
      };
    } catch (e) {
      // 忽略保護
    }

    // 2. 攔截 Document.prototype.createElement
    try {
      const origCreateElement = Document.prototype.createElement;
      Document.prototype.createElement = function (this: Document, tagName: string, options?: any) {
        const element = origCreateElement.call(this, tagName, options);
        if (
          typeof tagName === "string" &&
          (tagName.toLowerCase() === "video" || tagName.toLowerCase() === "audio")
        ) {
          element.addEventListener("play", () => ensureAttached(element as HTMLMediaElement), {
            capture: true,
          });
          element.addEventListener("playing", () => ensureAttached(element as HTMLMediaElement), {
            capture: true,
          });
        }
        return element;
      };
    } catch (e) {
      // 忽略保護
    }

    // 3. 攔截 window.Audio
    try {
      if (typeof window.Audio !== "undefined") {
        const OrigAudio = window.Audio;
        const PatchedAudio = function (this: any, ...args: any[]) {
          const audio = new OrigAudio(...args);
          audio.addEventListener("play", () => ensureAttached(audio), { capture: true });
          return audio;
        };
        PatchedAudio.prototype = OrigAudio.prototype;
        window.Audio = PatchedAudio as any;
      }
    } catch (e) {
      // 忽略保護
    }
  },
});
