import type { DiscoveredMediaItem } from "./types";
import { isMediaCorsRestricted } from "./tool";

function isVideoElement(media: any): media is HTMLVideoElement {
  if (typeof HTMLVideoElement !== "undefined" && media instanceof HTMLVideoElement) {
    return true;
  }
  return media?.tagName === "VIDEO" || media?.nodeName === "VIDEO";
}

/**
 * 依據播放狀態、發聲狀況、可見尺寸等因素為媒體評分，提供推薦選擇
 */
export function scoreMedia(media: HTMLMediaElement, isCurrentlyActive = false): number {
  let score = 0;

  // 1. 發聲中優先權最高 (+1000)
  if (!media.paused && !media.muted && media.volume > 0) {
    score += 1000;
  }

  // 2. 播放中但靜音或音量 0 (+500)
  if (!media.paused && !media.ended) {
    score += 500;
  }

  // 3. 視訊有實際寬高像素 (+200)
  if (isVideoElement(media) && (media.videoWidth > 0 || (media as any).width > 0)) {
    score += 200;
  }

  // 4. 有合法時間長度且未播放完畢 (+100)
  if (media.duration > 0 && !media.ended) {
    score += 100;
  }

  // 5. 穩定性加分：若是當前正在連線的媒體，避免在多媒體間不斷震盪 (+50)
  if (isCurrentlyActive) {
    score += 50;
  }

  return score;
}

/**
 * 針對常見主流影音平台 (YouTube, Bilibili, Spotify, Twitch) 與標準網頁擷取歌曲/影片標題與作者
 */
