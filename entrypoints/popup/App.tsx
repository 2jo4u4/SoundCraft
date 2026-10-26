import React from "react";
import {
  Box,
  Tab,
  Tabs,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Alert,
  Collapse,
} from "@mui/material";
import StraightenIcon from "@mui/icons-material/esm/Straighten.js";
import HelpIcon from "@mui/icons-material/esm/Help.js";
import { browser } from "wxt/browser";

import {
  Store,
  sendMessageToCurrentTabs,
  cloneFilters,
} from "../../utils";
import type {
  StoreDataType,
  Filters,
  PresetMap,
  AudioConnectionStatus,
  DiscoveredMediaItem,
  SendMsg,
  MsgToFormat,
} from "../../utils";
import { Help } from "./Help";
import { AudioStatusBar, PresetSelector, PresetActionButtons, EqualizerSlider } from "./Equalizer";

const tabSize = {
  height: 38,
  minHeight: 38,
  fontSize: "0.82rem",
  textTransform: "none",
  fontWeight: "medium",
};

export function App({ storeData }: { storeData: Required<StoreDataType> }) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [activePresetKey, setActivePresetKey] = React.useState(storeData.mainOption);
  const [favoriteOption, setFavoriteOption] = React.useState(storeData.mainOption);
  const [presets, setPresets] = React.useState<PresetMap>({
    ...storeData.alwaysExist,
    ...storeData.customMap,
  });
  const [mainFilter, setMainFilter] = React.useState<Filters>(() => {
    const activePreset = presets[activePresetKey] || storeData.alwaysExist["default"];
    return cloneFilters(activePreset?.filters ?? []);
  });

  const [audioStatus, setAudioStatus] = React.useState<AudioConnectionStatus>("no_media");
  const [mediaIndex, setMediaIndex] = React.useState(0);
  const [mediaTotal, setMediaTotal] = React.useState(0);
  const [isBypassed, setIsBypassed] = React.useState(false);
  const [mediaList, setMediaList] = React.useState<DiscoveredMediaItem[]>([]);

  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [alertNotice, setAlertNotice] = React.useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({
    open: false,
    msg: "",
    type: "success",
  });

  // 判斷當前滑桿相對於選中預設是否有更動 (Dirty)
  const isDirty = React.useMemo(() => {
    const target = presets[activePresetKey];
    if (!target?.filters) return false;
    return mainFilter.some((f, idx) => {
      const orig = target.filters[idx];
      return orig !== undefined && Math.abs(f.gain - orig.gain) > 0.01;
    });
  }, [mainFilter, presets, activePresetKey]);

  const isCustom = !storeData.alwaysExist[activePresetKey];
  const isFavorite = activePresetKey === favoriteOption;

  React.useEffect(() => {
    const messageListener = (msg: SendMsg) => {
      switch (msg.type) {
        case "initUI": {
          const data = msg.data as MsgToFormat["initUI"];
          if (data.filters && data.filters.length > 0) {
            setMainFilter(cloneFilters(data.filters));
          }
          if (data.status) setAudioStatus(data.status);
          if (data.mediaIndex !== undefined) setMediaIndex(data.mediaIndex);
          if (data.mediaTotal !== undefined) setMediaTotal(data.mediaTotal);
          if (data.bypass !== undefined) setIsBypassed(data.bypass);
          if (data.mediaList) setMediaList(data.mediaList);
          break;
        }
        case "statusUpdate": {
          const data = msg.data as MsgToFormat["statusUpdate"];
          // 防禦保護：若 Popup 當前已連線至媒體，忽略來自無媒體來源的降級覆蓋（避免多 Frame 競爭）
          if (
            audioStatus === "connected" &&
            data.status === "no_media" &&
            (!data.mediaList || data.mediaList.length === 0)
          ) {
            break;
          }
          if (data.status) setAudioStatus(data.status);
          if (data.mediaIndex !== undefined) setMediaIndex(data.mediaIndex);
          if (data.mediaTotal !== undefined) setMediaTotal(data.mediaTotal);
          if (data.bypass !== undefined) setIsBypassed(data.bypass);
          if (data.mediaList) setMediaList(data.mediaList);
          break;
        }
      }
    };

    browser.runtime.onMessage.addListener(messageListener);

    // 向當前分頁查詢初始狀態
    sendMessageToCurrentTabs("open", null);

    return () => {
      browser.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const openAlert = (msg: string, type: "success" | "error" = "success") => {
    setAlertNotice({ open: true, msg, type });
    setTimeout(() => {
      setAlertNotice(prev => ({ ...prev, open: false }));
    }, 2000);
  };

  const handleTogglePower = async (enabled: boolean) => {
    setIsBypassed(!enabled);
    await sendMessageToCurrentTabs("toggleBypass", { enabled });
  };

  const handleRescan = async () => {
    await sendMessageToCurrentTabs("connect", { cycle: true });
  };

  const handleSelectMedia = async (index: number) => {
    await sendMessageToCurrentTabs("selectMedia", { index });
  };

  const handleAutoSelectBest = async () => {
    await sendMessageToCurrentTabs("autoSelectBest", null);
  };

  const handleStartPicker = async () => {
    await sendMessageToCurrentTabs("startElementPicker", null);
    window.close();
  };

  const handleSetFilter = (key: string, updatedPresets: PresetMap = presets) => {
    const target = updatedPresets[key];
    if (!target) return;

    const cloned = cloneFilters(target.filters);
    setActivePresetKey(key);
    setMainFilter(cloned);
    setPresets(updatedPresets);

    sendMessageToCurrentTabs(
      "ctrl",
      cloned.map(({ gain }, index) => ({ index, val: gain }))
    );
  };

  const handleMainFilterChange = (index: number, newVal: number) => {
    const clamped = Math.max(-12, Math.min(12, newVal));
    setMainFilter(prev => {
      const updated = cloneFilters(prev);
      if (updated[index]) {
        updated[index].gain = clamped;
      }
      return updated;
    });

    sendMessageToCurrentTabs("ctrl", [{ index, val: clamped }]);
  };

  // ★ 設為全域首選
  const handleFavorite = async () => {
    await Store.setFavorite(activePresetKey);
    setFavoriteOption(activePresetKey);
    openAlert(browser.i18n.getMessage("saveSuccess"), "success");
  };

  // 💾 覆蓋儲存修改至當前自訂預設
  const handleUpdate = async () => {
    if (!isCustom) return;

    const merged = await Store.saveCustomPreset(activePresetKey, {
      name: presets[activePresetKey]?.name || activePresetKey,
      filters: cloneFilters(mainFilter),
    });

    setPresets(merged);
    openAlert(browser.i18n.getMessage("saveSuccess"), "success");
  };

  // ⟲ 還原變更
  const handleRevert = () => {
    const target = presets[activePresetKey];
    if (target) {
      const cloned = cloneFilters(target.filters);
      setMainFilter(cloned);
      sendMessageToCurrentTabs(
        "ctrl",
        cloned.map(({ gain }, index) => ({ index, val: gain }))
      );
    }
  };

  // 🗑 刪除當前自訂預設
  const handleDelete = async () => {
    if (!isCustom) {
      openAlert(browser.i18n.getMessage("deleteFail"), "error");
      return;
    }

    const { merged, newMainOption } = await Store.deleteCustomPreset(activePresetKey);
    setPresets(merged);
    setFavoriteOption(newMainOption);

    openAlert(browser.i18n.getMessage("deleteSuccess"), "success");
    handleSetFilter("default", merged);
  };

  // ➕ 另存新檔提交
  const handleSaveSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const filterName = (formData.get("filterName") as string)?.trim();

    if (!filterName) return;

    const currentStore = await Store.getAll();

    if (currentStore.alwaysExist[filterName]) {
      openAlert(browser.i18n.getMessage("saveError1"), "error");
      return;
    }

    if (currentStore.customMap[filterName]) {
      openAlert(browser.i18n.getMessage("saveError2"), "error");
      return;
    }

    const merged = await Store.saveCustomPreset(filterName, {
      name: filterName,
      filters: cloneFilters(mainFilter),
    });

    setPresets(merged);
    openAlert(browser.i18n.getMessage("saveSuccess"), "success");
    handleSetFilter(filterName, merged);
    setSaveDialogOpen(false);
  };

  return (
    <Box width={400} sx={{ p: 1.5, boxSizing: "border-box" }}>
      {/* 頁籤分頁（最頂部） */}
      <Tabs
        value={tabIndex}
        onChange={(_, newVal) => setTabIndex(newVal)}
        variant="fullWidth"
        sx={{ ...tabSize, mb: 1.5 }}
      >
        <Tab
          iconPosition="start"
          icon={<StraightenIcon fontSize="small" />}
          label={browser.i18n.getMessage("equalizer")}
          sx={tabSize}
        />
        <Tab
          iconPosition="start"
          icon={<HelpIcon fontSize="small" />}
          label={browser.i18n.getMessage("help")}
          sx={tabSize}
        />
      </Tabs>

      {/* 主面板 */}
      <Paper
        elevation={2}
        sx={{
          p: 1.5,
          borderRadius: 1.5,
          boxSizing: "border-box",
          mb: 1,
        }}
      >
        {tabIndex === 0 && (
          <React.Fragment>
            {/* ① 音訊狀態列：開關 (啟動等化器/關閉等化器) + 狀態Badge + 🔄 */}
            <AudioStatusBar
              isBypassed={isBypassed}
              onTogglePower={handleTogglePower}
              status={audioStatus}
              mediaIndex={mediaIndex}
              mediaTotal={mediaTotal}
              mediaList={mediaList}
              onRescan={handleRescan}
              onSelectMedia={handleSelectMedia}
              onStartPicker={handleStartPicker}
              onAutoSelectBest={handleAutoSelectBest}
            />

            {/* ② 預設集下拉選單 (獨立一整列全寬) */}
            <PresetSelector
              presets={presets}
              value={activePresetKey}
              onSelect={handleSetFilter}
            />

            {/* ③ 兩列控制按鈕 (輕量純文字 Text Button 風格) */}
            <PresetActionButtons
              isFavorite={isFavorite}
              isCustom={isCustom}
              isDirty={isDirty}
              onFavorite={handleFavorite}
              onUpdate={handleUpdate}
              onSaveAs={() => setSaveDialogOpen(true)}
              onRevert={handleRevert}
              onDelete={handleDelete}
            />

            {/* ④ 5 頻段垂直滑桿 */}
            <EqualizerSlider filters={mainFilter} onChange={handleMainFilterChange} />
          </React.Fragment>
        )}

        {tabIndex === 1 && <Help />}
      </Paper>

      {/* 訊息回饋 */}
      <Collapse in={alertNotice.open}>
        <Alert severity={alertNotice.type} sx={{ py: 0, px: 1, fontSize: "0.8rem" }}>
          {alertNotice.msg}
        </Alert>
      </Collapse>

      {/* 另存為新預設對話框 */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={handleSaveSubmit}>
          <DialogTitle>{browser.i18n.getMessage("saveDialogTitle")}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              id="filterName"
              name="filterName"
              label={browser.i18n.getMessage("saveDialogField")}
              type="text"
              fullWidth
              variant="standard"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)}>
              {browser.i18n.getMessage("cancel")}
            </Button>
            <Button type="submit" variant="contained">
              {browser.i18n.getMessage("confirm")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
