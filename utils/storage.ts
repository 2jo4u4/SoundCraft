import { browser } from "wxt/browser";
import type { StoreDataType, PresetMap } from "./types";
import { SYSTEM_PRESETS, DEFAULT_VALUE } from "./filterData";
import { VERSION } from "./version";
import { getDomain } from "./tool";

export class Store {
  static async getAll(): Promise<Required<StoreDataType>> {
    const raw = (await browser.storage.local.get(null)) as Record<string, any>;

    // 處理舊版 Map 或 Array 相容
    const customMap: PresetMap = {};
    if (raw.customMap) {
      if (raw.customMap instanceof Map) {
        raw.customMap.forEach((v: any, k: string) => {
          customMap[k] = v;
        });
      } else if (typeof raw.customMap === "object") {
        Object.assign(customMap, raw.customMap);
      }
    }

    const alwaysExist: PresetMap = { ...SYSTEM_PRESETS };

    // 舊版 key 相容遷移: height-enhance -> high-enhance, height-reduce -> high-reduce
    let mainOption: string = raw.mainOption || DEFAULT_VALUE;
    if (mainOption === "height-enhance") mainOption = "high-enhance";
    if (mainOption === "height-reduce") mainOption = "high-reduce";

    return {
      checkDataStatus: raw.checkDataStatus || { version: VERSION },
      mainOption,
      alwaysExist,
      customMap,
      domainEnabledMap: raw.domainEnabledMap || {},
    };
  }

  static async get<T extends keyof StoreDataType>(type: T): Promise<StoreDataType[T]> {
    const res = await browser.storage.local.get(type);
    return res[type] as StoreDataType[T];
  }

  static async set<T extends keyof StoreDataType>(type: T, data: StoreDataType[T]): Promise<void> {
    await browser.storage.local.set({ [type]: data });
  }

  static async initStorage(): Promise<Required<StoreDataType>> {
    const current = await Store.getAll();
    const storedStatus = await Store.get("checkDataStatus");

    if (!storedStatus || storedStatus.version !== VERSION) {
      // 版更遷移：更新系統預設與版本號，但完整保留使用者的 customMap 與 mainOption
      await Promise.all([
        Store.set("checkDataStatus", { version: VERSION }),
        Store.set("alwaysExist", SYSTEM_PRESETS),
        Store.set("mainOption", current.mainOption),
        Store.set("customMap", current.customMap),
      ]);
    }

    return Store.getAll();
  }

  static async saveCustomPreset(name: string, preset: FilterPreset): Promise<PresetMap> {
    const current = await Store.getAll();
    const updatedCustom: PresetMap = {
      ...current.customMap,
      [name]: { ...preset, name },
    };
    await Store.set("customMap", updatedCustom);
    return { ...current.alwaysExist, ...updatedCustom };
  }

  static async deleteCustomPreset(name: string): Promise<{ merged: PresetMap; newMainOption: string }> {
    const current = await Store.getAll();
    const updatedCustom = { ...current.customMap };
    delete updatedCustom[name];

    let newMainOption = current.mainOption;
    if (newMainOption === name) {
      newMainOption = DEFAULT_VALUE;
      await Store.set("mainOption", DEFAULT_VALUE);
    }

    await Store.set("customMap", updatedCustom);
    const merged = { ...current.alwaysExist, ...updatedCustom };
    return { merged, newMainOption };
  }

  static async setFavorite(name: string): Promise<void> {
    await Store.set("mainOption", name);
  }

  /**
   * 查詢指定網域是否已啟用等化器（首次造訪之網域預設為 false 即 Bypassed）
   */
  static async isDomainEnabled(domain: string): Promise<boolean> {
    const normDomain = getDomain(domain);
    const raw = (await browser.storage.local.get("domainEnabledMap")) as {
      domainEnabledMap?: Record<string, boolean>;
    };
    const map = raw?.domainEnabledMap || {};
    return Boolean(map[normDomain]);
  }

  /**
   * 儲存特定網域的啟用/旁路狀態
   */
  static async setDomainEnabled(domain: string, enabled: boolean): Promise<void> {
    const normDomain = getDomain(domain);
    const raw = (await browser.storage.local.get("domainEnabledMap")) as {
      domainEnabledMap?: Record<string, boolean>;
    };
    const map = { ...(raw?.domainEnabledMap || {}) };
    map[normDomain] = enabled;
    await browser.storage.local.set({ domainEnabledMap: map });
  }

  /**
   * 取得所有網域的狀態紀錄表
   */
  static async getDomainEnabledMap(): Promise<Record<string, boolean>> {
    const raw = (await browser.storage.local.get("domainEnabledMap")) as {
      domainEnabledMap?: Record<string, boolean>;
    };
    return raw?.domainEnabledMap || {};
  }

  static clearAll() {
    return browser.storage.local.clear();
  }
}
