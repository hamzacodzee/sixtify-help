"use client";

import React, { useState } from "react";
import { Button } from "@codezee/sixtify-brahma";
import { Box, Divider, Paper, Typography } from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

type TocSection = {
  id: string;
  label: string;
};

type ArticleTocSidebarProps = {
  sections: TocSection[];
  activeSection: string;
  onSelectSection: (id: string) => void;
};

export function ArticleTocSidebar({
  sections,
  activeSection,
  onSelectSection,
}: ArticleTocSidebarProps) {
  const [copied, setCopied] = useState(false);

  return (
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

      <Box
        sx={{
          borderLeft: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;

          return (
            <Box
              key={sec.id}
              component="a"
              href={`#${sec.id}`}
              onClick={() => onSelectSection(sec.id)}
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
  );
}

