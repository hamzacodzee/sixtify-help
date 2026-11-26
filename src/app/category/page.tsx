"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, Pagination, SearchField } from "@codezee/sixtify-brahma";
import { SmartGrid } from "@codezee-org/sixtify-smartgrid";
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AppShell from "@/components/layout/AppShell";
import CategoryDialog from "@/components/category/CategoryDialog";
import { DynamicMuiIcon } from "@/components/common/IconPicker";
import { RedirectionCell } from "@/components/common/RedirectionCell";
import type { Category } from "@/types/category";
import { CATEGORY_STORAGE_KEY, DEFAULT_CATEGORIES } from "@/types/category";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_CATEGORIES;
    }
    try {
      const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);

      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const { control } = useForm<{ search: string }>({
    defaultValues: { search: "" },
  });

  const search = useWatch({ control, name: "search" }) ?? "";

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogReadOnly, setDialogReadOnly] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const [menuCategory, setMenuCategory] = useState<Category | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
    } catch {
      // Ignore storage errors
    }
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) {
      return categories;
    }

    return categories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.subCategories.some((sub) => sub.title.toLowerCase().includes(q))
    );
  }, [categories, search]);

  const handleSaveCategory = (
    data: Omit<Category, "id">,
    existingId?: string
  ) => {
    if (existingId) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === existingId ? { ...cat, ...data } : cat))
      );
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          ...data,
        },
      ]);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const safePageIndex =
    pagination.pageIndex * pagination.pageSize >= filteredCategories.length
      ? 0
      : pagination.pageIndex;

  const paginatedCategories = useMemo(
    () =>
      filteredCategories.slice(
        safePageIndex * pagination.pageSize,
        (safePageIndex + 1) * pagination.pageSize
      ),
    [filteredCategories, safePageIndex, pagination.pageSize]
  );

  return (
    <AppShell>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2.5,
          borderColor: "divider",
          backgroundColor: "background.paper",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 104px)",
        }}
      >
        <Box
          sx={{
            px: 1,
            py: 0.5,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 0.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Category
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 0.5,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: 200 } }}>
              <SearchField
                name="search"
                control={control}
                placeholder="Search"
              />
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingCategory(null);
                setDialogReadOnly(false);
                setDialogOpen(true);
              }}
              sx={{ width: { xs: "100%", sm: "auto" }, height: 34, px: 2 }}
            >
              Add Category
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <SmartGrid<Category>
            data={paginatedCategories}
            loading={false}
            totalCount={filteredCategories.length}
            height="calc(100vh - 205px)"
            enablePagination
            enablePinning
            pagination={{
              pageIndex: safePageIndex,
              pageSize: pagination.pageSize,
              pageSizeOptions: [10, 20, 50, 100],
            }}
            onPaginationChange={setPagination}
            columns={[
              {
                header: "S.No",
                size: 30,
                minSize: 30,
                maxSize: 30,
                cell: ({ row }) =>
                  safePageIndex * pagination.pageSize + row.index + 1,
              },
              {
                header: "Icon",
                accessorKey: "icon",
                size: 30,
                minSize: 30,
                maxSize: 30,
                cell: ({ row }) => (
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
                    <DynamicMuiIcon name={row.original.icon} fontSize="small" />
                  </Box>
                ),
              },
              {
                header: "Category Name",
                accessorKey: "title",
                minSize: 240,
                cell: ({ row }) => {
                  const cat = row.original;

                  return (
                    <RedirectionCell
                      mainLabel={cat.title}
                      subLabel={cat.description || "—"}
                      onClick={() => {
                        setEditingCategory(cat);
                        setDialogReadOnly(true);
                        setDialogOpen(true);
                      }}
                    />
                  );
                },
              },
              {
                header: "Sub Categories",
                accessorKey: "subCategories",
                minSize: 300,
                cell: ({ row }) => {
                  const cat = row.original;

                  if (cat.subCategories.length === 0) {
                    return (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    );
                  }

                  return (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "nowrap",
                        gap: 0.75,
                      }}
                    >
                      {cat.subCategories.slice(0, 3).map((sub) => (
                        <Chip
                          key={sub.id}
                          icon={
                            <DynamicMuiIcon name={sub.icon} fontSize="small" />
                          }
                          label={sub.title}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            backgroundColor: "#eff6ff",
                            color: "primary.main",
                            "& .MuiChip-icon": { color: "primary.main" },
                          }}
                        />
                      ))}
                      {cat.subCategories.length > 3 && (
                        <Tooltip
                          arrow
                          title={
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.75,
                              }}
                            >
                              {cat.subCategories.slice(3).map((sub) => (
                                <Chip
                                  key={sub.id}
                                  icon={
                                    <DynamicMuiIcon
                                      name={sub.icon}
                                      fontSize="small"
                                    />
                                  }
                                  label={sub.title}
                                  size="small"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: "0.75rem",
                                    backgroundColor: "#eff6ff",
                                    color: "primary.main",
                                    "& .MuiChip-icon": {
                                      color: "primary.main",
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          }
                        >
                          <Chip
                            label={`+${cat.subCategories.length - 3} more`}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              backgroundColor: "action.hover",
                              color: "text.secondary",
                              cursor: "pointer",
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  );
                },
              },
              {
                header: "",
                accessorKey: "id",
                size: 30,
                minSize: 30,
                maxSize: 30,
                pinned: "right",
                cell: ({ row }) => (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setMenuAnchorEl(e.currentTarget);
                      setMenuCategory(row.original);
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                ),
              },
            ]}
          />
          <Pagination
            count={filteredCategories.length}
            page={safePageIndex}
            rowsPerPage={pagination.pageSize}
            rowsPerPageOptions={[10, 20, 50, 100]}
            onPageChange={(_, newPage) =>
              setPagination((prev) => ({ ...prev, pageIndex: newPage }))
            }
            onRowsPerPageChange={(e) =>
              setPagination({
                pageIndex: 0,
                pageSize: Number(e.target.value),
              })
            }
          />
        </Box>
      </Paper>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            if (menuCategory) {
              setEditingCategory(menuCategory);
              setDialogReadOnly(true);
              setDialogOpen(true);
            }
            setMenuAnchorEl(null);
          }}
          sx={{ gap: 1, fontSize: "0.875rem" }}
        >
          <VisibilityOutlinedIcon fontSize="small" />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuCategory) {
              setEditingCategory(menuCategory);
              setDialogReadOnly(false);
              setDialogOpen(true);
            }
            setMenuAnchorEl(null);
          }}
          sx={{ gap: 1, fontSize: "0.875rem" }}
        >
          <EditOutlinedIcon fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuCategory) {
              handleDeleteCategory(menuCategory.id);
            }
            setMenuAnchorEl(null);
          }}
          sx={{ gap: 1, fontSize: "0.875rem", color: "error.main" }}
        >
          <DeleteOutlineIcon fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      <CategoryDialog
        open={dialogOpen}
        initialData={editingCategory}
        readOnly={dialogReadOnly}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveCategory}
      />
    </AppShell>
  );
}
