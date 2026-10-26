import { browser } from "wxt/browser";
import type { Filter, Filters, MsgToFormat, NotifyType } from "./types";

export function hzToTitle(hz: number): string {
  if (hz >= 1000) {
    return `${hz / 1000}K HZ`;
  }
  return `${hz} HZ`;
}

export async function getCurrentTab() {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  } catch (e) {
    return undefined;
  }
}

export async function sendMessageToCurrentTabs<T extends NotifyType>(type: T, data: MsgToFormat[T]) {
  try {
    const tab = await getCurrentTab();
    if (tab?.id !== undefined) {
      // 廣播給該分頁的所有 frames
      await browser.tabs.sendMessage(tab.id, { type, data });
    }
  } catch (e) {
    console.debug("[Equalizer] Failed to send message to current tab:", e);
  }
}

export async function sendMessageToRuntime<T extends NotifyType>(type: T, data: MsgToFormat[T]) {
  try {
    await browser.runtime.sendMessage({ type, data });
  } catch (e) {
    // Popup 可能未開啟，屬正常情況
    console.debug("[Equalizer] Runtime message not delivered (popup might be closed)");
  }
}

export function cloneFilters(filters: Filters): Filters {
  return filters.map(f => ({ ...f }));
}

/**
 * 檢查媒體元素是否可能受跨域 (CORS) 限制
 */
export function isMediaCorsRestricted(media: HTMLMediaElement): boolean {
  try {
    const src = media.currentSrc || media.src;
    if (!src || src.startsWith("blob:") || src.startsWith("data:")) {
      return false;
    }
    const mediaOrigin = new URL(src, window.location.href).origin;
    const pageOrigin = window.location.origin;

    // 若跨域且未設置 crossOrigin 屬性
    if (mediaOrigin !== pageOrigin && !media.crossOrigin) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
