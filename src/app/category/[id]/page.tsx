"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@codezee/sixtify-brahma";
import { useParams } from "next/navigation";
import {
  Box,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AppShell from "@/components/layout/AppShell";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import { DynamicMuiIcon } from "@/components/common/IconPicker";
import type {
  Category} from "@/types/category";
import {
  CATEGORY_STORAGE_KEY,
  DEFAULT_CATEGORIES,
} from "@/types/category";
import { getStoredArticles } from "@/types/article";

export default function CategoryDetailPage() {
  const params = useParams<{ id: string }>();

  const category = useMemo(() => {
    let list: Category[] = DEFAULT_CATEGORIES;

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);

        if (saved) {
          list = JSON.parse(saved);
        }
      } catch {
        // Ignore storage errors
      }
    }

    return list.find((c) => c.id === params.id) ?? null;
  }, [params.id]);

  const allArticles = useMemo(() => getStoredArticles(), []);

  const allFaqs = useMemo(() => {
    if (!category) {return [];}

    const subMap: Record<string, string> = {};

    for (const sub of category.subCategories) {
      subMap[sub.id] = sub.title;
    }

    return allArticles
      .filter((a) => a.categoryId === category.id)
      .map((a) => ({
        ...a,
        subTitle: subMap[a.subCategoryId] ?? "",
      }));
  }, [category, allArticles]);

  return (
    <AppShell>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <ArticleSidebar category={category} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        <Box>
          <Button
            component={Link}
            href="/"
            size="small"
            startIcon={<ArrowBackIcon fontSize="small" />}
            sx={{ mb: 1.5 }}
          >
            Back to Home
          </Button>

          {category ? (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2.5,
                borderColor: "divider",
                backgroundColor: "background.paper",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(51, 153, 255, 0.14)"
                      : "#eff6ff",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <DynamicMuiIcon name={category.icon} fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {category.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description || "Browse sub categories below."}
                </Typography>
              </Box>
            </Paper>
          ) : (
            <Paper
              variant="outlined"
              sx={{ p: 4, borderRadius: 2.5, borderColor: "divider", textAlign: "center" }}
            >
              <Typography variant="body1" color="text.secondary">
                Category not found.
              </Typography>
            </Paper>
          )}
        </Box>

        {category && (
          <>
            {/* Sub Categories Grid with FAQ Questions inside each tile */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Sub Categories ({category.subCategories.length})
              </Typography>

              {category.subCategories.length === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{ p: 4, borderRadius: 2.5, borderColor: "divider", textAlign: "center" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No sub categories found.
                  </Typography>
                </Paper>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {category.subCategories.map((sub) => {
                    const subFaqs = allArticles.filter(
                      (a) => a.categoryId === category.id && a.subCategoryId === sub.id
                    );

                    return (
                      <Paper
                        key={sub.id}
                        variant="outlined"
                        sx={{
                          p: 2.5,
                          borderRadius: 2.5,
                          borderColor: "divider",
                          backgroundColor: "background.paper",
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2,
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(51, 153, 255, 0.14)"
                                  : "#eff6ff",
                              color: "primary.main",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <DynamicMuiIcon name={sub.icon} fontSize="small" />
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {sub.title}
                          </Typography>
                        </Box>

                        <Divider />

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                          {subFaqs.map((faq) => (
                            <Box
                              key={faq.id}
                              component={Link}
                              href={`/article?id=${faq.id}`}
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1,
                                py: 0.5,
                                px: 0.75,
                                borderRadius: 1.5,
                                textDecoration: "none",
                                color: "text.secondary",
                                transition: "background-color 0.15s, color 0.15s",
                                "&:hover": {
                                  backgroundColor: "action.hover",
                                  color: "primary.main",
                                },
                              }}
                            >
                              <ArticleOutlinedIcon
                                fontSize="small"
                                sx={{ fontSize: 16, mt: 0.25, flexShrink: 0 }}
                              />
                              <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                                {faq.title}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </Box>

            {/* All FAQs Section */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                All FAQs ({allFaqs.length})
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2.5,
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                  overflow: "hidden",
                }}
              >
                {allFaqs.map((faq, idx) => (
                  <Box
                    key={faq.id}
                    component={Link}
                    href={`/article?id=${faq.id}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      px: 2.5,
                      py: 1.5,
                      textDecoration: "none",
                      color: "text.primary",
                      borderBottom: idx < allFaqs.length - 1 ? "1px solid" : "none",
                      borderColor: "divider",
                      transition: "background-color 0.15s",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        color: "primary.main",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <ArticleOutlinedIcon fontSize="small" color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {faq.title}
                      </Typography>
                    </Box>
                    <ChevronRightIcon fontSize="small" color="action" />
                  </Box>
                ))}
              </Paper>
            </Box>
          </>
        )}
        </Box>
      </Box>
    </AppShell>
  );
}
