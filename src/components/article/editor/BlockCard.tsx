"use client";

import React from "react";
import type { Control } from "react-hook-form";
import { Button, TextField, Tooltip } from "@codezee/sixtify-brahma";
import {
  Box,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NotesIcon from "@mui/icons-material/Notes";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { DynamicRichTextEditor } from "@/components/common/RichTextEditor/DynamicRichTextEditor";
import type { ArticleBlock } from "@/types/article";
import { type ArticleEditorFormValues, BLOCK_TYPES } from "./blockConstants";
import { CardsBlockEditor } from "./CardsBlockEditor";
import { ImageBlockEditor } from "./ImageBlockEditor";

type BlockCardProps = {
  block: ArticleBlock;
  index: number;
  totalBlocks: number;
  control: Control<ArticleEditorFormValues>;
  readOnly: boolean;
  onMoveBlock: (index: number, direction: -1 | 1) => void;
  onRemoveBlock: (id: string) => void;
  onUpdateBlock: (id: string, patch: Partial<ArticleBlock>) => void;
};

export function BlockCard({
  block,
  index,
  totalBlocks,
  control,
  readOnly,
  onMoveBlock,
  onRemoveBlock,
  onUpdateBlock,
}: BlockCardProps) {
  const blockMeta = BLOCK_TYPES.find((bt) => bt.type === block.type);

  const BlockIcon = blockMeta?.icon ?? NotesIcon;

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderColor: "divider",
        overflow: "hidden",
        flexShrink: 0,
        transition: "border-color 0.15s ease",
        "&:hover": {
          borderColor: "primary.light",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1.5,
          py: 0.625,
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            px: 1,
            py: 0.25,
            borderRadius: 1.25,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(51, 153, 255, 0.14)"
                : "#eff6ff",
            color: "primary.main",
          }}
        >
          <BlockIcon sx={{ fontSize: 14 }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: "0.6875rem",
              letterSpacing: 0.5,
              lineHeight: 1.2,
            }}
          >
            {block.type.toUpperCase()}
          </Typography>
        </Box>
        {!readOnly && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Tooltip toolTipLabel="Move Up">
              <span>
                <IconButton
                  size="small"
                  disabled={index === 0}
                  onClick={() => onMoveBlock(index, -1)}
                  sx={{ p: 0.4 }}
                >
                  <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip toolTipLabel="Move Down">
              <span>
                <IconButton
                  size="small"
                  disabled={index === totalBlocks - 1}
                  onClick={() => onMoveBlock(index, 1)}
                  sx={{ p: 0.4 }}
                >
                  <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip toolTipLabel="Delete Block">
              <IconButton
                size="small"
                color="error"
                onClick={() => onRemoveBlock(block.id)}
                sx={{ p: 0.4 }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 1.5 }}>
        {block.type === "paragraph" && (
          <DynamicRichTextEditor
            name={`blocks.${index}.content`}
            control={control}
            isEditable={!readOnly}
            showMenuBar={!readOnly}
            placeholder="Write paragraph text..."
          />
        )}

        {block.type === "step" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              name={`blocks.${index}.title`}
              control={control}
              disabled={readOnly}
              placeholder="Section title (e.g. Step-by-Step)"
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              {(block.items ?? [""]).map((_, stepIdx) => (
                <Box
                  key={stepIdx}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(51, 153, 255, 0.16)"
                          : "#eff6ff",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {stepIdx + 1}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <TextField
                      name={`blocks.${index}.items.${stepIdx}`}
                      control={control}
                      disabled={readOnly}
                      fullWidth
                      placeholder={`Step ${stepIdx + 1} description...`}
                    />
                  </Box>
                  {!readOnly && (block.items ?? [""]).length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      sx={{ p: 0.4 }}
                      onClick={() => {
                        const next = (block.items ?? [""]).filter(
                          (_, i) => i !== stepIdx
                        );

                        onUpdateBlock(block.id, { items: next });
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                </Box>
              ))}
              {!readOnly && (
                <Box sx={{ pt: 0.25 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon sx={{ fontSize: 15 }} />}
                    onClick={() =>
                      onUpdateBlock(block.id, {
                        items: [...(block.items ?? []), ""],
                      })
                    }
                    sx={{
                      fontSize: "0.75rem",
                      py: 0.3,
                      px: 1,
                      borderRadius: 1.5,
                    }}
                  >
                    Add Step
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {block.type === "callout" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Select
                size="small"
                disabled={readOnly}
                value={block.variant ?? "info"}
                onChange={(e) =>
                  onUpdateBlock(block.id, {
                    variant: e.target.value as "info" | "warning" | "success",
                  })
                }
                renderValue={(val) => {
                  if (val === "warning") {
                    return (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <WarningAmberOutlinedIcon
                          sx={{ fontSize: 18, color: "#d97706" }}
                        />
                      </Box>
                    );
                  }

                  if (val === "success") {
                    return (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CheckCircleOutlineIcon
                          sx={{ fontSize: 18, color: "#16a34a" }}
                        />
                      </Box>
                    );
                  }

                  return (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <InfoOutlinedIcon
                        sx={{ fontSize: 18, color: "#0284c7" }}
                      />
                    </Box>
                  );
                }}
                sx={{
                  width: 64,
                  flexShrink: 0,
                  "& .MuiSelect-select": {
                    py: 0.75,
                    pl: 1.25,
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              >
                <MenuItem value="info" sx={{ gap: 1, fontSize: "0.8125rem" }}>
                  <InfoOutlinedIcon sx={{ fontSize: 18, color: "#0284c7" }} />
                  Info
                </MenuItem>
                <MenuItem
                  value="warning"
                  sx={{ gap: 1, fontSize: "0.8125rem" }}
                >
                  <WarningAmberOutlinedIcon
                    sx={{ fontSize: 18, color: "#d97706" }}
                  />
                  Warning
                </MenuItem>
                <MenuItem
                  value="success"
                  sx={{ gap: 1, fontSize: "0.8125rem" }}
                >
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 18, color: "#16a34a" }}
                  />
                  Success
                </MenuItem>
              </Select>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <TextField
                  name={`blocks.${index}.title`}
                  control={control}
                  disabled={readOnly}
                  fullWidth
                  placeholder="Callout title (optional)"
                />
              </Box>
            </Box>
            <TextField
              name={`blocks.${index}.content`}
              control={control}
              disabled={readOnly}
              multiline
              rows={2}
              placeholder="Callout message..."
            />
          </Box>
        )}

        {block.type === "image" && (
          <ImageBlockEditor
            block={block}
            index={index}
            control={control}
            readOnly={readOnly}
            onUpdateBlock={onUpdateBlock}
          />
        )}

        {block.type === "faq" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              name={`blocks.${index}.question`}
              control={control}
              disabled={readOnly}
              placeholder="Question"
            />
            <TextField
              name={`blocks.${index}.answer`}
              control={control}
              disabled={readOnly}
              multiline
              rows={2}
              placeholder="Answer"
            />
          </Box>
        )}

        {block.type === "cards" && (
          <CardsBlockEditor
            block={block}
            index={index}
            control={control}
            readOnly={readOnly}
            onUpdateBlock={onUpdateBlock}
          />
        )}
      </Box>
    </Paper>
  );
}

