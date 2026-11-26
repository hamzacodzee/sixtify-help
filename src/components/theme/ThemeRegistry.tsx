"use client";

import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { appTheme, Theme } from "@codezee/sixtify-brahma";

const brahmaTheme = appTheme(Theme.light);

const lightTheme = createTheme({
  ...brahmaTheme,
  components: {
    ...brahmaTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: "15px",
        },
      },
    },
  },
  typography: {
    fontFamily: "var(--font-poppins), sans-serif",
    body2: {
      fontSize: "0.8125rem",
    },
  },
  palette: {
    ...brahmaTheme.palette,
    app: brahmaTheme.palette!.app,
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
      ...brahmaTheme.palette?.text,
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
      ...brahmaTheme.palette?.background,
    },
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      {mounted && <CssBaseline />}
      {children}
    </ThemeProvider>
  );
}
