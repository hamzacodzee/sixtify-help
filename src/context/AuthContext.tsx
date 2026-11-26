"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const AUTH_STORAGE_KEY = "sixtify_help_auth_v1";

type AuthUser = {
  username: string;
  name: string;
}

type AuthContextValue = {
  user: AuthUser | null;
  hydrated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [hydrated, setHydrated] = useState(false);

  const pathname = usePathname();

  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);

      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {return;}

    if (!user && pathname !== "/login") {
      router.replace("/login");
    } else if (user && pathname === "/login") {
      router.replace("/");
    }
  }, [hydrated, user, pathname, router]);

  const login = (username: string, password: string) => {
    if (username.trim() === "john_p" && password === "John@123") {
      const authUser: AuthUser = { username: "john_p", name: "John Parker" };

      setUser(authUser);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      } catch {
        // Ignore storage errors
      }
      router.replace("/");

      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, hydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}