export function extractMediaMetadata(
  media: HTMLMediaElement,
  doc: Document = typeof document !== "undefined" ? document : ({} as Document)
): { title: string; subtitle?: string; type: "video" | "audio" } {
  const type: "video" | "audio" = isVideoElement(media) ? "video" : "audio";
  const hostname = doc.location?.hostname || "";

  // 1. YouTube 深度優化
  if (hostname.includes("youtube.com")) {
    const ytTitle =
      doc.querySelector("h1.ytd-watch-metadata yt-formatted-string")?.textContent?.trim() ||
      doc.querySelector("h1.title")?.textContent?.trim() ||
      (doc.title ? doc.title.replace(/ - YouTube$/, "").trim() : "");
    const ytChannel =
      doc.querySelector("#channel-name #text")?.textContent?.trim() ||
      doc.querySelector("#owner-sub-count")?.textContent?.trim() ||
      "YouTube";

    return {
      title: ytTitle || (type === "video" ? "YouTube 影片" : "YouTube 音訊"),
      subtitle: ytChannel,
      type,
    };
  }

  // 2. Bilibili 深度優化
  if (hostname.includes("bilibili.com")) {
    const biliTitle =
      doc.querySelector(".video-title")?.textContent?.trim() ||
      (doc.title ? doc.title.replace(/_哔哩哔哩_bilibili$/, "").trim() : "");
    const biliAuthor =
      doc.querySelector(".up-name")?.textContent?.trim() ||
      doc.querySelector(".username")?.textContent?.trim() ||
      "Bilibili";

    return {
      title: biliTitle || (type === "video" ? "Bilibili 影片" : "Bilibili 音訊"),
      subtitle: biliAuthor,
      type,
    };
  }

  // 3. Spotify Web 深度優化 (相容 v1 與 v2 播放器)
  if (hostname.includes("spotify.com")) {
    let trackTitle = "";
    let trackArtist = "";

    // 優先從 v2 播放器小工具或 aria-label 擷取
    const widgetV2 = doc.querySelector?.('[data-testid="now-playing-widget-v2"]');
    if (widgetV2) {
      const ariaLabel = widgetV2.getAttribute("aria-label"); // "Now playing: <Title> by <Artist>"
      if (ariaLabel && ariaLabel.startsWith("Now playing:")) {
        const cleaned = ariaLabel.replace(/^Now playing:\s*/, "");
        const parts = cleaned.split(" by ");
        if (parts.length >= 2) {
          trackTitle = parts[0]?.trim() || "";
          trackArtist = parts.slice(1).join(" by ").trim();
        } else {
          trackTitle = cleaned.trim();
        }
      }

      if (!trackArtist) {
        trackArtist = doc.querySelector?.('[data-testid="now-playing-widget-v2-byline"]')?.textContent?.trim() || "";
      }
    }

    if (!trackTitle) {
      trackTitle =
        doc.querySelector?.('[data-testid="now-playing-widget-v2"] a[href*="/album/"] span')?.textContent?.trim() ||
        doc.querySelector?.('[data-testid="now-playing-widget-v2"] a[href*="/track/"] span')?.textContent?.trim() ||
        doc.querySelector?.('[data-testid="now-playing-widget"] [data-testid="context-item-info-title"]')?.textContent?.trim() ||
        doc.querySelector?.('[data-testid="context-item-info-title"]')?.textContent?.trim() ||
        "Spotify 歌曲";
    }

    if (!trackArtist) {
      trackArtist =
        doc.querySelector?.('[data-testid="now-playing-widget"] [data-testid="context-item-info-artist"]')?.textContent?.trim() ||
        doc.querySelector?.('[data-testid="context-item-info-subtitles"]')?.textContent?.trim() ||
        "Spotify";
    }

    return {
      title: trackTitle,
      subtitle: trackArtist,
      type: "audio", // 儘管 Spotify 底層使用 detached video 載體，對使用者呈現為音訊
    };
  }

  // 4. Twitch 深度優化
  if (hostname.includes("twitch.tv")) {
    const streamTitle =
      doc.querySelector('[data-a-target="stream-title"]')?.textContent?.trim() ||
      (doc.title ? doc.title.replace(/ - Twitch$/, "").trim() : "");
    const streamer =
      doc.querySelector('[data-a-target="user-channel-name"]')?.textContent?.trim() ||
      "Twitch";

    return {
      title: streamTitle || "Twitch 直播",
      subtitle: streamer,
      type,
    };
  }

  // 5. 通用媒體標題擷取
  let genericTitle =
    media.getAttribute?.("aria-label")?.trim() ||
    media.getAttribute?.("title")?.trim() ||
    media.closest?.("[aria-label]")?.getAttribute("aria-label")?.trim();

  if (!genericTitle) {
    if (isVideoElement(media) && (media.videoWidth > 0 || (media as any).width > 0)) {
      genericTitle = `${media.videoWidth || (media as any).width}p 視訊 (Video)`;
    } else {
      genericTitle = type === "video" ? "網頁視訊 (Video)" : "網頁音訊 (Audio)";
    }
  }

  let subtitle: string | undefined;
  try {
    const src = media.currentSrc || media.src;
    if (src && !src.startsWith("blob:") && !src.startsWith("data:")) {
      const url = new URL(src, doc.location?.href || "http://localhost");
      const filename = url.pathname.split("/").filter(Boolean).pop();
      if (filename && filename.length < 30) {
        subtitle = filename;
      }
    }
  } catch {
    // 忽略 URL 解析錯誤
  }

  return {
    title: genericTitle,
    subtitle,
    type,
  };
}

/**
 * 組合 DiscoveredMediaItem 物件
 */
export function buildDiscoveredMediaItem(
  media: HTMLMediaElement,
  index: number,
  isCurrentlyActive: boolean,
  isRecommended: boolean,
  doc: Document = typeof document !== "undefined" ? document : ({} as Document)
): DiscoveredMediaItem {
  const metadata = extractMediaMetadata(media, doc);
  const isVideo = isVideoElement(media);
  const width = isVideo ? (media.videoWidth || (media as any).width || 0) : 0;
  const height = isVideo ? (media.videoHeight || (media as any).height || 0) : 0;

  const isPlaying = !media.paused && !media.ended;
  const isMuted = media.muted || media.volume === 0;
  const isAudible = isPlaying && !isMuted;
  const corsRestricted = isMediaCorsRestricted(media);

  return {
    id: `media-${index}`,
    index,
    type: metadata.type,
    title: metadata.title,
    subtitle: metadata.subtitle,
    width,
    height,
    isPlaying,
    isAudible,
    isMuted,
    isCorsRestricted: corsRestricted,
    isRecommended,
    isActive: isCurrentlyActive,
  };
}
