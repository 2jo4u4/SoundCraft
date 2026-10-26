export type FilterType = BiquadFilterType;

export interface FilterParam {
  f: number;
  q: number;
  g?: number;
}

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

export interface MsgToFormat {
  open: null;
  initUI: {
    filters: Filters;
    status: AudioConnectionStatus;
    mediaIndex: number;
    mediaTotal: number;
    bypass: boolean;
  };
  connect: { cycle?: boolean } | null;
  ctrl: { index: number; val: number }[];
  statusUpdate: {
    status: AudioConnectionStatus;
    mediaIndex: number;
    mediaTotal: number;
    bypass?: boolean;
  };
  toggleBypass: {
    enabled: boolean;
  };
}

export type NotifyType = keyof MsgToFormat;

export interface SendMsg<T extends NotifyType = NotifyType> {
  type: T;
  data: MsgToFormat[T];
}

export type ActionType = "favorite" | "medialink" | "reset" | "save" | "delete";

export interface StoreDataType {
  checkDataStatus?: { version: string };
  mainOption?: string;
  alwaysExist?: PresetMap;
  customMap?: PresetMap;
}
