"use client";

import React, { useEffect, useState } from "react";
import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Box, TextField, Typography } from "@mui/material";
import IconPicker from "@/components/common/IconPicker";
import type { SubCategory } from "@/types/category";

type SubCategoryDialogProps = {
  open: boolean;
  initialData?: SubCategory | null;
  onClose: () => void;
  onSave: (data: Omit<SubCategory, "id">, existingId?: string) => void;
};

export default function SubCategoryDialog({
  open,
  initialData,
  onClose,
  onSave,
}: SubCategoryDialogProps) {
  const [icon, setIcon] = useState("Category");

  const [title, setTitle] = useState("");

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setIcon(initialData?.icon || "Category");
      setTitle(initialData?.title || "");
      setSubmitted(false);
    }
  }, [open, initialData]);

  const isTitleValid = title.trim().length > 0;

  const isIconValid = icon.trim().length > 0;

  const handleSave = () => {
    setSubmitted(true);

    if (!isTitleValid || !isIconValid) {
      return;
    }
    onSave({ icon, title: title.trim() }, initialData?.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      title={initialData ? "Edit Sub Category" : "Add Sub Category"}
      actions={
        <>
          <Button variant="outlined" onClick={onClose} size="small">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            size="small"
            disabled={!isTitleValid || !isIconValid}
          >
            Save
          </Button>
        </>
      }
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "96px 1fr" },
          gap: 2,
          mt: 0.5,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{ mb: 0.5, display: "block", fontWeight: 600 }}
          >
            Icon <span style={{ color: "#ef4444" }}>*</span>
          </Typography>
          <IconPicker
            value={icon}
            onChange={setIcon}
            error={submitted && !isIconValid}
          />
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{ mb: 0.5, display: "block", fontWeight: 600 }}
          >
            Title <span style={{ color: "#ef4444" }}>*</span>
          </Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="e.g. Account Setup"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={submitted && !isTitleValid}
            helperText={
              submitted && !isTitleValid ? "Title is required" : undefined
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
