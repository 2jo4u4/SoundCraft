import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Chrome & Firefox Localization (i18n) Configuration", () => {
  const localesDir = path.resolve(__dirname, "../public/_locales");

  it("should have valid standard locale directories conforming to Chrome Web Store standards", () => {
    // Chrome Web Store requires zh_TW or zh_CN, and rejects generic 'zh'
    expect(fs.existsSync(path.join(localesDir, "en/messages.json"))).toBe(true);
    expect(fs.existsSync(path.join(localesDir, "zh_TW/messages.json"))).toBe(true);
    expect(fs.existsSync(path.join(localesDir, "zh_CN/messages.json"))).toBe(true);

    // Generic 'zh' directory must NOT exist in public/_locales
    expect(fs.existsSync(path.join(localesDir, "zh"))).toBe(false);
  });

  it("should have all required manifest keys (appName, appDesc) in all locales", () => {
    const requiredLocales = ["en", "zh_TW", "zh_CN"];

    for (const locale of requiredLocales) {
      const filePath = path.join(localesDir, locale, "messages.json");
      if (!fs.existsSync(filePath)) continue;

      const raw = fs.readFileSync(filePath, "utf-8");
      // Verify UTF-8 without BOM (BOM is \uFEFF)
      expect(raw.charCodeAt(0)).not.toBe(0xfeff);

      const parsed = JSON.parse(raw);
      expect(parsed.appName).toBeDefined();
      expect(typeof parsed.appName.message).toBe("string");
      expect(parsed.appName.message.length).toBeGreaterThan(0);

      expect(parsed.appDesc).toBeDefined();
      expect(typeof parsed.appDesc.message).toBe("string");
      expect(parsed.appDesc.message.length).toBeGreaterThan(0);
    }
  });

  it("should have 100% key parity across en, zh_TW, and zh_CN", () => {
    const enPath = path.join(localesDir, "en/messages.json");
    const zhTwPath = path.join(localesDir, "zh_TW/messages.json");
    const zhCnPath = path.join(localesDir, "zh_CN/messages.json");

    if (!fs.existsSync(zhTwPath) || !fs.existsSync(zhCnPath)) {
      // Force failure if target files don't exist yet
      expect(fs.existsSync(zhTwPath)).toBe(true);
      expect(fs.existsSync(zhCnPath)).toBe(true);
      return;
    }

    const enKeys = Object.keys(JSON.parse(fs.readFileSync(enPath, "utf-8"))).sort();
    const zhTwKeys = Object.keys(JSON.parse(fs.readFileSync(zhTwPath, "utf-8"))).sort();
    const zhCnKeys = Object.keys(JSON.parse(fs.readFileSync(zhCnPath, "utf-8"))).sort();

    expect(zhTwKeys).toEqual(enKeys);
    expect(zhCnKeys).toEqual(enKeys);
  });
});
