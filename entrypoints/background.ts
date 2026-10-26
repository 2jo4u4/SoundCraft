import { Store } from "../utils/storage";

export default defineBackground(() => {
  console.log("[Equalizer] Background service worker initialized");

  browser.runtime.onInstalled.addListener(async details => {
    console.log("[Equalizer] Extension installed or updated:", details.reason);
    await Store.initStorage();
  });
});
