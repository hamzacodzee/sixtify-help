"use client";

import React from "react";
import {
  Box,
  Breadcrumbs,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import type { ArticleBlock } from "@/types/article";
import { ArticleBlockRenderer } from "@/components/article/ArticleBlockRenderer";

type ArticlePreviewPaneProps = {
  categoryTitle: string;
  subCategoryTitle?: string;
  title: string;
  legacySummary?: string;
  blocks: ArticleBlock[];
};

export function ArticlePreviewPane({
  categoryTitle,
  subCategoryTitle,
  title,
  legacySummary,
  blocks,
}: ArticlePreviewPaneProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        flex: 1,
        minWidth: 0,
        borderRadius: 2,
        borderColor: "divider",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        overflowY: "auto",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Typography variant="caption" color="text.secondary">
            Help Center
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {categoryTitle}
          </Typography>
          {subCategoryTitle && (
            <Typography
              variant="caption"
              color="text.primary"
              sx={{ fontWeight: 600 }}
            >
              {subCategoryTitle}
            </Typography>
          )}
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={subCategoryTitle?.toUpperCase() || "GUIDE"}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.7rem",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(51, 153, 255, 0.14)"
                  : "#eff6ff",
              color: "primary.main",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            2 min read
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "success.main",
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Verified with Sixtifi UI
            </Typography>
          </Box>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.25 }}>
          {title.trim() || "Untitled Article"}
        </Typography>

        {blocks.length === 0 && legacySummary?.trim() && (
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
            <InfoOutlinedIcon
              color="primary"
              fontSize="small"
              sx={{ mt: 0.25 }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              {legacySummary}
            </Typography>
          </Paper>
        )}
      </Box>

      {blocks.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Nothing to preview yet. Add content blocks to see a live preview.
          </Typography>
        </Box>
      ) : (
        <ArticleBlockRenderer blocks={blocks} />
      )}
    </Paper>
  );
}
