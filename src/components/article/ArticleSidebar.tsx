"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { SearchField } from "@codezee/sixtify-brahma";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { DynamicMuiIcon } from "@/components/common/IconPicker";
import type { Category } from "@/types/category";
import type { Article} from "@/types/article";
import { getStoredArticles } from "@/types/article";

type ArticleSidebarProps = {
  category: Category | null;
  activeArticleId?: string;
}

export default function ArticleSidebar({
  category,
  activeArticleId,
}: ArticleSidebarProps) {
  const { control } = useForm<{ search: string }>({
    defaultValues: { search: "" },
  });

  const filter = useWatch({ control, name: "search" }) ?? "";

  const allArticles: Article[] = useMemo(() => getStoredArticles(), []);

  const filteredSubCategories = useMemo(() => {
    if (!category) {return [];}

    const q = filter.trim().toLowerCase();

    return category.subCategories
      .map((sub) => {
        const articles = allArticles.filter(
          (a) =>
            a.categoryId === category.id &&
            a.subCategoryId === sub.id &&
            (!q || a.title.toLowerCase().includes(q))
        );

        return { ...sub, articles };
      })
      .filter((sub) => sub.articles.length > 0);
  }, [category, allArticles, filter]);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2.5,
        borderColor: "divider",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        position: { md: "sticky" },
        top: { md: 80 },
        maxHeight: { md: "calc(100vh - 104px)" },
        overflowY: "auto",
      }}
    >
      <SearchField
        name="search"
        control={control}
        placeholder="Filter articles..."
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filteredSubCategories.map((sub) => (
          <Box key={sub.id} sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 0.5 }}>
              <DynamicMuiIcon name={sub.icon} fontSize="small" color="primary" />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: "text.secondary",
                  textTransform: "uppercase",
                }}
              >
                {sub.title}
              </Typography>
            </Box>

            {sub.articles.map((item) => {
              const isActive = item.id === activeArticleId;

              return (
                <Box
                  key={item.id}
                  component={Link}
                  href={`/article?id=${item.id}`}
                  sx={{
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 1.5,
                    textDecoration: "none",
                    fontSize: "0.8125rem",
                    lineHeight: 1.45,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "primary.main" : "text.primary",
                    backgroundColor: isActive
                      ? (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(51, 153, 255, 0.14)"
                            : "#eff6ff"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  {item.title}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

