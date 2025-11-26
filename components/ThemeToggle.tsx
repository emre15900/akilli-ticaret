"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "@/components/providers/ThemeProvider";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDark = isMounted && theme === "dark";
  const label = isDark ? "Aydınlık moda geç" : "Karanlık moda geç";

  return (
    <button
      type="button"
      aria-label={label}
      suppressHydrationWarning
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
        isDark
          ? "border-slate-700 bg-slate-900 text-amber-300 shadow-inner shadow-slate-900/40"
          : "border-slate-200 bg-white text-slate-700 shadow-sm",
      )}
      onClick={toggleTheme}
    >
      <span
        className={clsx(
          "flex items-center justify-center rounded-full p-1",
          isDark ? "bg-slate-800 text-amber-300" : "bg-amber-100 text-amber-500",
        )}
      >
        {isDark ? <FiMoon suppressHydrationWarning /> : <FiSun suppressHydrationWarning />}
      </span>
      <span suppressHydrationWarning>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
};

