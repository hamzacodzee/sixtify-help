import type { SxProps } from "@mui/material";
import { useTheme } from "@mui/material";
import {
  MenuButtonAddTable,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonEditLink,
  MenuButtonHighlightColor,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonStrikethrough,
  MenuButtonTextColor,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectFontFamily,
  MenuSelectFontSize,
  MenuSelectHeading,
  MenuSelectTextAlign,
} from "mui-tiptap";
import {
  useHighlightColorPickerMenuProps,
  useTextColorPickerMenuProps,
} from "./useColorPickerMenuProps";
import { useGetEditorFonts } from "./useGetEditorFonts";

export const TEXT_COLOR_SWATCHES = [
  "#1A1A1A",
  "#5C5C5C",
  "#9E9E9E",
  "#E53935",
  "#FB8C00",
  "#FDD835",
  "#43A047",
  "#00ACC1",
  "#1E88E5",
  "#8E24AA",
  "#D81B60",
  "#FFFFFF",
];

const HIGHLIGHT_COLOR_SWATCHES = [
  "#FFF59D",
  "#C8E6C9",
  "#B3E5FC",
  "#F8BBD9",
  "#E1BEE7",
  "#FFCCBC",
  "#FFE0B2",
  "#D7CCC8",
  "#CFD8DC",
  "#FFFFFF",
];

type EditorMenuControlsProps = {
  disabled?: boolean;
};

export const EditorMenuControls = ({
  disabled = false,
}: EditorMenuControlsProps) => {
  const theme = useTheme();

  const textColorPickerProps = useTextColorPickerMenuProps();

  const highlightColorPickerProps = useHighlightColorPickerMenuProps();

  const { fontOptions } = useGetEditorFonts();

  const commonStyles: SxProps = {
    "& .MuiOutlinedInput-input": { padding: "4px 8px !important" },
  };

  return (
    <MenuControlsContainer sx={{ flexWrap: "wrap", gap: 0.25 }}>
      <MenuSelectFontFamily
        sx={commonStyles}
        options={fontOptions}
        defaultValue="'Poppins', sans-serif"
        disabled={disabled}
      />

      <MenuDivider />

      <MenuSelectHeading disabled={disabled} sx={commonStyles} />

      <MenuDivider />

      <MenuSelectFontSize disabled={disabled} sx={commonStyles} />

      <MenuDivider />

      <MenuButtonBold disabled={disabled} />

      <MenuButtonItalic disabled={disabled} />

      <MenuButtonUnderline disabled={disabled} />

      <MenuButtonStrikethrough disabled={disabled} />

      <MenuButtonCode disabled={disabled} />

      <MenuButtonCodeBlock disabled={disabled} />

      <MenuButtonTextColor
        defaultTextColor={theme.palette.text.primary}
        disabled={disabled}
        swatchColors={TEXT_COLOR_SWATCHES}
        {...textColorPickerProps}
      />

      <MenuButtonHighlightColor
        disabled={disabled}
        swatchColors={HIGHLIGHT_COLOR_SWATCHES}
        {...highlightColorPickerProps}
      />

      <MenuDivider />

      <MenuButtonEditLink disabled={disabled} />

      <MenuButtonOrderedList disabled={disabled} />

      <MenuButtonBulletedList disabled={disabled} />

      <MenuSelectTextAlign
        sx={commonStyles}
        defaultValue="left"
        disabled={disabled}
      />

      <MenuDivider />

      <MenuButtonUndo disabled={disabled} />

      <MenuButtonRedo disabled={disabled} />

      <MenuButtonAddTable disabled={disabled} />
    </MenuControlsContainer>
  );
};

