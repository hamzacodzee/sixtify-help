"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@codezee/sixtify-brahma";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import AppShell from "@/components/layout/AppShell";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import type {
  Category} from "@/types/category";
import {
  CATEGORY_STORAGE_KEY,
  DEFAULT_CATEGORIES,
} from "@/types/category";
import {
  getStoredArticles,
  incrementArticleHelpful,
  incrementArticleView,
} from "@/types/article";

export default function ArticlePage() {
  const searchParams = useSearchParams();

  const articleId = searchParams.get("id") ?? "";

  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null);

  const [activeSection, setActiveSection] = useState("before-you-begin");

  const [copied, setCopied] = useState(false);

  const categories = useMemo(() => {
    if (typeof window === "undefined") {return DEFAULT_CATEGORIES;}
    try {
      const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);

      return saved ? (JSON.parse(saved) as Category[]) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }, []);

  const allArticles = useMemo(() => getStoredArticles(), []);

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

            <Typography variant="caption" color="text.secondary">
              <strong>Who can use this:</strong> Access depends on your company&apos;s role permissions.
            </Typography>
          </Box>

          {/* Dynamic Content Blocks (when built with Block Builder) */}
          {article.blocks && article.blocks.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {article.blocks.map((block) => {
                if (block.type === "paragraph") {
                  return (
                    <Typography key={block.id} variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>
                      {block.content}
                    </Typography>
                  );
                }

                if (block.type === "checklist") {
                  return (
                    <Box key={block.id}>
                      {block.title && (
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                          {block.title}
                        </Typography>
                      )}
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {(block.items ?? []).filter(Boolean).map((item, idx) => (
                          <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CheckIcon fontSize="small" color="success" />
                            <Typography variant="body2" color="text.secondary">
                              {item}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  );
                }

                if (block.type === "step") {
                  return (
                    <Box key={block.id}>
                      {block.title && (
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                          {block.title}
                        </Typography>
                      )}
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        {(block.items ?? []).filter(Boolean).map((step, idx) => (
                          <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                backgroundColor: "primary.main",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {idx + 1}
                            </Box>
                            <Paper variant="outlined" sx={{ flex: 1, p: 1.75, borderRadius: 2, borderColor: "divider" }}>
                              <Typography variant="body2">{step}</Typography>
                            </Paper>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  );
                }

                if (block.type === "callout") {
                  const isWarn = block.variant === "warning";

                  const isSuccess = block.variant === "success";

                  return (
                    <Paper
                      key={block.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        borderColor: isWarn ? "#fde68a" : isSuccess ? "success.main" : "divider",
                        borderLeft: "4px solid",
                        borderLeftColor: isWarn ? "#d97706" : isSuccess ? "success.main" : "primary.main",
                        backgroundColor: isWarn
                          ? (theme) => (theme.palette.mode === "dark" ? "rgba(245, 158, 11, 0.08)" : "#fffbeb")
                          : "background.paper",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.25,
                      }}
                    >
                      {isWarn ? (
                        <WarningAmberOutlinedIcon fontSize="small" sx={{ color: "#d97706", mt: 0.25 }} />
                      ) : (
                        <InfoOutlinedIcon color={isSuccess ? "success" : "primary"} fontSize="small" sx={{ mt: 0.25 }} />
                      )}
                      <Box>
                        {block.title && (
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {block.title}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, whiteSpace: "pre-line" }}>
                          {block.content}
                        </Typography>
                      </Box>
                    </Paper>
                  );
                }

                if (block.type === "code") {
                  return (
                    <Paper
                      key={block.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        borderColor: "divider",
                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#0b0e14" : "#f1f5f9"),
                        overflowX: "auto",
                      }}
                    >
                      <Typography component="pre" sx={{ m: 0, fontFamily: "monospace", fontSize: "0.8125rem" }}>
                        {block.content}
                      </Typography>
                    </Paper>
                  );
                }

                if (block.type === "image" && block.imageUrl) {
                  return (
                    <Paper key={block.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2, borderColor: "divider" }}>
                      <Box
                        component="img"
                        src={block.imageUrl}
                        alt={block.caption || "Article image"}
                        sx={{ width: "100%", borderRadius: 1.5, display: "block" }}
                      />
                      {block.caption && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                          {block.caption}
                        </Typography>
                      )}
                    </Paper>
                  );
                }

                if (block.type === "faq") {
                  return (
                    <Accordion key={block.id} variant="outlined" sx={{ borderRadius: "8px !important", "&:before": { display: "none" } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {block.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary">
                          {block.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                }

                if (block.type === "table") {
                  return (
                    <TableContainer key={block.id} component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {(block.headers ?? []).map((h, i) => (
                              <TableCell key={i}>{h}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(block.rows ?? []).map((row, rIdx) => (
                            <TableRow key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <TableCell key={cIdx}>{cell}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  );
                }

                return null;
              })}
            </Box>
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {article.steps.map((step, idx) => (
                  <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Paper
                      variant="outlined"
                      sx={{
                        flex: 1,
                        p: 1.75,
                        borderRadius: 2,
                        borderColor: "divider",
                        backgroundColor: "background.paper",
                      }}
                    >
                      <Typography variant="body2" color="text.primary">
                        {step}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
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

          {/* Was this article helpful? */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              borderColor: "divider",
              backgroundColor: "background.paper",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {helpful
                ? helpful === "yes"
                  ? "Thanks for your feedback!"
                  : "Thanks! We'll work on improving this article."
                : "Was this article helpful?"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                size="small"
                variant={helpful === "yes" ? "contained" : "outlined"}
                startIcon={<ThumbUpOutlinedIcon fontSize="small" />}
                onClick={() => {
                  setHelpful("yes");
                  incrementArticleHelpful(article.id);
                }}
              >
                Yes, helpful
              </Button>
              <Button
                size="small"
                variant={helpful === "no" ? "contained" : "outlined"}
                startIcon={<ThumbDownOutlinedIcon fontSize="small" />}
                onClick={() => setHelpful("no")}
              >
                Not really
              </Button>
            </Box>
          </Paper>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <Box id="related">
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                Related Articles
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                  gap: 2,
                }}
              >
                {relatedArticles.map((item) => (
                  <Paper
                    key={item.id}
                    component={Link}
                    href={`/article?id=${item.id}`}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      borderColor: "divider",
                      backgroundColor: "background.paper",
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 700, letterSpacing: 0.5 }}
                        noWrap
                      >
                        {item.subTitle}
                      </Typography>
                      <ArrowForwardIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
                    </Box>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Right: On This Page Navigation */}
        <Paper
          variant="outlined"
          sx={{
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            gap: 1.5,
            p: 2,
            borderRadius: 2.5,
            borderColor: "divider",
            backgroundColor: "background.paper",
            position: "sticky",
            top: 80,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 700, letterSpacing: 0.8 }}
          >
            ON THIS PAGE
          </Typography>

          <Box sx={{ borderLeft: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column" }}>
            {[
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
            ].map((sec) => {
              const isActive = activeSection === sec.id;

              return (
                <Box
                  key={sec.id}
                  component="a"
                  href={`#${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  sx={{
                    pl: 1.5,
                    py: 0.6,
                    ml: "-1px",
                    borderLeft: "2px solid",
                    borderColor: isActive ? "primary.main" : "transparent",
                    textDecoration: "none",
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "primary.main" : "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {sec.label}
                </Box>
              );
            })}
          </Box>

          <Divider />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              startIcon={<ContentCopyOutlinedIcon fontSize="small" />}
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              sx={{ justifyContent: "flex-start" }}
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              startIcon={<PrintOutlinedIcon fontSize="small" />}
              onClick={() => window.print()}
              sx={{ justifyContent: "flex-start" }}
            >
              Print
            </Button>
          </Box>
        </Paper>
      </Box>
    </AppShell>
  );
}
