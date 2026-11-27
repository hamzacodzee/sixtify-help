"use client";

import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

type RowActionMenuProps = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function RowActionMenu({
  onView,
  onEdit,
  onDelete,
}: RowActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onView();
          }}
          sx={{ gap: 1, fontSize: "0.875rem" }}
        >
          <VisibilityOutlinedIcon fontSize="small" />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit();
          }}
          sx={{ gap: 1, fontSize: "0.875rem" }}
        >
          <EditOutlinedIcon fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onDelete();
          }}
          sx={{ gap: 1, fontSize: "0.875rem", color: "error.main" }}
        >
          <DeleteOutlineIcon fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

