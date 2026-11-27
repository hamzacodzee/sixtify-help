import type { SxProps, Theme } from "@mui/material";
import { useTheme } from "@mui/material";
import { useMemo } from "react";

const getColorPickerPopperSx = (theme: Theme): SxProps<Theme> => ({
  width: 260,
  "& .MuiPaper-root": {
    borderRadius: "8px",
    boxShadow: 4,
    border: `1px solid ${theme.palette.divider}`,
    padding: "10px",
  },
  "& .react-colorful": {
    width: "100%",
    height: 150,
  },
  "& .react-colorful__saturation": {
    borderRadius: "5px",
  },
  "& .react-colorful__hue, & .react-colorful__alpha": {
    height: 10,
    borderRadius: 5,
    marginTop: "10px",
  },
  "& .react-colorful__pointer": {
    width: 14,
    height: 14,
    borderWidth: 2,
  },
  "& .MuiTiptap-ColorPicker-colorTextInput": {
    marginTop: "10px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px",
    },
  },
  "& .MuiTiptap-ColorPicker-swatchContainer": {
    marginTop: "10px",
    gap: "5px",
  },
  "& .MuiTiptap-ColorSwatchButton-root": {
    height: 22,
    width: 22,
    minWidth: 22,
    borderRadius: "5px",
  },
  "& .MuiStack-root": {
    marginTop: "10px",
    gap: "5px",
    "& .MuiButton-root": {
      minWidth: 0,
      flex: 1,
      borderRadius: "5px",
      textTransform: "none",
      fontSize: "0.75rem",
      fontWeight: 500,
    },
  },
});

export const useTextColorPickerMenuProps = () => {
  const theme = useTheme();

  return useMemo(
    () => ({
      PopperProps: {
        sx: getColorPickerPopperSx(theme),
      },
      ColorPickerProps: {
        disableAlpha: true,
        labels: {
          textFieldPlaceholder: "#000000",
        },
      },
      labels: {
        removeColorButton: "Reset",
        cancelButton: "Cancel",
        saveButton: "Apply",
      },
    }),
    [theme]
  );
};

export const useHighlightColorPickerMenuProps = () => {
  const theme = useTheme();

  return useMemo(
    () => ({
      PopperProps: {
        sx: getColorPickerPopperSx(theme),
      },
      ColorPickerProps: {
        disableAlpha: true,
      },
      labels: {
        removeColorButton: "None",
        cancelButton: "Cancel",
        saveButton: "Apply",
      },
    }),
    [theme]
  );
};

