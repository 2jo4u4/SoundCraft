import { describe, it, expect, beforeEach, vi } from "vitest";
import { MockAudioContext } from "./mocks/audio";

// Setup global AudioContext
(globalThis as any).AudioContext = MockAudioContext;

import { Equalizer } from "../utils/equalizer";

describe("Equalizer Audio Engine Seam", () => {
  let eq: Equalizer;

  beforeEach(() => {
    eq = new Equalizer();
  });

  it("should initialize with limiter and transparent compressor settings", () => {
    expect(eq.compressor.threshold.setValueAtTime).toHaveBeenCalledWith(-0.5, 0);
    expect(eq.compressor.ratio.setValueAtTime).toHaveBeenCalledWith(20, 0);
  });

  it("should clamp gain adjustments between -12 and +12 dB", () => {
    eq.setFilters([{ hz: 60, gain: 0, q: 0.7, type: "peaking" }]);

    eq.updateGains([{ index: 0, val: 25 }]); // Exceeds +12
    expect(eq.filters[0].gain.setTargetAtTime).toHaveBeenCalledWith(12, 0, 0.01);

    eq.updateGains([{ index: 0, val: -30 }]); // Below -12
    expect(eq.filters[0].gain.setTargetAtTime).toHaveBeenCalledWith(-12, 0, 0.01);
  });

  it("should support true bypass switching", async () => {
    const mockMedia = {} as HTMLMediaElement;
    eq.setFilters([{ hz: 60, gain: 0, q: 0.7, type: "peaking" }]);
    await eq.stream(mockMedia);

    // Initial state: connected to filter
    expect(eq.currentSource?.connect).toHaveBeenCalledWith(eq.filters[0]);

    // Enable bypass
    eq.setBypass(true);
    expect(eq.isBypassed).toBe(true);
    expect(eq.currentSource?.disconnect).toHaveBeenCalled();
    expect(eq.currentSource?.connect).toHaveBeenCalledWith(eq.compressor);

    // Disable bypass (re-engage EQ)
    eq.setBypass(false);
    expect(eq.isBypassed).toBe(false);
    expect(eq.currentSource?.connect).toHaveBeenCalledWith(eq.filters[0]);
  });

  it("should deduplicate createMediaElementSource calls using WeakMap", async () => {
    const mockMedia = {} as HTMLMediaElement;
    const ctx = eq.audioCtx as any;

    await eq.stream(mockMedia);
    await eq.stream(mockMedia);

    expect(ctx.createMediaElementSource).toHaveBeenCalledTimes(1);
  });
});
