import type { PresetMap } from "./types";

export const DEFAULT_VALUE = "default";

export const SYSTEM_PRESETS: PresetMap = {
  [DEFAULT_VALUE]: {
    i18nKey: "defaultEqualize",
    filters: [
      { hz: 60, gain: 0, q: 0.7, type: "peaking" },
      { hz: 230, gain: 0, q: 0.7, type: "peaking" },
      { hz: 910, gain: 0, q: 0.7, type: "peaking" },
      { hz: 4000, gain: 0, q: 0.7, type: "peaking" },
      { hz: 14000, gain: 0, q: 0.7, type: "peaking" },
    ],
  },
  "low-enhance": {
    i18nKey: "lowEnhance",
    filters: [
      { hz: 60, gain: 12, q: 0.7, type: "peaking" },
      { hz: 230, gain: 12, q: 0.7, type: "peaking" },
      { hz: 910, gain: 10, q: 0.7, type: "peaking" },
      { hz: 4000, gain: 8, q: 0.7, type: "peaking" },
      { hz: 14000, gain: 8, q: 0.7, type: "peaking" },
    ],
  },
  "high-enhance": {
    i18nKey: "highEnhance",
    filters: [
      { hz: 60, gain: 8, q: 0.7, type: "peaking" },
      { hz: 230, gain: 8, q: 0.7, type: "peaking" },
      { hz: 910, gain: 10, q: 0.7, type: "peaking" },
      { hz: 4000, gain: 12, q: 0.7, type: "peaking" },
      { hz: 14000, gain: 12, q: 0.7, type: "peaking" },
    ],
  },
  "volume-enhance": {
    i18nKey: "volumeEnhance",
    filters: [
      { hz: 60, gain: 6, q: 0.7, type: "peaking" },
      { hz: 230, gain: 12, q: 0.7, type: "peaking" },
      { hz: 910, gain: 12, q: 0.7, type: "peaking" },
      { hz: 4000, gain: 8, q: 0.7, type: "peaking" },
      { hz: 14000, gain: 6, q: 0.7, type: "peaking" },
    ],
  },
  "low-reduce": {
    i18nKey: "lowReduce",
    filters: [
      { hz: 60, gain: -8, q: 0.7, type: "peaking" },
      { hz: 230, gain: -6, q: 0.7, type: "peaking" },
      { hz: 910, gain: 0, q: 0.7, type: "peaking" },
      { hz: 4000, gain: 0, q: 0.7, type: "peaking" },
      { hz: 14000, gain: 0, q: 0.7, type: "peaking" },
    ],
  },
  "high-reduce": {
    i18nKey: "highReduce",
    filters: [
      { hz: 60, gain: 0, q: 0.7, type: "peaking" },
      { hz: 230, gain: 0, q: 0.7, type: "peaking" },
      { hz: 910, gain: 0, q: 0.7, type: "peaking" },
      { hz: 4000, gain: -6, q: 0.7, type: "peaking" },
      { hz: 14000, gain: -8, q: 0.7, type: "peaking" },
    ],
  },
};
