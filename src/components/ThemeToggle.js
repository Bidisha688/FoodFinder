import React, { useEffect, useState } from "react";

const STORAGE_KEY = "theme"; // "light" | "dark"

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  // Set theme from storage or system preference
  useEffect(function () {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      var prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      var initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  function toggleTheme() {
    var next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return React.createElement(
    "button",
    {
      onClick: toggleTheme,
      "aria-label": "Switch to " + (theme === "dark" ? "light" : "dark") + " mode",
      style: {
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--text)",
        padding: "8px 10px",
        borderRadius: 10,
        fontSize: 13,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer"
      }
    },
    theme === "dark" ? "🌙 Dark" : "🌞 Light"
  );
}
