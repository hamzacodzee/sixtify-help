"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@codezee/sixtify-brahma";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import IconPicker, { DynamicMuiIcon } from "@/components/common/IconPicker";
import SubCategoryDialog from "./SubCategoryDialog";
import type { Category, SubCategory } from "@/types/category";

type CategoryDialogProps = {
  open: boolean;
  initialData?: Category | null;
  readOnly?: boolean;
  onClose: () => void;
  onSave: (data: Omit<Category, "id">, existingId?: string) => void;
}

export default function CategoryDialog({
  open,
  initialData,
  readOnly = false,
  onClose,
  onSave,
}: CategoryDialogProps) {
  const [icon, setIcon] = useState("Category");

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [submitted, setSubmitted] = useState(false);

  const [subDialogOpen, setSubDialogOpen] = useState(false);

  const [editingSub, setEditingSub] = useState<SubCategory | null>(null);

  useEffect(() => {
    if (open) {
      setIcon(initialData?.icon || "Category");
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setSubCategories(initialData?.subCategories || []);
      setSubmitted(false);
    }
  }, [open, initialData]);

  const isTitleValid = title.trim().length > 0;

  const isIconValid = icon.trim().length > 0;

  const handleSaveCategory = () => {
    setSubmitted(true);

    if (!isTitleValid || !isIconValid) {return;}

    onSave(
      {
        icon,
        title: title.trim(),
        description: description.trim(),
        subCategories,
      },
      initialData?.id
    );
    onClose();
  };

  const handleSaveSubCategory = (
    data: Omit<SubCategory, "id">,
    existingId?: string
  ) => {
    if (existingId) {
      setSubCategories((prev) =>
        prev.map((item) =>
          item.id === existingId ? { ...item, ...data } : item
        )
      );
    } else {
      setSubCategories((prev) => [
        ...prev,
        { id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ...data },
      ]);
    }
  };

  const handleDeleteSubCategory = (id: string) => {
    setSubCategories((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1.5,
            px: 3,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Typography variant="subtitle1" component="span" sx={{ fontWeight: 600 }}>
            {readOnly
              ? "View Category"
              : initialData
                ? "Edit Category"
                : "Add Category"}
          </Typography>
          <IconButton size="small" onClick={onClose} color="primary">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 0.5 }}>
            {/* Top Row: Icon + Title */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "96px 1fr" },
                gap: 2,
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
                  disabled={readOnly}
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
                  disabled={readOnly}
                  placeholder="e.g. Getting Started"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={submitted && !isTitleValid}
                  helperText={
                    submitted && !isTitleValid ? "Title is required" : undefined
                  }
                />
              </Box>
            </Box>

            {/* Description */}
            <Box>
              <Typography
                variant="caption"
                sx={{ mb: 0.5, display: "block", fontWeight: 600 }}
              >
                Description
              </Typography>
              <TextField
                size="small"
                fullWidth
                multiline
                rows={2}
                disabled={readOnly}
                placeholder="e.g. Guides and tutorials to help you get started quickly"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>

            {/* Embedded Sub Categories Section */}
            <Paper
              variant="outlined"
              sx={{ borderRadius: 2, overflow: "hidden", borderColor: "divider" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Sub Categories
                </Typography>
                {!readOnly && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon fontSize="small" />}
                    onClick={() => {
                      setEditingSub(null);
                      setSubDialogOpen(true);
                    }}
                  >
                    Add Sub Category
                  </Button>
                )}
              </Box>

              <TableContainer sx={{ maxHeight: 240 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell width={70}>S.No</TableCell>
                      <TableCell width={90}>Icon</TableCell>
                      <TableCell>Title</TableCell>
                      {!readOnly && (
                        <TableCell width={110} align="right">
                          Actions
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                          <Typography variant="body2" color="text.secondary">
                            No Data Found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      subCategories.map((sub, index) => (
                        <TableRow key={sub.id} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1.5,
                                backgroundColor: "#eff6ff",
                                color: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <DynamicMuiIcon name={sub.icon} fontSize="small" />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {sub.title}
                            </Typography>
                          </TableCell>
                          {!readOnly && (
                            <TableCell align="right">
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setEditingSub(sub);
                                    setSubDialogOpen(true);
                                  }}
                                >
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteSubCategory(sub.id)}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{ px: 3, py: 1.5, borderTop: "1px solid #e2e8f0", gap: 1 }}
        >
          <Button variant="outlined" onClick={onClose} size="small">
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly && (
            <Button
              variant="contained"
              onClick={handleSaveCategory}
              size="small"
              disabled={!isTitleValid || !isIconValid}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <SubCategoryDialog
        open={subDialogOpen}
        initialData={editingSub}
        onClose={() => setSubDialogOpen(false)}
        onSave={handleSaveSubCategory}
      />
    </>
  );
}
