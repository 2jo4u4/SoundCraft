# Changelog

All notable changes to the **SoundCraft EQ** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-10-29

### Added
- **Per-Tab Active Preset State Synchronization (Mode A / Per-Tab Isolation)**:
  - Each browser tab now independently preserves its active equalizer preset and fine-tuned gains in memory.
  - Reopening the popup on Tab A accurately restores its active preset (e.g., "Bass Cut").
  - Decoupled the active preset from the global Favorite preset; selecting presets in the dropdown no longer mutates the global default.
  - Newly opened tabs automatically initialize using the designated Favorite preset.
- **Chrome Web Store Localization Compliance (`zh_TW` & `zh_CN`)**:
  - Restructured `_locales/zh/` into standard `_locales/zh_TW/` (Traditional Chinese) and `_locales/zh_CN/` (Simplified Chinese).
  - Ensured UTF-8 encoding without BOM, 100% key parity across `en`, `zh_TW`, and `zh_CN`.
  - Added full multi-language store listings and permission justifications in `STORE_LISTING.md`.
- **Automated Localization Tests (`tests/locales.test.ts`)**:
  - Validates standard directory structure, manifest keys (`appName`, `appDesc`), BOM absence, and key parity.

### Changed
- **Popup UI & Messaging Contract**:
  - `initUI` protocol extended with `activePresetKey?: string`.
  - `ctrl` message payload supports `{ gains, presetKey }` object to synchronize preset selection with content scripts.
  - Fine-tuning sliders on a preset marks the state as dirty, enabling "Save As" and "Revert" without losing the preset reference.

### Fixed
- Fixed bug where closing and reopening the popup on a tab would reset the dropdown to "Standard Flat" despite custom equalization remaining active.
- Fixed Chrome Web Store upload parser skipping the Chinese locale due to generic `zh` folder name.

---

## [1.0.0] - 2026-10-26

### Added
- **5-Band Web Audio Equalizer DSP Engine**:
  - 5 peaking BiquadFilter bands: 60Hz, 230Hz, 910Hz, 4kHz, and 14kHz (-12dB to +12dB range).
  - Integrated transparent peak limiter (`DynamicsCompressorNode`, -0.5dB threshold, 20:1 ratio, 3ms attack) preventing digital clipping and distortion.
  - Hardware-grade True Bypass (0ms latency, zero CPU overhead when off).
- **Intelligent Media Stream Discovery & Element Picker**:
  - Traverses standard DOM, Open Shadow DOM, and detached elements.
  - Visual in-page element picker overlay with target highlighting and floating badge.
  - Prototype hook and MAIN world script (`spotify-hook.content.ts`) capturing detached Spotify Web playback elements.
  - Audible media priority scoring (+800 bonus to audible audio over muted canvas loops).
- **Multi-Frame Silence Guard Protocol**:
  - Prevents non-media child iframes from downgrading connected status.
  - Popup state lock guarding against race conditions in multi-frame pages (e.g. YouTube).
- **Per-Domain Settings Persistence**:
  - Remembers enable/disable preferences per normalized hostname.
  - Default Bypassed on newly visited domains for security.
- **Dual-Ecosystem Support**:
  - Compatible with Google Chrome (MV3) and Mozilla Firefox (MV3, AMO compliant).
  - 28 unit and integration tests powered by Vitest.
