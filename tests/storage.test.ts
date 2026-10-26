import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock browser.storage.local
const mockStorageState: Record<string, any> = {};

vi.mock("wxt/browser", () => ({
  browser: {
    storage: {
      local: {
        get: vi.fn(async (key: any) => {
          if (key === null || key === undefined) {
            return { ...mockStorageState };
          }
          if (typeof key === "string") {
            return { [key]: mockStorageState[key] };
          }
          return {};
        }),
        set: vi.fn(async (obj: Record<string, any>) => {
          Object.assign(mockStorageState, obj);
        }),
        clear: vi.fn(async () => {
          for (const k of Object.keys(mockStorageState)) {
            delete mockStorageState[k];
          }
        }),
      },
    },
  },
}));

import { Store } from "../utils/storage";
import { VERSION } from "../utils/version";

describe("Storage & Migration Seam", () => {
  beforeEach(async () => {
    await Store.clearAll();
  });

  it("should initialize default storage schema if empty", async () => {
    const data = await Store.initStorage();
    expect(data.checkDataStatus.version).toBe(VERSION);
    expect(data.mainOption).toBe("default");
    expect(data.alwaysExist).toBeDefined();
    expect(data.customMap).toEqual({});
  });

  it("should preserve customMap during version bump migration", async () => {
    // Simulate user having custom presets from old version
    await Store.set("checkDataStatus" as any, { version: "0.9.0" });
    await Store.set("customMap" as any, {
      "my-rock": {
        name: "my-rock",
        filters: [{ hz: 60, gain: 5, q: 0.7, type: "peaking" }],
      },
    });

    // Run initStorage (triggers migration)
    const migrated = await Store.initStorage();

    // Verify custom preset was NOT deleted
    expect(migrated.checkDataStatus.version).toBe(VERSION);
    expect(migrated.customMap["my-rock"]).toBeDefined();
    expect(migrated.customMap["my-rock"].filters[0].gain).toBe(5);
  });

  it("should migrate legacy height-enhance key to high-enhance", async () => {
    await Store.set("mainOption" as any, "height-enhance");
    const data = await Store.getAll();
    expect(data.mainOption).toBe("high-enhance");
  });

  it("should save custom preset and serialize as plain object", async () => {
    const merged = await Store.saveCustomPreset("jazz", {
      filters: [{ hz: 60, gain: 3, q: 0.7, type: "peaking" }],
    });
    expect(merged["jazz"]).toBeDefined();
    expect(merged["jazz"].filters[0]?.gain).toBe(3);

    const stored = await Store.get("customMap");
    expect(stored instanceof Map).toBe(false);
    expect(typeof stored).toBe("object");
  });

  it("should reset mainOption to default when active favorite custom preset is deleted", async () => {
    await Store.saveCustomPreset("dance", {
      filters: [{ hz: 60, gain: 6, q: 0.7, type: "peaking" }],
    });
    await Store.setFavorite("dance");

    const before = await Store.getAll();
    expect(before.mainOption).toBe("dance");

    const { newMainOption } = await Store.deleteCustomPreset("dance");
    expect(newMainOption).toBe("default");

    const after = await Store.getAll();
    expect(after.mainOption).toBe("default");
    expect(after.customMap["dance"]).toBeUndefined();
  });
});
