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
  Menu,
  Divider,
  ListItemIcon,
  ListItemText,
  ListSubheader,
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
import AdsClickIcon from "@mui/icons-material/esm/AdsClick.js";
import AutoAwesomeIcon from "@mui/icons-material/esm/AutoAwesome.js";
import VideocamIcon from "@mui/icons-material/esm/Videocam.js";
import AudiotrackIcon from "@mui/icons-material/esm/Audiotrack.js";
import CheckIcon from "@mui/icons-material/esm/Check.js";
import ArrowDropDownIcon from "@mui/icons-material/esm/ArrowDropDown.js";
import { browser } from "wxt/browser";

import { hzToTitle } from "../../utils";
import type { Filters, PresetMap, AudioConnectionStatus, DiscoveredMediaItem } from "../../utils";

export interface AudioStatusBarProps {
  isBypassed: boolean;
  onTogglePower: (enabled: boolean) => void;
  status: AudioConnectionStatus;
  mediaIndex: number;
  mediaTotal: number;
  mediaList?: DiscoveredMediaItem[];
  onRescan: () => void;
  onSelectMedia: (index: number) => void;
  onStartPicker: () => void;
  onAutoSelectBest: () => void;
}

export function AudioStatusBar({
  isBypassed,
  onTogglePower,
  status,
  mediaIndex,
  mediaTotal,
  mediaList = [],
  onRescan,
  onSelectMedia,
  onStartPicker,
  onAutoSelectBest,
}: AudioStatusBarProps) {
  const [spinning, setSpinning] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: "0.78rem",
              whiteSpace: "nowrap",
            }}
          >
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
          deleteIcon={<ArrowDropDownIcon />}
          onDelete={handleOpenMenu}
          onClick={handleOpenMenu}
          sx={{
            fontWeight: "medium",
            fontSize: "0.72rem",
            height: 26,
            cursor: "pointer",
            "& .MuiChip-deleteIcon": {
              color: "inherit",
              marginRight: "2px",
            },
          }}
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

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              width: 290,
              maxHeight: 380,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              borderRadius: 2,
            },
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onStartPicker();
            }}
            sx={{ py: 0.8, fontSize: "0.85rem" }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <AdsClickIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={browser.i18n.getMessage("pickFromPage" as any) || "點擊畫面選取目標"}
              primaryTypographyProps={{ fontSize: "0.83rem", fontWeight: "medium" }}
            />
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onAutoSelectBest();
            }}
            sx={{ py: 0.8, fontSize: "0.85rem" }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <AutoAwesomeIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={browser.i18n.getMessage("autoSelectBest" as any) || "自動最佳推薦"}
              primaryTypographyProps={{ fontSize: "0.83rem", fontWeight: "medium" }}
            />
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />

          <ListSubheader
            sx={{
              lineHeight: "26px",
              fontSize: "0.72rem",
              bgcolor: "transparent",
              color: "text.secondary",
            }}
          >
            {browser.i18n.getMessage("discoveredMediaTitle" as any) || "已偵測的音視訊清單"} ({mediaList.length})
          </ListSubheader>

          {mediaList.length === 0 ? (
            <MenuItem disabled sx={{ fontSize: "0.8rem", py: 1 }}>
              <ListItemText
                primary={browser.i18n.getMessage("statusNoMedia" as any) || "未偵測到任何播放中的媒體"}
                primaryTypographyProps={{ fontSize: "0.8rem", color: "text.secondary" }}
              />
            </MenuItem>
          ) : (
            mediaList.map((item, idx) => {
              let stateText = item.isAudible
                ? (browser.i18n.getMessage("mediaAudible" as any) || "發聲中")
                : item.isPlaying
                ? (browser.i18n.getMessage("mediaPlaying" as any) || "播放中")
                : (browser.i18n.getMessage("mediaPaused" as any) || "已暫停");

              if (item.isMuted) {
                stateText += ` • ${browser.i18n.getMessage("mediaMuted" as any) || "靜音"}`;
              }

              const secondaryParts: string[] = [];
              if (item.subtitle) secondaryParts.push(item.subtitle);
              if (item.width > 0 && item.height > 0) secondaryParts.push(`${item.width}x${item.height}`);
              secondaryParts.push(stateText);

              return (
                <MenuItem
                  key={item.id || idx}
                  selected={item.isActive}
                  onClick={() => {
                    handleCloseMenu();
                    onSelectMedia(item.index);
                  }}
                  sx={{
                    py: 0.8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden", mr: 1 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      {item.type === "video" ? (
                        <VideocamIcon fontSize="small" color={item.isPlaying ? "primary" : "action"} />
                      ) : (
                        <AudiotrackIcon fontSize="small" color={item.isPlaying ? "primary" : "action"} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              maxWidth: 165,
                              fontSize: "0.82rem",
                              fontWeight: item.isActive ? "bold" : "normal",
                            }}
                          >
                            {item.title}
                          </Typography>
                          {item.isRecommended && (
                            <Chip
                              label={browser.i18n.getMessage("mediaRecommended" as any) || "推薦"}
                              size="small"
                              color="secondary"
                              sx={{ height: 16, fontSize: "0.62rem", px: 0.2 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={secondaryParts.join(" • ")}
                      secondaryTypographyProps={{
                        fontSize: "0.68rem",
                        noWrap: true,
                        maxWidth: 195,
                      }}
                    />
                  </Box>
                  {item.isActive && <CheckIcon fontSize="small" color="primary" />}
                </MenuItem>
              );
            })
          )}
        </Menu>
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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 0.8,
        mb: 1.5,
      }}
    >
      {/* 第 1 列第 1 欄：★ 首選 */}
      <Tooltip title={browser.i18n.getMessage("favorite")}>
        <Button
          size="small"
          variant="text"
          startIcon={isFavorite ? <StarIcon /> : <StarBorderIcon />}
          color={isFavorite ? "warning" : "inherit"}
          onClick={onFavorite}
          fullWidth
          sx={{ py: 0.3, px: 0.5, fontSize: "0.75rem", textTransform: "none", whiteSpace: "nowrap" }}
        >
          {browser.i18n.getMessage("favoriteBtn" as any)}
        </Button>
      </Tooltip>

      {/* 第 1 列第 2 欄：💾 儲存 */}
      <Tooltip title={browser.i18n.getMessage("updatePreset" as any)}>
        <Box component="span" sx={{ display: "flex", width: "100%" }}>
          <Button
            size="small"
            variant="text"
            startIcon={<SaveIcon />}
            disabled={!isCustom || !isDirty}
            color={isDirty ? "primary" : "inherit"}
            onClick={onUpdate}
            fullWidth
            sx={{ py: 0.3, px: 0.5, fontSize: "0.75rem", textTransform: "none", whiteSpace: "nowrap" }}
          >
            {browser.i18n.getMessage("updateBtn" as any)}
          </Button>
        </Box>
      </Tooltip>

      {/* 第 1 列第 3 欄：➕ 另存 */}
      <Tooltip title={browser.i18n.getMessage("saveAsNew" as any)}>
        <Button
          size="small"
          variant="text"
          startIcon={<AddIcon />}
          color="inherit"
          onClick={onSaveAs}
          fullWidth
          sx={{ py: 0.3, px: 0.5, fontSize: "0.75rem", textTransform: "none", whiteSpace: "nowrap" }}
        >
          {browser.i18n.getMessage("saveAsBtn" as any)}
        </Button>
      </Tooltip>

      {/* 第 2 列第 1 欄：⟲ 還原 (對齊第 1 欄) */}
      <Tooltip title={browser.i18n.getMessage("revertChanges" as any)}>
        <Box component="span" sx={{ display: "flex", width: "100%" }}>
          <Button
            size="small"
            variant="text"
            startIcon={<RestoreIcon />}
            disabled={!isDirty}
            color="inherit"
            onClick={onRevert}
            fullWidth
            sx={{ py: 0.3, px: 0.5, fontSize: "0.75rem", textTransform: "none", whiteSpace: "nowrap" }}
          >
            {browser.i18n.getMessage("revertBtn" as any)}
          </Button>
        </Box>
      </Tooltip>

      {/* 第 2 列第 2 欄：🗑 刪除 (對齊第 2 欄) */}
      <Tooltip title={browser.i18n.getMessage("delete")}>
        <Box component="span" sx={{ display: "flex", width: "100%" }}>
          <Button
            size="small"
            variant="text"
            startIcon={<DeleteForeverIcon />}
            disabled={!isCustom}
            color="error"
            onClick={onDelete}
            fullWidth
            sx={{ py: 0.3, px: 0.5, fontSize: "0.75rem", textTransform: "none", whiteSpace: "nowrap" }}
          >
            {browser.i18n.getMessage("deleteBtn" as any)}
          </Button>
        </Box>
      </Tooltip>
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
