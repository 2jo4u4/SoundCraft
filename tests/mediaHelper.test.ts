import { describe, it, expect } from "vitest";
import { scoreMedia, extractMediaMetadata, buildDiscoveredMediaItem } from "../utils/mediaHelper";

describe("MediaHelper - Scoring & Extraction", () => {
  it("should score audible media higher than paused or muted media", () => {
    const audibleMedia = {
      tagName: "VIDEO",
      paused: false,
      muted: false,
      volume: 1,
      duration: 120,
      ended: false,
    } as any;

    const pausedMedia = {
      tagName: "VIDEO",
      paused: true,
      muted: false,
      volume: 1,
      duration: 120,
      ended: false,
    } as any;

    const mutedMedia = {
      tagName: "VIDEO",
      paused: false,
      muted: true,
      volume: 1,
      duration: 120,
      ended: false,
    } as any;

    const scoreAudible = scoreMedia(audibleMedia);
    const scorePaused = scoreMedia(pausedMedia);
    const scoreMuted = scoreMedia(mutedMedia);

    expect(scoreAudible).toBeGreaterThan(scorePaused);
    expect(scoreAudible).toBeGreaterThan(scoreMuted);
    expect(scoreMuted).toBeGreaterThan(scorePaused);
  });

  it("should give active media a stability boost", () => {
    const media = {
      tagName: "VIDEO",
      paused: false,
      muted: false,
      volume: 1,
      duration: 60,
      ended: false,
    } as any;

    const activeScore = scoreMedia(media, true);
    const inactiveScore = scoreMedia(media, false);

    expect(activeScore - inactiveScore).toBe(50);
  });

  it("should extract YouTube video metadata correctly", () => {
    const fakeDoc = {
      location: { hostname: "www.youtube.com" },
      querySelector: (selector: string) => {
        if (selector === "h1.ytd-watch-metadata yt-formatted-string") {
          return { textContent: "Never Gonna Give You Up" };
        }
        if (selector === "#channel-name #text") {
          return { textContent: "Rick Astley" };
        }
        return null;
      },
      title: "Rick Astley - Never Gonna Give You Up - YouTube",
    } as unknown as Document;

    const fakeMedia = {
      tagName: "VIDEO",
      getAttribute: () => null,
      closest: () => null,
    } as any;

    const meta = extractMediaMetadata(fakeMedia, fakeDoc);
    expect(meta.title).toBe("Never Gonna Give You Up");
    expect(meta.subtitle).toBe("Rick Astley");
    expect(meta.type).toBe("video");
  });

  it("should extract Bilibili metadata correctly", () => {
    const fakeDoc = {
      location: { hostname: "www.bilibili.com" },
      querySelector: (selector: string) => {
        if (selector === ".video-title") {
          return { textContent: "Anime Episode 1" };
        }
        if (selector === ".up-name") {
          return { textContent: "Official Channel" };
        }
        return null;
      },
      title: "Anime Episode 1_哔哩哔哩_bilibili",
    } as unknown as Document;

    const fakeMedia = {
      tagName: "VIDEO",
    } as any;

    const meta = extractMediaMetadata(fakeMedia, fakeDoc);
    expect(meta.title).toBe("Anime Episode 1");
    expect(meta.subtitle).toBe("Official Channel");
  });

  it("should extract Spotify Web metadata correctly", () => {
    const fakeDoc = {
      location: { hostname: "open.spotify.com" },
      querySelector: (selector: string) => {
        if (selector.includes("context-item-info-title")) {
          return { textContent: "Bohemian Rhapsody" };
        }
        if (selector.includes("context-item-info-artist")) {
          return { textContent: "Queen" };
        }
        return null;
      },
      title: "Spotify - Web Player",
    } as unknown as Document;

    const fakeAudio = {
      tagName: "AUDIO",
    } as any;

    const meta = extractMediaMetadata(fakeAudio, fakeDoc);
    expect(meta.title).toBe("Bohemian Rhapsody");
    expect(meta.subtitle).toBe("Queen");
    expect(meta.type).toBe("audio");
  });

  it("should build DiscoveredMediaItem properly", () => {
    const fakeVideo = {
      tagName: "VIDEO",
      paused: false,
      muted: false,
      volume: 0.8,
      ended: false,
      videoWidth: 1920,
      videoHeight: 1080,
      currentSrc: "https://example.com/videos/sample.mp4",
      crossOrigin: null,
      getAttribute: () => "My Sample Video",
      closest: () => null,
    } as any;

    const item = buildDiscoveredMediaItem(fakeVideo, 0, true, true);
    expect(item.id).toBe("media-0");
    expect(item.index).toBe(0);
    expect(item.type).toBe("video");
    expect(item.width).toBe(1920);
    expect(item.height).toBe(1080);
    expect(item.isPlaying).toBe(true);
    expect(item.isAudible).toBe(true);
    expect(item.isActive).toBe(true);
    expect(item.isRecommended).toBe(true);
  });
});
