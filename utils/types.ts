export type FilterType = BiquadFilterType;

export interface Filter {
  hz: number;
  gain: number;
  q: number;
  type: FilterType;
}

export type Filters = Filter[];

export interface FilterPreset {
  i18nKey?: string;
  name?: string;
  filters: Filters;
}

export type PresetMap = Record<string, FilterPreset>;

export type AudioConnectionStatus = "connected" | "no_media" | "cors_restricted";

export interface DiscoveredMediaItem {
  id: string;
  index: number;
  type: "video" | "audio";
  title: string;
  subtitle?: string;
  width: number;
  height: number;
  isPlaying: boolean;
  isAudible: boolean;
  isMuted: boolean;
  isCorsRestricted: boolean;
  isRecommended: boolean;
  isActive: boolean;
}

export interface MediaPlaybackInfo {
  status: AudioConnectionStatus;
  mediaIndex: number;
  mediaTotal: number;
  bypass: boolean;
}

export interface MsgToFormat {
  open: null;
  initUI: {
    filters: Filters;
    status: AudioConnectionStatus;
    mediaIndex: number;
    mediaTotal: number;
    bypass: boolean;
    mediaList?: DiscoveredMediaItem[];
  };
  connect: { cycle?: boolean } | null;
  ctrl: { index: number; val: number }[];
  statusUpdate: {
    status: AudioConnectionStatus;
    mediaIndex: number;
    mediaTotal: number;
    bypass?: boolean;
    mediaList?: DiscoveredMediaItem[];
  };
  toggleBypass: {
    enabled: boolean;
  };
  selectMedia: {
    id?: string;
    index?: number;
  };
  startElementPicker: null;
  autoSelectBest: null;
}

export type NotifyType = keyof MsgToFormat;

export interface SendMsg<T extends NotifyType = NotifyType> {
  type: T;
  data: MsgToFormat[T];
}

export interface StoreDataType {
  checkDataStatus?: { version: string };
  mainOption?: string;
  alwaysExist?: PresetMap;
  customMap?: PresetMap;
  domainEnabledMap?: Record<string, boolean>;
}
