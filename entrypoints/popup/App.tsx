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
  SendMsg,
  MsgToFormat,
} from "../../utils";
import { Help } from "./Help";
import { TopControlBar, InlinePresetBar, EqualizerSlider } from "./Equalizer";

const tabSize = { height: 36, minHeight: 36 };

export function App({ storeData }: { storeData: Required<StoreDataType> }) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [curr, setCurr] = React.useState(storeData.mainOption);
  const [favoriteOption, setFavoriteOption] = React.useState(storeData.mainOption);
  const [presets, setPresets] = React.useState<PresetMap>({
    ...storeData.alwaysExist,
    ...storeData.customMap,
  });
  const [mainFilter, setMainFilter] = React.useState<Filters>(() => {
    const activePreset = presets[curr] || storeData.alwaysExist["default"];
    return cloneFilters(activePreset?.filters ?? []);
  });

  const [audioStatus, setAudioStatus] = React.useState<AudioConnectionStatus>("no_media");
  const [mediaIndex, setMediaIndex] = React.useState(0);
  const [mediaTotal, setMediaTotal] = React.useState(0);
  const [isBypassed, setIsBypassed] = React.useState(false);

  const [ctrlDialog, setCtrlDialog] = React.useState(false);
  const [ctrlAlert, setCtrlAlert] = React.useState<{
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
    const target = presets[curr];
    if (!target?.filters) return false;
    return mainFilter.some((f, idx) => {
      const orig = target.filters[idx];
      return orig !== undefined && Math.abs(f.gain - orig.gain) > 0.01;
    });
  }, [mainFilter, presets, curr]);

  const isCustom = !storeData.alwaysExist[curr];
  const isFavorite = curr === favoriteOption;

  React.useEffect(() => {
    const messageListener = (msg: SendMsg) => {
      switch (msg.type) {
        case "initUI": {
          const data = msg.data as MsgToFormat["initUI"];
          if (data.filters && data.filters.length > 0) {
            setMainFilter(cloneFilters(data.filters));
          }
          if (data.status) {
            setAudioStatus(data.status);
          }
          if (data.mediaIndex !== undefined) setMediaIndex(data.mediaIndex);
          if (data.mediaTotal !== undefined) setMediaTotal(data.mediaTotal);
          if (data.bypass !== undefined) setIsBypassed(data.bypass);
          break;
        }
        case "statusUpdate": {
          const data = msg.data as MsgToFormat["statusUpdate"];
          if (data.status) setAudioStatus(data.status);
          if (data.mediaIndex !== undefined) setMediaIndex(data.mediaIndex);
          if (data.mediaTotal !== undefined) setMediaTotal(data.mediaTotal);
          if (data.bypass !== undefined) setIsBypassed(data.bypass);
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
    setCtrlAlert({ open: true, msg, type });
    setTimeout(() => {
      setCtrlAlert(prev => ({ ...prev, open: false }));
    }, 2000);
  };

  const handleTogglePower = async (enabled: boolean) => {
    setIsBypassed(!enabled);
    await sendMessageToCurrentTabs("toggleBypass", { enabled });
  };

  const handleRescan = async () => {
    await sendMessageToCurrentTabs("connect", { cycle: true });
  };

  const handleSetFilter = (key: string, updatedPresets: PresetMap = presets) => {
    const target = updatedPresets[key];
    if (!target) return;

    const cloned = cloneFilters(target.filters);
    setCurr(key);
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
    await Store.set("mainOption", curr);
    setFavoriteOption(curr);
    openAlert(browser.i18n.getMessage("saveSuccess"), "success");
  };

  // 💾 覆蓋儲存修改至當前自訂預設
  const handleUpdate = async () => {
    if (!isCustom) return;

    const currentStore = await Store.getAll();
    const updatedCustom = {
      ...currentStore.customMap,
      [curr]: {
        name: presets[curr]?.name || curr,
        filters: cloneFilters(mainFilter),
      },
    };

    await Store.set("customMap", updatedCustom);
    const merged: PresetMap = { ...currentStore.alwaysExist, ...updatedCustom };
    setPresets(merged);
    openAlert(browser.i18n.getMessage("saveSuccess"), "success");
  };

  // ⟲ 還原變更
  const handleRevert = () => {
    const target = presets[curr];
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

    const currentStore = await Store.getAll();
    const updatedCustom = { ...currentStore.customMap };
    delete updatedCustom[curr];

    await Store.set("customMap", updatedCustom);
    const merged: PresetMap = { ...currentStore.alwaysExist, ...updatedCustom };
    setPresets(merged);

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

    const updatedCustom = {
      ...currentStore.customMap,
      [filterName]: {
        name: filterName,
        filters: cloneFilters(mainFilter),
      },
    };

    await Store.set("customMap", updatedCustom);
    const merged: PresetMap = { ...currentStore.alwaysExist, ...updatedCustom };
    setPresets(merged);
    openAlert(browser.i18n.getMessage("saveSuccess"), "success");
    handleSetFilter(filterName, merged);
    setCtrlDialog(false);
  };

  return (
    <Box width={380} sx={{ p: 1.5, boxSizing: "border-box" }}>
      {/* 頂部主控與狀態列 */}
      <TopControlBar
        isBypassed={isBypassed}
        onTogglePower={handleTogglePower}
        status={audioStatus}
        mediaIndex={mediaIndex}
        mediaTotal={mediaTotal}
        onRescan={handleRescan}
      />

      {/* 頁籤分頁 */}
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

      {/* 主面板 (免滾動捲軸 Cockpit) */}
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
            {/* 單行整合預設工具列 */}
            <InlinePresetBar
              presets={presets}
              value={curr}
              onSelect={handleSetFilter}
              isFavorite={isFavorite}
              isCustom={isCustom}
              isDirty={isDirty}
              onFavorite={handleFavorite}
              onUpdate={handleUpdate}
              onSaveAs={() => setCtrlDialog(true)}
              onRevert={handleRevert}
              onDelete={handleDelete}
            />

            {/* 5 頻段垂直滑桿 */}
            <EqualizerSlider filters={mainFilter} onChange={handleMainFilterChange} />
          </React.Fragment>
        )}

        {tabIndex === 1 && <Help />}
      </Paper>

      {/* 訊息回饋 */}
      <Collapse in={ctrlAlert.open}>
        <Alert severity={ctrlAlert.type} sx={{ py: 0, px: 1, fontSize: "0.8rem" }}>
          {ctrlAlert.msg}
        </Alert>
      </Collapse>

      {/* 另存為新預設對話框 */}
      <Dialog open={ctrlDialog} onClose={() => setCtrlDialog(false)} maxWidth="xs" fullWidth>
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
            <Button onClick={() => setCtrlDialog(false)}>
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
