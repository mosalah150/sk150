"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder of similar size to prevent visual layout shift
    return <div className="bg-canvas-muted border-border h-10 w-10 rounded-full border" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="border-border bg-canvas-muted text-text hover:bg-canvas focus-visible:outline-brand relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-all duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      title={`Current: ${theme === "system" ? "System preference" : `${resolvedTheme} mode (pinned)`}`}
    >
      {/* Sun Icon */}
      <svg
        className={`absolute h-5 w-5 transition-transform duration-500 ease-out ${
          resolvedTheme === "dark"
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.727l.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>

      {/* Moon Icon */}
      <svg
        className={`absolute h-5 w-5 transition-transform duration-500 ease-out ${
          resolvedTheme === "dark"
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
