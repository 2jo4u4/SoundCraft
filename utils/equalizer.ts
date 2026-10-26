import type { Filter, Filters } from "./types";

export class Equalizer {
  audioCtx: AudioContext;
  filters: BiquadFilterNode[];
  compressor: DynamicsCompressorNode;
  mediaSourceMap: WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>;
  currentMedia: HTMLMediaElement | null = null;
  currentSource: MediaElementAudioSourceNode | null = null;
  isStream: boolean = false;
  isBypassed: boolean = false;

  constructor() {
    const AudioContextClass =
      typeof window !== "undefined"
        ? window.AudioContext || (window as any).webkitAudioContext
        : AudioContext;
    this.audioCtx = new AudioContextClass();
    this.filters = [];
    this.mediaSourceMap = new WeakMap();

    // 建立透明防破音動態壓縮器 (Transparent Peak Limiter)
    this.compressor = this.audioCtx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-0.5, this.audioCtx.currentTime); // 接近 0dB 時開始限制
    this.compressor.knee.setValueAtTime(4, this.audioCtx.currentTime);
    this.compressor.ratio.setValueAtTime(20, this.audioCtx.currentTime); // 強限制比
    this.compressor.attack.setValueAtTime(0.003, this.audioCtx.currentTime);
    this.compressor.release.setValueAtTime(0.05, this.audioCtx.currentTime);

    this.compressor.connect(this.audioCtx.destination);
  }

  /**
   * 確保 AudioContext 處於 running 狀態（避免被瀏覽器 autoplay policy 暫停）
   */
  async ensureAudioContextRunning() {
    if (this.audioCtx.state === "suspended") {
      try {
        await this.audioCtx.resume();
      } catch (e) {
        console.warn("[Equalizer] Failed to resume AudioContext:", e);
      }
    }
  }

  /**
   * 初始化或更新濾波器陣列
   */
  setFilters(filterConfigs: Filters) {
    // 若已有濾波器鏈，先中斷連接
    this.disconnectChain();

    this.filters = filterConfigs.map(config => {
      const node = this.audioCtx.createBiquadFilter();
      node.type = config.type;
      node.frequency.value = config.hz;
      node.Q.value = config.q;
      node.gain.value = config.gain;
      return node;
    });

    // 串接濾波器
    this.connectChain();
  }

  /**
   * 僅更新各頻段增益 (Gain)
   */
  updateGains(gains: { index: number; val: number }[]) {
    gains.forEach(({ index, val }) => {
      const filter = this.filters[index];
      if (filter) {
        // 平滑漸變避免爆音
        const clampedVal = Math.max(-12, Math.min(12, val));
        filter.gain.setTargetAtTime(clampedVal, this.audioCtx.currentTime, 0.01);
      }
    });
  }

  /**
   * 獲取目前濾波器狀態
   */
  getCurrentFilters(): Filters {
    return this.filters.map(node => ({
      hz: node.frequency.value,
      gain: node.gain.value,
      q: node.Q.value,
      type: node.type,
    }));
  }

  /**
   * 切換等化器旁路（True Bypass）狀態
   */
  setBypass(bypassed: boolean) {
    if (this.isBypassed === bypassed) return;
    this.isBypassed = bypassed;

    if (this.currentSource) {
      try {
        this.currentSource.disconnect();
      } catch (_) {}

      if (this.isBypassed) {
        // 直通壓縮器輸出
        this.currentSource.connect(this.compressor);
      } else if (this.filters.length > 0 && this.filters[0]) {
        // 接回濾波器
        this.currentSource.connect(this.filters[0]);
      } else {
        this.currentSource.connect(this.compressor);
      }
    }
  }

  /**
   * 建立串流管線：Source -> Filters -> Compressor -> Destination
   */
  private connectChain() {
    if (this.filters.length === 0) return;

    // 串聯各個 filter
    for (let i = 0; i < this.filters.length - 1; i++) {
      const current = this.filters[i];
      const next = this.filters[i + 1];
      if (current && next) {
        current.connect(next);
      }
    }

    // 最後一個 filter 連接至 compressor
    const lastFilter = this.filters[this.filters.length - 1];
    if (lastFilter) {
      lastFilter.connect(this.compressor);
    }

    // 若當前已有 MediaSource，且未處於 Bypass，將其接入第一個 filter
    if (this.currentSource) {
      if (this.isBypassed) {
        this.currentSource.connect(this.compressor);
      } else if (this.filters[0]) {
        try {
          this.currentSource.connect(this.filters[0]);
        } catch (e) {
          console.warn("[Equalizer] Source connect failed:", e);
        }
      }
    }
  }

  /**
   * 中斷濾波器連接
   */
  private disconnectChain() {
    if (this.currentSource && this.filters.length > 0) {
      try {
        this.currentSource.disconnect();
      } catch (_) {}
    }

    this.filters.forEach(filter => {
      try {
        filter.disconnect();
      } catch (_) {}
    });
  }

  /**
   * 連接媒體元素 (HTMLMediaElement)
   */
  async stream(mediaEl: HTMLMediaElement) {
    await this.ensureAudioContextRunning();

    if (this.currentMedia === mediaEl && this.isStream) {
      return;
    }

    // 若更換了媒體元素，先斷開先前的連接
    if (this.currentSource) {
      try {
        this.currentSource.disconnect();
      } catch (_) {}
    }

    this.currentMedia = mediaEl;

    // 使用 WeakMap 防止同一元素重複 createMediaElementSource 報錯
    let source = this.mediaSourceMap.get(mediaEl);
    if (!source) {
      try {
        source = this.audioCtx.createMediaElementSource(mediaEl);
        this.mediaSourceMap.set(mediaEl, source);
      } catch (err: any) {
        console.error("[Equalizer] createMediaElementSource error:", err);
        return;
      }
    }

    this.currentSource = source;

    if (this.isBypassed) {
      source.connect(this.compressor);
    } else if (this.filters.length > 0 && this.filters[0]) {
      try {
        source.connect(this.filters[0]);
      } catch (e) {
        console.warn("[Equalizer] Failed to connect source to first filter:", e);
      }
    } else {
      source.connect(this.compressor);
    }

    this.isStream = true;
  }
}
