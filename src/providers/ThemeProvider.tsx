"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Helper to get active system theme
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  useEffect(() => {
    // 1. Load initial value from localStorage or fallback to system
    const savedTheme = localStorage.getItem("color-scheme") as Theme | null;
    const initialTheme: Theme = savedTheme || "system";
    setTheme(initialTheme);

    const systemTheme = getSystemTheme();
    const resolved = initialTheme === "system" ? systemTheme : (initialTheme as "light" | "dark");
    setResolvedTheme(resolved);

    // 2. Setup system event listener to react to OS changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (
        localStorage.getItem("color-scheme") === "system" ||
        !localStorage.getItem("color-scheme")
      ) {
        const newSystemTheme = e.matches ? "dark" : "light";
        setResolvedTheme(newSystemTheme);
        updateDOM("system", newSystemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  // Update classes and attributes on HTML tag
  const updateDOM = (newTheme: Theme, newResolved: "light" | "dark") => {
    const root = window.document.documentElement;
    const metaColorScheme = window.document.querySelector('meta[name="color-scheme"]');

    // Update classList to ensure descendant selectors work if needed
    if (newResolved === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

    // Update metadata color scheme
    if (metaColorScheme) {
      metaColorScheme.setAttribute("content", newTheme === "system" ? "light dark" : newTheme);
    }
  };

  const toggleTheme = () => {
    const systemTheme = getSystemTheme();
    let nextTheme: Theme;

    if (theme === "system") {
      // Pin to the opposite of current system theme
      nextTheme = systemTheme === "dark" ? "light" : "dark";
    } else {
      // If pinned, revert back to system
      nextTheme = "system";
    }

    const nextResolved = nextTheme === "system" ? systemTheme : (nextTheme as "light" | "dark");

    setTheme(nextTheme);
    setResolvedTheme(nextResolved);
    localStorage.setItem("color-scheme", nextTheme);
    updateDOM(nextTheme, nextResolved);
  };

  // Sync state changes on initial load or manual changes
  useEffect(() => {
    const systemTheme = getSystemTheme();
    const resolved = theme === "system" ? systemTheme : (theme as "light" | "dark");
    updateDOM(theme, resolved);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
