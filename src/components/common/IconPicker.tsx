"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  Popover,
  TextField,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import CodeIcon from "@mui/icons-material/Code";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import TuneIcon from "@mui/icons-material/Tune";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

export const MUI_ICON_MAP: Record<
  string,
  { label: string; component: React.ElementType }
> = {
  Category: { label: "Category", component: CategoryOutlinedIcon },
  RocketLaunch: { label: "Rocket Launch", component: RocketLaunchOutlinedIcon },
  HelpOutline: { label: "Help", component: HelpOutlineIcon },
  Settings: { label: "Settings", component: SettingsOutlinedIcon },
  AccountCircle: { label: "Account", component: AccountCircleOutlinedIcon },
  Payments: { label: "Payments", component: PaymentsOutlinedIcon },
  WorkOutline: { label: "Work", component: WorkOutlineIcon },
  Security: { label: "Security", component: SecurityOutlinedIcon },
  Notifications: { label: "Notifications", component: NotificationsNoneIcon },
  Description: { label: "Description", component: DescriptionOutlinedIcon },
  SupportAgent: { label: "Support", component: SupportAgentIcon },
  Build: { label: "Build", component: BuildOutlinedIcon },
  Integration: {
    label: "Integration",
    component: IntegrationInstructionsOutlinedIcon,
  },
  ReceiptLong: { label: "Billing", component: ReceiptLongOutlinedIcon },
  Group: { label: "Team", component: GroupOutlinedIcon },
  Dashboard: { label: "Dashboard", component: DashboardOutlinedIcon },
  Bookmark: { label: "Bookmark", component: BookmarkBorderIcon },
  Folder: { label: "Folder", component: FolderOutlinedIcon },
  Code: { label: "Code", component: CodeIcon },
  Cloud: { label: "Cloud", component: CloudOutlinedIcon },
  Lock: { label: "Lock", component: LockOutlinedIcon },
  Email: { label: "Email", component: EmailOutlinedIcon },
  Phone: { label: "Phone", component: PhoneOutlinedIcon },
  Analytics: { label: "Analytics", component: AnalyticsOutlinedIcon },
  School: { label: "Guide", component: SchoolOutlinedIcon },
  Star: { label: "Featured", component: StarBorderIcon },
  Tune: { label: "Preferences", component: TuneIcon },
  VerifiedUser: { label: "Verified", component: VerifiedUserOutlinedIcon },
  EventAvailable: { label: "Attendance", component: EventAvailableOutlinedIcon },
  Schedule: { label: "Schedule", component: ScheduleOutlinedIcon },
  CheckCircle: { label: "Approvals", component: CheckCircleOutlinedIcon },
  BeachAccess: { label: "Leave", component: BeachAccessOutlinedIcon },
  Fingerprint: { label: "Biometric", component: FingerprintOutlinedIcon },
  Assessment: { label: "Reports", component: AssessmentOutlinedIcon },
  AccountBalanceWallet: { label: "Compensation", component: AccountBalanceWalletOutlinedIcon },
  SwapHoriz: { label: "Transactions", component: SwapHorizOutlinedIcon },
  Calculate: { label: "Calculator", component: CalculateOutlinedIcon },
  Gavel: { label: "Compliance", component: GavelOutlinedIcon },
  AdminPanelSettings: { label: "Administration", component: AdminPanelSettingsOutlinedIcon },
};

export function DynamicMuiIcon({
  name,
  fontSize = "small",
  color = "inherit",
}: {
  name: string;
  fontSize?: "small" | "medium" | "large" | "inherit";
  color?: "inherit" | "primary" | "secondary" | "action" | "disabled" | "error";
}) {
  const entry = MUI_ICON_MAP[name] ?? MUI_ICON_MAP.Category;

  const IconComp = entry.component;

  return <IconComp fontSize={fontSize} color={color} />;
}

type IconPickerProps = {
  value: string;
  onChange: (iconName: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export default function IconPicker({
  value,
  onChange,
  error = false,
  disabled = false,
}: IconPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [search, setSearch] = useState("");

  const open = Boolean(anchorEl);

  const selectedEntry = MUI_ICON_MAP[value];

  const filteredIcons = Object.entries(MUI_ICON_MAP).filter(
    ([key, item]) =>
      key.toLowerCase().includes(search.toLowerCase()) ||
      item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Button
        variant="outlined"
        disabled={disabled}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        fullWidth
        sx={{
          height: 40,
          justifyContent: "space-between",
          px: 1.5,
          borderColor: error ? "error.main" : "divider",
          color: selectedEntry ? "text.primary" : "text.secondary",
          backgroundColor: "background.paper",
          "&:hover": {
            borderColor: error ? "error.main" : "text.primary",
            backgroundColor: "background.paper",
          },
        }}
        endIcon={<KeyboardArrowDownIcon color="action" />}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {selectedEntry ? (
            <DynamicMuiIcon name={value} fontSize="small" color="primary" />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Select
            </Typography>
          )}
        </Box>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: { width: 320, p: 1.5, mt: 0.5, borderRadius: 2 },
          },
        }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          sx={{ mb: 1.5 }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 0.5,
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {filteredIcons.map(([key, item]) => {
            const IconComp = item.component;

            const isSelected = value === key;

            return (
              <Tooltip key={key} title={item.label} arrow>
                <IconButton
                  size="small"
                  onClick={() => {
                    onChange(key);
                    setAnchorEl(null);
                  }}
                  sx={{
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: isSelected ? "primary.main" : "transparent",
                    backgroundColor: isSelected ? "#eff6ff" : "transparent",
                    color: isSelected ? "primary.main" : "text.secondary",
                    "&:hover": {
                      backgroundColor: "#f1f5f9",
                    },
                  }}
                >
                  <IconComp fontSize="small" />
                </IconButton>
              </Tooltip>
            );
          })}
          {filteredIcons.length === 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ gridColumn: "1 / -1", textAlign: "center", py: 2 }}
            >
              No icons found
            </Typography>
          )}
        </Box>
      </Popover>
    </>
  );
}
