"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Autocomplete, Button, Pagination, SearchField } from "@codezee/sixtify-brahma";
import { SmartGrid } from "@codezee-org/sixtify-smartgrid";
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AppShell from "@/components/layout/AppShell";
import { RedirectionCell } from "@/components/common/RedirectionCell";
import type { Article } from "@/types/article";
import { getStoredArticles, saveStoredArticles } from "@/types/article";
import type { Category } from "@/types/category";
import { CATEGORY_STORAGE_KEY, DEFAULT_CATEGORIES } from "@/types/category";

export default function ArticlesPage() {
  const [categories] = useState<Category[]>(() => {
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

  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>(() =>
    getStoredArticles()
  );

  const { control } = useForm<{ search: string; categoryId: string }>({
    defaultValues: { search: "", categoryId: "all" },
  });

  const search = useWatch({ control, name: "search" }) ?? "";

  const filterCategoryId = useWatch({ control, name: "categoryId" }) ?? "all";

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const [menuArticle, setMenuArticle] = useState<Article | null>(null);

  useEffect(() => {
    saveStoredArticles(articles);
  }, [articles]);

  const categoryMap = useMemo(() => {
    const map: Record<string, { title: string; subs: Record<string, string> }> =
      {};

    for (const cat of categories) {
      const subs: Record<string, string> = {};

      for (const sub of cat.subCategories) {
        subs[sub.id] = sub.title;
      }
      map[cat.id] = { title: cat.title, subs };
    }

    return map;
  }, [categories]);

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();

    return articles.filter((art) => {
      if (filterCategoryId !== "all" && art.categoryId !== filterCategoryId) {
        return false;
      }

      if (!q) {
        return true;
      }

      return (
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q)
      );
    });
  }, [articles, search, filterCategoryId]);

  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const safePageIndex =
    pagination.pageIndex * pagination.pageSize >= filteredArticles.length
      ? 0
      : pagination.pageIndex;

  const paginatedArticles = useMemo(
    () =>
      filteredArticles.slice(
        safePageIndex * pagination.pageSize,
        (safePageIndex + 1) * pagination.pageSize
      ),
    [filteredArticles, safePageIndex, pagination.pageSize]
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
            gap: "5px",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Articles ({filteredArticles.length})
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "5px",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: 180 } }}>
              <Autocomplete
                name="categoryId"
                control={control}
                disableClearable
                options={[
                  { label: "All Categories", value: "all" },
                  ...categories.map((cat) => ({
                    label: cat.title,
                    value: cat.id,
                  })),
                ]}
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: 200 } }}>
              <SearchField
                name="search"
                control={control}
                placeholder="Search articles..."
              />
            </Box>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => router.push("/articles/editor")}
              sx={{ width: { xs: "100%", sm: "auto" }, height: 34, px: 2 }}
            >
              Add Article
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <SmartGrid<Article>
            data={paginatedArticles}
            loading={false}
            totalCount={filteredArticles.length}
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
                header: "Article Title",
                accessorKey: "title",
                minSize: 280,
                cell: ({ row }) => {
                  const data = row.original;

                  return (
                    <RedirectionCell
                      mainLabel={data.title}
                      subLabel={data.summary}
                      href={`/articles/editor?id=${data.id}&mode=view`}
                    />
                  );
                },
              },
              {
                header: "Category",
                accessorKey: "categoryId",
                size: 160,
                cell: ({ row }) => {
                  const cat = categoryMap[row.original.categoryId];

                  return (
                    <Chip
                      label={cat?.title ?? "—"}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                    />
                  );
                },
              },
              {
                header: "Sub Category",
                accessorKey: "subCategoryId",
                size: 180,
                cell: ({ row }) => {
                  const cat = categoryMap[row.original.categoryId];

                  return cat?.subs[row.original.subCategoryId] ?? "—";
                },
              },
              {
                header: "Views",
                accessorKey: "viewCount",
                size: 90,
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
                      setMenuArticle(row.original);
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                ),
              },
            ]}
          />
          <Pagination
            count={filteredArticles.length}
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
            if (menuArticle) {
              router.push(`/articles/editor?id=${menuArticle.id}&mode=view`);
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
            if (menuArticle) {
              router.push(`/articles/editor?id=${menuArticle.id}`);
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
            if (menuArticle) {
              handleDeleteArticle(menuArticle.id);
            }
            setMenuAnchorEl(null);
          }}
          sx={{ gap: 1, fontSize: "0.875rem", color: "error.main" }}
        >
          <DeleteOutlineIcon fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
    </AppShell>
  );
}
