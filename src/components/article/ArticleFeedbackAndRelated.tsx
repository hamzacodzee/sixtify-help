"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@codezee/sixtify-brahma";
import { Box, Paper, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { incrementArticleHelpful } from "@/types/article";

type RelatedArticleItem = {
  id: string;
  subTitle: string;
  title: string;
};

type ArticleFeedbackAndRelatedProps = {
  articleId: string;
  relatedArticles: RelatedArticleItem[];
};

export function ArticleFeedbackAndRelated({
  articleId,
  relatedArticles,
}: ArticleFeedbackAndRelatedProps) {
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null);

  return (
    <>
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
              incrementArticleHelpful(articleId);
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700, letterSpacing: 0.5 }}
                    noWrap
                  >
                    {item.subTitle}
                  </Typography>
                  <ArrowForwardIcon
                    fontSize="small"
                    color="action"
                    sx={{ fontSize: 16 }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{ fontWeight: 600 }}
                >
                  {item.title}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
}

