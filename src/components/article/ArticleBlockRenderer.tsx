"use client";

import React from "react";
import { alpha } from "@mui/material/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { DynamicMuiIcon } from "@/components/common/IconPicker";
import type { ArticleBlock } from "@/types/article";

type StepListProps = {
  steps: string[];
};

export function StepList({ steps }: StepListProps) {
  const validSteps = steps.filter(Boolean);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {validSteps.map((step, idx) => {
        const isLast = idx === validSteps.length - 1;

        return (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "stretch",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  mt: 0.5,
                  borderRadius: "50%",
                  backgroundColor: "primary.main",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                {idx + 1}
              </Box>
              {!isLast && (
                <Box
                  sx={{
                    width: "1.5px",
                    flex: 1,
                    backgroundColor: "divider",
                    my: 0.25,
                  }}
                />
              )}
            </Box>
            <Box sx={{ flex: 1, pb: isLast ? 0 : 1.5 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: 2,
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                }}
              >
                <Typography variant="body2">{step}</Typography>
              </Paper>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

type ArticleBlockRendererProps = {
  blocks: ArticleBlock[];
};

export function ArticleBlockRenderer({ blocks }: ArticleBlockRendererProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {blocks.map((block) => {
        if (block.type === "paragraph") {
          return (
            <Box
              key={block.id}
              sx={{
                color: "text.secondary",
                fontSize: "1rem",
                lineHeight: 1.8,
                "& p": { mt: 0, mb: 1 },
                "& p:last-child": { mb: 0 },
                "& ul, & ol": { pl: 3, my: 1 },
                "& a": { color: "primary.main" },
                "& table": {
                  borderCollapse: "collapse",
                  width: "100%",
                  my: 1.5,
                },
                "& th, & td": {
                  border: "1px solid",
                  borderColor: "divider",
                  p: 1,
                },
                "& pre": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#0b0e14" : "#f1f5f9",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  p: 1.5,
                  my: 1.5,
                  fontFamily: "monospace",
                  fontSize: "0.8125rem",
                  overflowX: "auto",
                },
                "& code": {
                  fontFamily: "monospace",
                  fontSize: "0.8125rem",
                  backgroundColor: "action.hover",
                  borderRadius: 0.5,
                  px: 0.5,
                  py: 0.15,
                },
                "& pre code": {
                  backgroundColor: "transparent",
                  p: 0,
                },
              }}
              dangerouslySetInnerHTML={{
                __html: block.content ?? "",
              }}
            />
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
                  <Box
                    key={idx}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
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
              <StepList steps={block.items ?? []} />
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
                borderColor: isWarn
                  ? "#fde68a"
                  : isSuccess
                    ? "success.main"
                    : "divider",
                borderLeft: "4px solid",
                borderLeftColor: isWarn
                  ? "#d97706"
                  : isSuccess
                    ? "success.main"
                    : "primary.main",
                backgroundColor: isWarn
                  ? (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(245, 158, 11, 0.08)"
                        : "#fffbeb"
                  : "background.paper",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
              }}
            >
              {isWarn ? (
                <WarningAmberOutlinedIcon
                  fontSize="small"
                  sx={{ color: "#d97706", mt: 0.25 }}
                />
              ) : (
                <InfoOutlinedIcon
                  color={isSuccess ? "success" : "primary"}
                  fontSize="small"
                  sx={{ mt: 0.25 }}
                />
              )}
              <Box>
                {block.title && (
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 0.5 }}
                  >
                    {block.title}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6, whiteSpace: "pre-line" }}
                >
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
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#0b0e14" : "#f1f5f9",
                overflowX: "auto",
              }}
            >
              <Typography
                component="pre"
                sx={{ m: 0, fontFamily: "monospace", fontSize: "0.8125rem" }}
              >
                {block.content}
              </Typography>
            </Paper>
          );
        }

        if (block.type === "image" && block.imageUrl) {
          return (
            <Paper
              key={block.id}
              variant="outlined"
              sx={{ p: 1.5, borderRadius: 2, borderColor: "divider" }}
            >
              <Box
                component="img"
                src={block.imageUrl}
                alt={block.caption || "Article image"}
                sx={{ width: "100%", borderRadius: 1.5, display: "block" }}
              />
              {block.caption && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  {block.caption}
                </Typography>
              )}
            </Paper>
          );
        }

        if (block.type === "faq") {
          return (
            <Accordion
              key={block.id}
              variant="outlined"
              sx={{
                borderRadius: "8px !important",
                "&:before": { display: "none" },
              }}
            >
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
            <TableContainer
              key={block.id}
              component={Paper}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
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

        if (block.type === "cards") {
          const cards = (block.cards ?? []).filter(
            (c) => c.title?.trim() || c.description?.trim() || c.tag?.trim()
          );

          if (cards.length === 0) {
            return null;
          }

          return (
            <Box
              key={block.id}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {cards.map((card, cIdx) => (
                    <Paper
                      key={cIdx}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        borderColor: "divider",
                        backgroundColor: "background.paper",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
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
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            backgroundColor: card.iconColor
                              ? alpha(card.iconColor, 0.12)
                              : (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "rgba(51, 153, 255, 0.14)"
                                    : "#eff6ff",
                            color: card.iconColor || "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <DynamicMuiIcon
                            name={card.icon || "Analytics"}
                            fontSize="small"
                            color="inherit"
                          />
                        </Box>
                        {card.tag && (
                          <Chip
                            label={card.tag.toUpperCase()}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              letterSpacing: 0.6,
                              height: 24,
                              px: 0.5,
                              borderRadius: "9999px",
                              borderColor: "divider",
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.08)"
                                  : "#f1f5f9",
                              color: "text.secondary",
                            }}
                          />
                        )}
                      </Box>
                      {(card.title || card.description) && (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          {card.title && (
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 700, lineHeight: 1.35 }}
                            >
                              {card.title}
                            </Typography>
                          )}
                          {card.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: "0.8125rem", lineHeight: 1.55 }}
                            >
                              {card.description}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Paper>
                  ))}
            </Box>
          );
        }

        return null;
      })}
    </Box>
  );
}

