"use client";

import React, { useState } from "react";
import { Button } from "@codezee/sixtify-brahma";
import {
  Alert,
  Box,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  const [username, setUsername] = useState("john_p");

  const [password, setPassword] = useState("John@123");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const ok = login(username, password);

    if (!ok) {
      setError("Invalid username or password.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          borderColor: "#e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              backgroundColor: "#eff6ff",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.5,
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
            S. Sixtify Help
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to continue
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: "block" }}>
              Username
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_p"
              autoFocus
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: "block" }}>
              Password
            </Typography>
            <TextField
              size="small"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
            />
          </Box>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 0.5, py: 1 }}>
            Sign In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

