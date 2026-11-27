"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: HomeOutlinedIcon },
  { label: "Category", href: "/category", icon: CategoryOutlinedIcon },
  { label: "Articles", href: "/articles", icon: ArticleOutlinedIcon },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isCategory = pathname === "/category" || pathname.startsWith("/category/");

  const isArticles = pathname === "/articles" || pathname.startsWith("/articles/");

  const { user, logout } = useAuth();


  const [mobileOpen, setMobileOpen] = useState(false);

  const [profileAnchorEl, setProfileAnchorEl] = useState<HTMLElement | null>(null);

  const sidebarContent = (
    <Box
      sx={{
        width: 78,
        height: "100%",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 1.5,
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 2.5, letterSpacing: -0.5, color: "text.primary", fontWeight: 800 }}
      >
        S.
      </Typography>

      <List sx={{ width: "100%", px: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {NAV_ITEMS.map((item) => {
          const IconComp = item.icon;

          const selected =
            item.href === "/"
              ? !isCategory && !isArticles
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                py: 1.25,
                px: 0.5,
                gap: 0.5,
                "&.Mui-selected": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(33, 150, 243, 0.16)"
                      : "#eff6ff",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(33, 150, 243, 0.24)"
                        : "#dbeafe",
                  },
                },
              }}
            >
              <IconComp fontSize="small" />
              <Typography variant="caption" sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
                {item.label}
              </Typography>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* Desktop Slim Left Sidebar */}
      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "block" },
          width: 78,
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          borderRight: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        {sidebarContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header */}
        <Box
          component="header"
          sx={{
            height: 56,
            position: "sticky",
            top: 0,
            zIndex: 1100,
            backgroundColor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
            {isCategory ? (
              <CategoryOutlinedIcon fontSize="small" color="action" />
            ) : isArticles ? (
              <ArticleOutlinedIcon fontSize="small" color="action" />
            ) : (
              <HomeOutlinedIcon fontSize="small" color="action" />
            )}
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {isCategory ? "Category" : isArticles ? "Articles" : "Home"}
            </Typography>
          </Box>

          <Box>
            <IconButton
              size="small"
              onClick={(e) => setProfileAnchorEl(e.currentTarget)}
              sx={{ p: 0.25 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  bgcolor: "primary.main",
                  color: "#ffffff",
                }}
              >
                {user?.name?.[0] ?? "J"}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={() => setProfileAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  sx: { width: 200, mt: 1, borderRadius: 2 },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.25 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.name ?? "John Parker"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  @{user?.username ?? "john_p"}
                </Typography>
              </Box>
              <Divider />
              <MenuItem
                onClick={() => {
                  setProfileAnchorEl(null);
                  logout();
                }}
                sx={{ gap: 1.5, fontSize: "0.875rem", py: 1, color: "error.main" }}
              >
                <LogoutOutlinedIcon fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Page Body */}
        <Box component="main" sx={{ flex: 1, p: 1.5 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
