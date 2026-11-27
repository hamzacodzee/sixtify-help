"use client";

import React from "react";
import { Button, Tooltip } from "@codezee/sixtify-brahma";
import { Box, TextField } from "@mui/material";

type ColorPickerInputProps = {
  value: string;
  onChange: (color: string) => void;
  label: string;
  disabled?: boolean;
};

function normalizeHexColor(value: string, fallback: string): string {
  const trimmed = value.trim();

  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed;
  }

  return fallback;
}

export function ColorPickerInput({
  value,
  onChange,
  label,
  disabled = false,
}: ColorPickerInputProps) {
  const safeColor = normalizeHexColor(value, "#2196f3");

  return (
    <Tooltip toolTipLabel={label}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          height: 36,
          px: 0.75,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          width: 112,
          flexShrink: 0,
        }}
      >
        <Button
          component="label"
          variant="outlined"
          disabled={disabled}
          aria-label={`${label} color picker`}
          sx={{
            width: 18,
            minWidth: 18,
            height: 18,
            p: 0,
            borderRadius: "4px",
            borderColor: "divider",
            backgroundColor: safeColor,
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
            "&:hover": {
              backgroundColor: safeColor,
              borderColor: "text.secondary",
            },
          }}
        >
          <TextField
            type="color"
            value={safeColor}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            inputProps={{ "aria-label": `${label} color` }}
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
              "& input": {
                cursor: "pointer",
                width: "100%",
                height: "100%",
                border: "none",
              },
            }}
          />
        </Button>

        <TextField
          size="small"
          variant="standard"
          value={value}
          disabled={disabled}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            if (!/^#[0-9a-fA-F]{6}$/.test(value.trim())) {
              onChange(safeColor);
            }
          }}
          inputProps={{ "aria-label": `${label} hex` }}
          InputProps={{ disableUnderline: true }}
          sx={{
            flex: 1,
            minWidth: 0,
            "& .MuiInputBase-root": {
              fontFamily: "monospace",
              fontSize: "0.75rem",
              fontWeight: 600,
              height: 22,
            },
            "& .MuiInputBase-input": {
              p: 0,
            },
          }}
        />
      </Box>
    </Tooltip>
  );
}

