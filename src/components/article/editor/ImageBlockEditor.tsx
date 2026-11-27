"use client";

import React, { useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { Button, TextField } from "@codezee/sixtify-brahma";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import type { ArticleBlock } from "@/types/article";
import type { ArticleEditorFormValues } from "./blockConstants";

type ImageBlockEditorProps = {
  block: ArticleBlock;
  index: number;
  control: Control<ArticleEditorFormValues>;
  readOnly: boolean;
  onUpdateBlock: (id: string, patch: Partial<ArticleBlock>) => void;
};

export function ImageBlockEditor({
  block,
  index,
  control,
  readOnly,
  onUpdateBlock,
}: ImageBlockEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpdateBlock(block.id, { imageUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const files = Array.from(e.clipboardData?.files ?? []);

    const imageFile = files.find((f) => f.type.startsWith("image/"));

    if (imageFile) {
      e.preventDefault();
      handleImageFile(imageFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer?.files ?? []);

    const imageFile = files.find((f) => f.type.startsWith("image/"));

    if (imageFile) {
      handleImageFile(imageFile);
    }
  };

  return (
    <Box
      onPaste={!readOnly ? handlePaste : undefined}
      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1.5fr 1fr" },
          gap: 1,
        }}
      >
        <TextField
          name={`blocks.${index}.imageUrl`}
          control={control}
          disabled={readOnly}
          fullWidth
          placeholder="Paste image URL (https://...) or Ctrl+V image"
        />
        <TextField
          name={`blocks.${index}.caption`}
          control={control}
          disabled={readOnly}
          fullWidth
          placeholder="Image caption (optional)"
        />
      </Box>

      {!readOnly && (
        <Box
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: "1px dashed",
            borderColor: isDragging ? "primary.main" : "divider",
            borderRadius: 1.5,
            px: 1.5,
            py: 1.25,
            backgroundColor: isDragging
              ? "action.hover"
              : "background.default",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            cursor: "pointer",
            transition: "border-color 0.15s ease, background-color 0.15s ease",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CloudUploadOutlinedIcon
              fontSize="small"
              sx={{ color: "text.secondary" }}
            />
            <Typography variant="caption" color="text.secondary">
              Drop an image, paste from clipboard (Ctrl+V), or browse file
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            component="span"
            sx={{
              fontSize: "0.75rem",
              py: 0.25,
              px: 1,
              borderRadius: 1.5,
              flexShrink: 0,
            }}
          >
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                handleImageFile(file);
              }
              e.target.value = "";
            }}
          />
        </Box>
      )}

      {block.imageUrl && (
        <Box
          sx={{
            position: "relative",
            alignSelf: "flex-start",
            maxWidth: "100%",
          }}
        >
          <Box
            component="img"
            src={block.imageUrl}
            alt={block.caption || "Article image"}
            sx={{
              maxHeight: 200,
              maxWidth: "100%",
              objectFit: "contain",
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              display: "block",
            }}
          />
          {!readOnly && (
            <IconButton
              size="small"
              onClick={() => onUpdateBlock(block.id, { imageUrl: "" })}
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                p: 0.35,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "error.light", color: "#fff" },
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
}
