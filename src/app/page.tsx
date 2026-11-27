"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@codezee/sixtify-brahma";
import {
  Box,
  Chip,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AppShell from "@/components/layout/AppShell";
import { HomeQuickLinks } from "@/components/home/HomeQuickLinks";
import { DynamicMuiIcon } from "@/components/common/IconPicker";
import type {
  Category} from "@/types/category";
import {
  CATEGORY_STORAGE_KEY,
  DEFAULT_CATEGORIES,
} from "@/types/category";
import { buildDefaultArticles, getStoredArticles } from "@/types/article";

const QUICK_TOPICS = [
  "Attendance",
  "Shift Management",
  "Payroll Process",
  "Tax Compliance",
  "Biometric Device",
];


export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const [articles, setArticles] = useState(() => buildDefaultArticles());

  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);

      if (saved) {
        setCategories(JSON.parse(saved));
      }
      setArticles(getStoredArticles());
    } catch {
      // Ignore storage errors
    }
  }, []);

  const popularArticles = useMemo(() => {
    const catMap: Record<string, { title: string; subs: Record<string, { title: string; icon: string }> }> = {};

    for (const cat of categories) {
      const subs: Record<string, { title: string; icon: string }> = {};

      for (const sub of cat.subCategories) {
        subs[sub.id] = { title: sub.title, icon: sub.icon };
      }
      catMap[cat.id] = { title: cat.title, subs };
    }

    return [...articles]
      .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
      .slice(0, 6)
      .map((art) => ({
        id: art.id,
        question: art.title,
        count: art.viewCount ?? 0,
        subTitle: catMap[art.categoryId]?.subs[art.subCategoryId]?.title ?? "General",
        icon: catMap[art.categoryId]?.subs[art.subCategoryId]?.icon ?? "Category",
      }));
  }, [categories, articles]);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) {return categories;}

    return categories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.subCategories.some((sub) => sub.title.toLowerCase().includes(q))
    );
  }, [categories, search]);

  return (
    <AppShell>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Hero Banner */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            borderColor: "divider",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                : "linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)",
            p: { xs: 3, md: 4.5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
            overflow: "hidden",
          }}
        >
          <Box sx={{ maxWidth: 560, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                color: "primary.main",
                display: "block",
                mb: 1,
              }}
            >
              SIXTIFI HELP CENTER
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "text.primary", mb: 2.5, lineHeight: 1.2 }}
            >
              How can we help you today?
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Search for articles, questions, or topics"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {QUICK_TOPICS.map((topic) => (
                <Chip
                  key={topic}
                  label={topic}
                  size="small"
                  onClick={() => setSearch(topic)}
                  sx={{
                    backgroundColor: "background.paper",
                    color: "text.primary",
                    border: "1px solid",
                    borderColor: "divider",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Right Support Graphic */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              px: 4,
              py: 2,
            }}
          >
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                backgroundColor: "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 25px rgba(33, 150, 243, 0.15)",
                mb: 1.5,
              }}
            >
              <SupportAgentIcon sx={{ fontSize: 48, color: "primary.main" }} />
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "text.secondary", fontStyle: "italic" }}
            >
              We are here to help!
            </Typography>
          </Box>
        </Paper>

        {/* Main Content Grid: Browse by products + Quick Links */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* Left: Popular Queries + Browse by products */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Popular Queries Section (Sub-Category Tile Style, ranked by count) */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                Popular Queries
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" },
                  gap: 2,
                }}
              >
                {popularArticles.map((item) => {
                  return (
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
                        justifyContent: "space-between",
                        gap: 1.5,
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          borderColor: "primary.main",
                          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: 1.5,
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
                            <DynamicMuiIcon name={item.icon} fontSize="small" />
                          </Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 700 }}
                            noWrap
                          >
                            {item.subTitle}
                          </Typography>
                        </Box>
                        {item.count > 0 && (
                          <Chip
                            label={`${item.count} views`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.65rem",
                              fontWeight: 600,
                              backgroundColor: "action.hover",
                            }}
                          />
                        )}
                      </Box>

                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                        {item.question}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
            </Box>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2.5,
                borderColor: "divider",
                backgroundColor: "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: "#eff6ff",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DashboardOutlinedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main" }}>
                    Browse by products
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Explore documentation categorized by Sixtifi HRMS Modules
                  </Typography>
                </Box>
              </Box>

              <Button
                component={Link}
                href="/category"
                size="small"
                endIcon={<ArrowForwardIcon fontSize="small" />}
              >
                Manage categories
              </Button>
            </Paper>

            {/* Category Cards Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" },
                gap: 2,
              }}
            >
              {filteredCategories.map((cat) => (
                <Paper
                  key={cat.id}
                  component={Link}
                  href={`/category/${cat.id}`}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 2,
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      borderColor: "#93c5fd",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2,
                          backgroundColor: "#eff6ff",
                          color: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <DynamicMuiIcon name={cat.icon} fontSize="small" />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {cat.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {cat.description || "Explore articles and guides."}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Chip
                      label={`${cat.subCategories.length} sub categories`}
                      size="small"
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        backgroundColor: "action.hover",
                        color: "text.secondary",
                      }}
                    />
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon fontSize="small" />}
                    >
                      View articles
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Right: Quick Links */}
          <HomeQuickLinks />
        </Box>
      </Box>
    </AppShell>
  );
}
