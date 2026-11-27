"use client";

import React from "react";
import { Button, Tooltip } from "@codezee/sixtify-brahma";
import {
  Box,
  Divider,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import VerticalSplitOutlinedIcon from "@mui/icons-material/VerticalSplitOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { ArticleBlockType } from "@/types/article";
import { BLOCK_TYPES } from "./blockConstants";

type BlockToolbarProps = {
  viewMode: "edit" | "split" | "preview";
  onViewModeChange: (mode: "edit" | "split" | "preview") => void;
  onAddBlock: (type: ArticleBlockType) => void;
};

export function BlockToolbar({
  viewMode,
  onViewModeChange,
  onAddBlock,
}: BlockToolbarProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        px: 1.5,
        py: 0.875,
        borderRadius: 2,
        borderColor: "divider",
        backgroundColor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        overflowX: "auto",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: 700,
          letterSpacing: 0.4,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        ADD BLOCK
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0.75,
          flexWrap: "nowrap",
          ml: "auto",
        }}
      >
        {BLOCK_TYPES.map((bt) => {
          const IconComp = bt.icon;

          return (
            <Button
              key={bt.type}
              size="small"
              variant="outlined"
              startIcon={<IconComp sx={{ fontSize: 15 }} />}
              onClick={() => onAddBlock(bt.type)}
              sx={{
                fontSize: "0.75rem",
                py: 0.35,
                px: 1.1,
                minWidth: "auto",
                whiteSpace: "nowrap",
                borderRadius: 1.5,
                backgroundColor: "background.paper",
              }}
            >
              {bt.label}
            </Button>
          );
        })}

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <ToggleButtonGroup
          size="small"
          exclusive
          value={viewMode === "edit" ? null : viewMode}
          onChange={(_, next: "split" | "preview" | null) =>
            onViewModeChange(next ?? "edit")
          }
          sx={{
            flexShrink: 0,
            backgroundColor: "background.paper",
            "& .MuiToggleButton-root": {
              py: 0.35,
              px: 0.85,
              borderColor: "divider",
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(33, 150, 243, 0.16)"
                    : "#eff6ff",
              },
            },
          }}
        >
          <ToggleButton value="split" aria-label="Split view">
            <Tooltip
              toolTipLabel={
                viewMode === "split" ? "Exit Split View" : "Split View"
              }
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <VerticalSplitOutlinedIcon sx={{ fontSize: 16 }} />
              </Box>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="preview" aria-label="Toggle preview">
            <Tooltip
              toolTipLabel={
                viewMode === "preview" ? "Back to Editor" : "Preview"
              }
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {viewMode === "preview" ? (
                  <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} />
                ) : (
                  <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                )}
              </Box>
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
}

