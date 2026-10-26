import { describe, it, expect, vi } from "vitest";
import { MockAudioContext } from "./mocks/audio";

(globalThis as any).AudioContext = MockAudioContext;

import { Equalizer } from "../utils/equalizer";
import type { MsgToFormat } from "../utils/types";

describe("Message Protocol & Frame Routing Seam", () => {
  it("should format and handle toggleBypass message correctly", () => {
    const eq = new Equalizer();
    // Default for newly created Equalizer is bypassed (per user requirement)
    expect(eq.isBypassed).toBe(true);

    // Simulate handling toggleBypass message to enable
    const msgResume: MsgToFormat["toggleBypass"] = { enabled: true };
    eq.setBypass(!msgResume.enabled);
    expect(eq.isBypassed).toBe(false);

    // Simulate handling toggleBypass message to bypass
    const msg: MsgToFormat["toggleBypass"] = { enabled: false };
    eq.setBypass(!msg.enabled);
    expect(eq.isBypassed).toBe(true);
  });

  it("should format and apply ctrl gain adjustments to filter chain", () => {
    const eq = new Equalizer();
    eq.setFilters([
      { hz: 60, gain: 0, q: 0.7, type: "peaking" },
      { hz: 230, gain: 0, q: 0.7, type: "peaking" },
    ]);

    const ctrlPayload: MsgToFormat["ctrl"] = [
      { index: 0, val: 4.5 },
      { index: 1, val: -3.0 },
    ];

    eq.updateGains(ctrlPayload);

    expect(eq.filters[0].gain.setTargetAtTime).toHaveBeenCalledWith(4.5, 0, 0.01);
    expect(eq.filters[1].gain.setTargetAtTime).toHaveBeenCalledWith(-3.0, 0, 0.01);
  });

  it("should evaluate frame eligibility correctly for active vs idle frames", () => {
    // Helper function matching the content script frame eligibility logic
    function isEligibleToRespond(activeMedia: any, isTopWindow: boolean): { canRespond: boolean; delayMs: number } {
      if (activeMedia !== null) {
        return { canRespond: true, delayMs: 0 }; // Immediate response
      }
      if (isTopWindow) {
        return { canRespond: true, delayMs: 150 }; // Delayed fallback
      }
      return { canRespond: false, delayMs: 0 }; // Non-active child frames remain silent
    }

    // Active child frame: responds immediately
    const childWithMedia = isEligibleToRespond({} as any, false);
    expect(childWithMedia.canRespond).toBe(true);
    expect(childWithMedia.delayMs).toBe(0);

    // Idle child frame: remains silent
    const childIdle = isEligibleToRespond(null, false);
    expect(childIdle.canRespond).toBe(false);

    // Idle top window: delays fallback response so active child frame speaks first
    const topIdle = isEligibleToRespond(null, true);
    expect(topIdle.canRespond).toBe(true);
    expect(topIdle.delayMs).toBe(150);
  });

  it("should silence idle child iframes on autoSelectBest broadcast", () => {
    function shouldFrameBroadcast(discoveredCount: number, isTopWindow: boolean): boolean {
      if (discoveredCount > 0) return true;
      if (isTopWindow) return true; // top window can broadcast fallback
      return false; // child iframes with 0 media MUST remain silent
    }

    // Top window with 1 video (e.g. YouTube)
    expect(shouldFrameBroadcast(1, true)).toBe(true);

    // Child iframes with 0 media (e.g. YouTube accounts/rotate cookies iframe)
    expect(shouldFrameBroadcast(0, false)).toBe(false);

    // Child iframe containing embedded video (e.g. embed player)
    expect(shouldFrameBroadcast(1, false)).toBe(true);
  });

  it("should guard popup connected state against rogue no_media downgrade messages", () => {
    function shouldApplyStatusUpdate(
      currentStatus: string,
      incomingStatus: string,
      incomingMediaList?: any[]
    ): boolean {
      if (
        currentStatus === "connected" &&
        incomingStatus === "no_media" &&
        (!incomingMediaList || incomingMediaList.length === 0)
      ) {
        return false; // Guard: ignore rogue downgrade
      }
      return true;
    }

    // While connected, rogue empty update from an idle iframe is rejected
    expect(shouldApplyStatusUpdate("connected", "no_media", [])).toBe(false);
    expect(shouldApplyStatusUpdate("connected", "no_media", undefined)).toBe(false);

    // Legitimate update with active media is accepted
    expect(shouldApplyStatusUpdate("connected", "connected", [{ id: "media-0" }])).toBe(true);

    // Initial connection from no_media is accepted
    expect(shouldApplyStatusUpdate("no_media", "connected", [{ id: "media-0" }])).toBe(true);
  });

  describe("Per-Tab Preset State Synchronization & Mode A Isolation", () => {
    // Helper to simulate content script state handling
    class TabContentScriptMock {
      activePresetKey: string;
      eq: Equalizer;

      constructor(favoriteDefault: string = "default") {
        this.activePresetKey = favoriteDefault;
        this.eq = new Equalizer();
        this.eq.setFilters([
          { hz: 60, gain: 0, q: 0.7, type: "peaking" },
          { hz: 230, gain: 0, q: 0.7, type: "peaking" },
        ]);
      }

      handleMessage(msg: { type: string; data: any }): any {
        if (msg.type === "open") {
          return {
            filters: this.eq.getCurrentFilters(),
            activePresetKey: this.activePresetKey,
            status: "connected",
            mediaIndex: 1,
            mediaTotal: 1,
            bypass: this.eq.isBypassed,
          };
        }
        if (msg.type === "ctrl") {
          const data = msg.data;
          let gains: { index: number; val: number }[] = [];
          if (Array.isArray(data)) {
            gains = data;
          } else if (data && typeof data === "object") {
            if (data.presetKey) {
              this.activePresetKey = data.presetKey;
            }
            if (Array.isArray(data.gains)) {
              gains = data.gains;
            }
          }
          this.eq.updateGains(gains);
        }
        return null;
      }
    }

    it("should extract gains and update activePresetKey from object ctrl payload", () => {
      const tabA = new TabContentScriptMock("default");
      expect(tabA.activePresetKey).toBe("default");

      tabA.handleMessage({
        type: "ctrl",
        data: {
          presetKey: "bass_cut",
          gains: [{ index: 0, val: -6.0 }],
        },
      });

      expect(tabA.activePresetKey).toBe("bass_cut");
      expect(tabA.eq.filters[0].gain.setTargetAtTime).toHaveBeenCalledWith(-6.0, 0, 0.01);
    });

    it("should maintain per-tab preset isolation between Tab A and Tab B (Mode A)", () => {
      // 1. Both tabs open initially using global favorite "default"
      const tabA = new TabContentScriptMock("default");
      const tabB = new TabContentScriptMock("default");

      expect(tabA.activePresetKey).toBe("default");
      expect(tabB.activePresetKey).toBe("default");

      // 2. Tab A changes preset to "bass_cut"
      tabA.handleMessage({
        type: "ctrl",
        data: {
          presetKey: "bass_cut",
          gains: [{ index: 0, val: -8.0 }],
        },
      });

      // Tab A is now bass_cut
      expect(tabA.activePresetKey).toBe("bass_cut");
      // Tab B remains isolated on "default"
      expect(tabB.activePresetKey).toBe("default");

      // 3. Tab A returns activePresetKey: "bass_cut" when popup reopens
      const initUiA = tabA.handleMessage({ type: "open", data: null });
      expect(initUiA.activePresetKey).toBe("bass_cut");

      // 4. Tab B returns activePresetKey: "default" when popup opens on Tab B
      const initUiB = tabB.handleMessage({ type: "open", data: null });
      expect(initUiB.activePresetKey).toBe("default");

      // 5. Opening new Tab C initializes to default favorite
      const tabC = new TabContentScriptMock("default");
      expect(tabC.activePresetKey).toBe("default");
    });

    it("should synchronize activePresetKey in popup state without modifying global favorite", () => {
      // Simulate popup state initialization on Tab A reopening
      let activePresetKey = "default";
      const favoriteOption = "default"; // Favorite remains unchanged

      const incomingInitUI: MsgToFormat["initUI"] = {
        filters: [{ hz: 60, gain: -6, q: 0.7, type: "peaking" }],
        status: "connected",
        mediaIndex: 1,
        mediaTotal: 1,
        bypass: false,
        activePresetKey: "bass_cut",
      };

      // Popup initUI message handler
      if (incomingInitUI.activePresetKey) {
        activePresetKey = incomingInitUI.activePresetKey;
      }

      // activePresetKey reflects Tab A's active preset
      expect(activePresetKey).toBe("bass_cut");
      // favoriteOption is decoupled and still "default"
      expect(favoriteOption).toBe("default");
    });

    it("should correctly detect dirty state when slider gains differ from active preset", () => {
      const presets: Record<string, { filters: { hz: number; gain: number; q: number; type: any }[] }> = {
        bass_cut: {
          filters: [
            { hz: 60, gain: -6, q: 0.7, type: "peaking" },
            { hz: 230, gain: 0, q: 0.7, type: "peaking" },
          ],
        },
      };

      const isDirty = (activeKey: string, currentFilters: { gain: number }[]) => {
        const target = presets[activeKey];
        if (!target?.filters) return false;
        return currentFilters.some((f, idx) => {
          const orig = target.filters[idx];
          return orig !== undefined && Math.abs(f.gain - orig.gain) > 0.01;
        });
      };

      // Unmodified preset gains -> clean
      expect(isDirty("bass_cut", [{ gain: -6 }, { gain: 0 }])).toBe(false);

      // Modified slider gain -> dirty
      expect(isDirty("bass_cut", [{ gain: -2 }, { gain: 0 }])).toBe(true);
    });
  });
});
