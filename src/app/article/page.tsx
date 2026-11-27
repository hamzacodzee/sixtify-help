"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@codezee/sixtify-brahma";
import {
  Box,
  Breadcrumbs,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import AppShell from "@/components/layout/AppShell";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import {
  ArticleBlockRenderer,
  StepList,
} from "@/components/article/ArticleBlockRenderer";
import { ArticleFeedbackAndRelated } from "@/components/article/ArticleFeedbackAndRelated";
import { ArticleTocSidebar } from "@/components/article/ArticleTocSidebar";
import type {
  Category} from "@/types/category";
import {
  CATEGORY_STORAGE_KEY,
  DEFAULT_CATEGORIES,
} from "@/types/category";
import type { Article } from "@/types/article";
import {
  buildDefaultArticles,
  getStoredArticles,
  incrementArticleView,
} from "@/types/article";

export default function ArticlePage() {
  const searchParams = useSearchParams();

  const articleId = searchParams.get("id") ?? "";

  const [activeSection, setActiveSection] = useState("before-you-begin");

  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const [allArticles, setAllArticles] = useState<Article[]>(() =>
    buildDefaultArticles()
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);

      if (saved) {
        setCategories(JSON.parse(saved) as Category[]);
      }
    } catch {
      // Ignore storage errors
    }
    setAllArticles(getStoredArticles());
  }, [articleId]);

  const article = useMemo(() => {
    return allArticles.find((a) => a.id === articleId) ?? allArticles[0] ?? null;
  }, [allArticles, articleId]);

  const category = useMemo(() => {
    if (!article) {return categories[0] ?? null;}

    return categories.find((c) => c.id === article.categoryId) ?? categories[0] ?? null;
  }, [categories, article]);

  const subCategory = useMemo(() => {
    if (!category || !article) {return null;}

    return category.subCategories.find((s) => s.id === article.subCategoryId) ?? null;
  }, [category, article]);

  useEffect(() => {
    if (article?.id) {
      incrementArticleView(article.id);
    }
  }, [article?.id]);

  const relatedArticles = useMemo(() => {
    if (!article || !category) {return [];}

    const subMap: Record<string, string> = {};

    for (const sub of category.subCategories) {
      subMap[sub.id] = sub.title;
    }

    return allArticles
      .filter((a) => a.categoryId === category.id && a.id !== article.id)
      .slice(0, 3)
      .map((a) => ({
        id: a.id,
        subTitle: subMap[a.subCategoryId] ?? "",
        title: a.title,
      }));
  }, [allArticles, article, category]);

  const categoryTitle = category?.title ?? "Help Center";

  const subTitle = subCategory?.title ?? "";

  if (!article) {
    return (
      <AppShell>
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 2.5, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            Article not found.
          </Typography>
        </Paper>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr", lg: "280px 1fr 220px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Left Article Sidebar */}
        <ArticleSidebar category={category} activeArticleId={article.id} />

        {/* Middle Article Content */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
          <Box>
            <Button
              component={Link}
              href={category ? `/category/${category.id}` : "/"}
              size="small"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Back to {categoryTitle}
            </Button>
          </Box>

          {/* Header & Overview */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Typography
                component={Link}
                href="/"
                variant="caption"
                color="text.secondary"
                sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Help Center
              </Typography>
              <Typography
                component={Link}
                href={category ? `/category/${category.id}` : "/"}
                variant="caption"
                color="text.secondary"
                sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                {categoryTitle}
              </Typography>
              {subTitle && (
                <Typography variant="caption" color="text.primary" sx={{ fontWeight: 600 }}>
                  {subTitle}
                </Typography>
              )}
            </Breadcrumbs>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Chip
                label={subTitle ? subTitle.toUpperCase() : "GUIDE"}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(51, 153, 255, 0.14)" : "#eff6ff",
                  color: "primary.main",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                2 min read
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "success.main" }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Verified with Sixtifi UI
                </Typography>
              </Box>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.25 }}>
              {article.title}
            </Typography>

            {(!article.blocks || article.blocks.length === 0) &&
              article.summary?.trim() && (
                <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderColor: "divider",
                  borderLeft: "4px solid",
                  borderLeftColor: "primary.main",
                  backgroundColor: "background.paper",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                <InfoOutlinedIcon color="primary" fontSize="small" sx={{ mt: 0.25 }} />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {article.summary}
                </Typography>
              </Paper>
            )}

          </Box>

          {/* Dynamic Content Blocks (when built with Block Builder) */}
          {article.blocks && article.blocks.length > 0 && (
            <ArticleBlockRenderer blocks={article.blocks} />
          )}

          {/* Before You Begin */}
          {article.prerequisites.length > 0 && (
            <Box id="before-you-begin">
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Before You Begin
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {article.prerequisites.map((item, idx) => (
                  <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckIcon fontSize="small" color="success" />
                    <Typography variant="body2" color="text.secondary">
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Key Features & Capabilities */}
          {article.features.length > 0 && (
            <Box id="key-features">
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Key Features &amp; Capabilities
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                Core functions, field definitions, and system highlights available on this page.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                  gap: 2,
                }}
              >
                {article.features.map((feat, idx) => {
                  const icons = [BoltOutlinedIcon, VerifiedUserOutlinedIcon, TuneOutlinedIcon];

                  const IconComp = icons[idx % icons.length];

                  return (
                    <Paper
                      key={idx}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        borderColor: "divider",
                        backgroundColor: "background.paper",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.25,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1.5,
                            backgroundColor: (theme) =>
                              theme.palette.mode === "dark" ? "rgba(51, 153, 255, 0.14)" : "#eff6ff",
                            color: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComp fontSize="small" />
                        </Box>
                        <Chip
                          label={feat.tag}
                          size="small"
                          sx={{ fontSize: "0.65rem", fontWeight: 700, height: 22 }}
                        />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {feat.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feat.description}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Step-by-Step Instructions */}
          {article.steps.length > 0 && (
            <Box id="steps">
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Step-by-Step Instructions
              </Typography>
              <StepList steps={article.steps} />
            </Box>
          )}

          {/* Important Notes */}
          {article.notes.length > 0 && (
            <Box id="notes">
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Important Notes
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 2,
                }}
              >
                {article.notes.map((note, idx) => (
                  <Paper
                    key={idx}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "rgba(245, 158, 11, 0.3)" : "#fde68a",
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "rgba(245, 158, 11, 0.08)" : "#fffbeb",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.25,
                    }}
                  >
                    <WarningAmberOutlinedIcon
                      fontSize="small"
                      sx={{ color: "#d97706", mt: 0.25, flexShrink: 0 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {note}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          {/* What Happens Next? */}
          {article.whatNext && (
            <Box id="what-next">
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                What Happens Next?
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderColor: "divider",
                  borderLeft: "4px solid",
                  borderLeftColor: "success.main",
                  backgroundColor: "background.paper",
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {article.whatNext}
                </Typography>
              </Paper>
            </Box>
          )}

          <ArticleFeedbackAndRelated
            articleId={article.id}
            relatedArticles={relatedArticles}
          />
        </Box>

        {/* Right: On This Page Navigation */}
        <ArticleTocSidebar
          sections={[
            ...(article.prerequisites.length > 0
              ? [{ id: "before-you-begin", label: "Before You Begin" }]
              : []),
            ...(article.features.length > 0
              ? [{ id: "key-features", label: "Key Features" }]
              : []),
            ...(article.steps.length > 0
              ? [{ id: "steps", label: "Step-by-Step Instructions" }]
              : []),
            ...(article.notes.length > 0
              ? [{ id: "notes", label: "Important Notes" }]
              : []),
            ...(article.whatNext
              ? [{ id: "what-next", label: "What Happens Next?" }]
              : []),
            ...(relatedArticles.length > 0
              ? [{ id: "related", label: "Related Articles" }]
              : []),
          ]}
          activeSection={activeSection}
          onSelectSection={setActiveSection}
        />
      </Box>
    </AppShell>
  );
}
