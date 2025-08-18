import React, { useEffect, useState } from "react";

const STORAGE_KEY = "theme"; // "light" | "dark"

export default function ThemeToggle() {
  // Start in light; we’ll sync from localStorage on mount.
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = stored === "dark" ? "dark" : "light"; // default = light
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
    >
      {theme === "dark" ? "🌙 Dark" : "🌞 Light"}
    </button>
  );
}
