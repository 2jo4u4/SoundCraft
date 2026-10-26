import React from "react";
import {
  Slider,
  Grid,
  Typography,
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Tooltip,
  Chip,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/esm/ExpandLess.js";
import ExpandMoreIcon from "@mui/icons-material/esm/ExpandMore.js";
import SaveIcon from "@mui/icons-material/esm/Save.js";
import AddIcon from "@mui/icons-material/esm/Add.js";
import RestoreIcon from "@mui/icons-material/esm/Restore.js";
import StarIcon from "@mui/icons-material/esm/Star.js";
import StarBorderIcon from "@mui/icons-material/esm/StarBorder.js";
import DeleteForeverIcon from "@mui/icons-material/esm/DeleteForever.js";
import SyncIcon from "@mui/icons-material/esm/Sync.js";
import CheckCircleOutlineIcon from "@mui/icons-material/esm/CheckCircleOutline.js";
import HighlightOffIcon from "@mui/icons-material/esm/HighlightOff.js";
import WarningAmberIcon from "@mui/icons-material/esm/WarningAmber.js";
import { browser } from "wxt/browser";

import { hzToTitle } from "../../utils";
import type { Filters, PresetMap, AudioConnectionStatus } from "../../utils";

export interface AudioStatusBarProps {
  isBypassed: boolean;
  onTogglePower: (enabled: boolean) => void;
  status: AudioConnectionStatus;
  mediaIndex: number;
  mediaTotal: number;
  onRescan: () => void;
}

export function AudioStatusBar({
  isBypassed,
  onTogglePower,
  status,
  mediaIndex,
  mediaTotal,
  onRescan,
}: AudioStatusBarProps) {
  const [spinning, setSpinning] = React.useState(false);

  const handleSyncClick = () => {
    setSpinning(true);
    onRescan();
    setTimeout(() => setSpinning(false), 500);
  };

  let statusLabel = browser.i18n.getMessage("statusConnected");
  let statusColor: "success" | "default" | "error" = "success";
  let statusIcon = <CheckCircleOutlineIcon fontSize="small" />;

  if (status === "no_media") {
    statusLabel = browser.i18n.getMessage("statusNoMedia");
    statusColor = "default";
    statusIcon = <HighlightOffIcon fontSize="small" />;
  } else if (status === "cors_restricted") {
    statusLabel = browser.i18n.getMessage("statusCorsRestricted");
    statusColor = "error";
    statusIcon = <WarningAmberIcon fontSize="small" />;
  } else if (mediaTotal > 0) {
    statusLabel = `${browser.i18n.getMessage("statusConnected")} (${mediaIndex}/${mediaTotal})`;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1,
        py: 0.6,
        mb: 1.5,
        borderRadius: 1,
        bgcolor: "rgba(0, 0, 0, 0.03)",
        border: "1px solid rgba(0, 0, 0, 0.06)",
      }}
    >
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={!isBypassed}
            onChange={e => onTogglePower(e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="body2" sx={{ fontWeight: "medium", fontSize: "0.82rem" }}>
            {!isBypassed
              ? browser.i18n.getMessage("eqEnabled" as any)
              : browser.i18n.getMessage("eqBypassed" as any)}
          </Typography>
        }
        sx={{ m: 0 }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Chip
          icon={statusIcon}
          label={statusLabel}
          size="small"
          color={statusColor}
          variant="outlined"
          sx={{ fontWeight: "medium", fontSize: "0.72rem", height: 26 }}
        />
        <Tooltip title={browser.i18n.getMessage("rescanMedia" as any)}>
          <IconButton
            size="small"
            onClick={handleSyncClick}
            sx={{
              p: 0.5,
              transition: "transform 0.5s ease-in-out",
              transform: spinning ? "rotate(360deg)" : "none",
            }}
          >
            <SyncIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export interface PresetSelectorProps {
  presets: PresetMap;
  value: string;
  onSelect: (key: string) => void;
}

export function PresetSelector({ presets, value, onSelect }: PresetSelectorProps) {
  return (
    <FormControl fullWidth size="small" sx={{ mb: 1.2 }}>
      <InputLabel id="equalizer-select-label">{browser.i18n.getMessage("equalizer")}</InputLabel>
      <Select
        labelId="equalizer-select-label"
        value={value}
        label={browser.i18n.getMessage("equalizer")}
        onChange={event => onSelect(event.target.value)}
        sx={{ height: 38, fontSize: "0.85rem" }}
      >
        {Object.entries(presets).map(([key, preset]) => {
          const displayText = preset.i18nKey
            ? browser.i18n.getMessage(preset.i18nKey as any) || key
            : preset.name || key;

          return (
            <MenuItem key={key} value={key} sx={{ fontSize: "0.85rem" }}>
              {displayText}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export interface PresetActionButtonsProps {
  isFavorite: boolean;
  isCustom: boolean;
  isDirty: boolean;
  onFavorite: () => void;
  onUpdate: () => void;
  onSaveAs: () => void;
  onRevert: () => void;
  onDelete: () => void;
}

export function PresetActionButtons({
  isFavorite,
  isCustom,
  isDirty,
  onFavorite,
  onUpdate,
  onSaveAs,
  onRevert,
  onDelete,
}: PresetActionButtonsProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mb: 1.5 }}>
      {/* 第一列：★ 首選 / 💾 儲存 / ➕ 另存 */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title={browser.i18n.getMessage("favorite")}>
          <Button
            size="small"
            variant="text"
            startIcon={isFavorite ? <StarIcon /> : <StarBorderIcon />}
            color={isFavorite ? "warning" : "inherit"}
            onClick={onFavorite}
            sx={{ flex: 1, py: 0.4, fontSize: "0.8rem", textTransform: "none" }}
          >
            {browser.i18n.getMessage("favoriteBtn" as any)}
          </Button>
        </Tooltip>

        <Tooltip title={browser.i18n.getMessage("updatePreset" as any)}>
          <span>
            <Button
              size="small"
              variant="text"
              startIcon={<SaveIcon />}
              disabled={!isCustom || !isDirty}
              color={isDirty ? "primary" : "inherit"}
              onClick={onUpdate}
              sx={{ flex: 1, py: 0.4, fontSize: "0.8rem", textTransform: "none" }}
            >
              {browser.i18n.getMessage("updateBtn" as any)}
            </Button>
          </span>
        </Tooltip>

        <Tooltip title={browser.i18n.getMessage("saveAsNew" as any)}>
          <Button
            size="small"
            variant="text"
            startIcon={<AddIcon />}
            color="inherit"
            onClick={onSaveAs}
            sx={{ flex: 1, py: 0.4, fontSize: "0.8rem", textTransform: "none" }}
          >
            {browser.i18n.getMessage("saveAsBtn" as any)}
          </Button>
        </Tooltip>
      </Box>

      {/* 第二列：⟲ 還原 / 🗑 刪除 */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title={browser.i18n.getMessage("revertChanges" as any)}>
          <span>
            <Button
              size="small"
              variant="text"
              startIcon={<RestoreIcon />}
              disabled={!isDirty}
              color="inherit"
              onClick={onRevert}
              sx={{ flex: 1, py: 0.4, fontSize: "0.8rem", textTransform: "none" }}
            >
              {browser.i18n.getMessage("revertBtn" as any)}
            </Button>
          </span>
        </Tooltip>

        <Tooltip title={browser.i18n.getMessage("delete")}>
          <span>
            <Button
              size="small"
              variant="text"
              startIcon={<DeleteForeverIcon />}
              disabled={!isCustom}
              color="error"
              onClick={onDelete}
              sx={{ flex: 1, py: 0.4, fontSize: "0.8rem", textTransform: "none" }}
            >
              {browser.i18n.getMessage("deleteBtn" as any)}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}

export function EqualizerSlider({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange?: (index: number, newVal: number) => void;
}) {
  return (
    <Grid
      container
      sx={{
        flexWrap: "nowrap",
        justifyContent: "space-between",
        py: 0.5,
        px: 0.5,
        borderRadius: 1,
        bgcolor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      {filters.map((filter, index) => (
        <FilterSlider
          key={`${filter.hz}-${index}`}
          label={hzToTitle(filter.hz)}
          value={filter.gain}
          onChange={newVal => {
            onChange && onChange(index, newVal);
          }}
        />
      ))}
    </Grid>
  );
}

function FilterSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const change = (val: number) => {
    const clamped = Math.max(-12, Math.min(12, Math.round(val * 2) / 2));
    onChange(clamped);
  };

  const step = (amount: number) => {
    change(value + amount);
  };

  const isBoosted = value > 0;
  const isCut = value < 0;

  return (
    <Grid item width={58} container direction="column" alignItems="center" justifyContent="center">
      <Typography variant="caption" sx={{ fontWeight: "bold", fontSize: "0.72rem", mb: 0.2 }}>
        {label}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.68rem",
          fontWeight: isBoosted ? "bold" : "medium",
          color: isBoosted ? "primary.main" : isCut ? "text.secondary" : "text.disabled",
          mb: 0.2,
        }}
      >
        {value > 0 ? `+${value}` : value} dB
      </Typography>
      <IconButton size="small" onClick={() => step(0.5)} sx={{ p: 0.2 }}>
        <ExpandLessIcon fontSize="small" />
      </IconButton>
      <Box
        sx={{
          my: 0.5,
          height: 145,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 0 dB 輔助參考中線 */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: -4,
            right: -4,
            height: "1px",
            borderTop: "1px dashed rgba(0, 0, 0, 0.2)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <Slider
          size="small"
          valueLabelDisplay="auto"
          max={12}
          min={-12}
          step={0.5}
          value={value}
          onChange={(_, newVal) => change(newVal as number)}
          orientation="vertical"
          sx={{ height: 135, zIndex: 1 }}
        />
      </Box>
      <IconButton size="small" onClick={() => step(-0.5)} sx={{ p: 0.2 }}>
        <ExpandMoreIcon fontSize="small" />
      </IconButton>
    </Grid>
  );
}
