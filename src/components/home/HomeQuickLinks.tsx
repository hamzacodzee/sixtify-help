"use client";

import React from "react";
import Link from "next/link";
import { Box, Paper, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

const QUICK_LINK_ITEMS = [
  {
    href: "/category",
    title: "Knowledge Base",
    subtitle: "Browse helpful articles",
    icon: MenuBookOutlinedIcon,
  },
  {
    href: "/category",
    title: "Announcements",
    subtitle: "Latest updates from Sixtifi",
    icon: CampaignOutlinedIcon,
  },
];

export function HomeQuickLinks() {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}
      >
        Quick Links
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {QUICK_LINK_ITEMS.map((item) => {
          const IconComp = item.icon;

          return (
            <Paper
              key={item.title}
              variant="outlined"
              component={Link}
              href={item.href}
              sx={{
                p: 1.5,
                borderRadius: 2,
                borderColor: "#e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                textDecoration: "none",
                color: "inherit",
                "&:hover": {
                  borderColor: "#93c5fd",
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    backgroundColor: "#eff6ff",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComp fontSize="small" />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "primary.main" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.subtitle}
                  </Typography>
                </Box>
              </Box>
              <ArrowForwardIcon fontSize="small" color="action" />
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
}

