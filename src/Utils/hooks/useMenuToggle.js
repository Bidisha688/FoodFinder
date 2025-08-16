// src/hooks/useMenuToggle.js
import { useState } from "react";

export default function useMenuToggle() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((s) => !s);
  const closeMenu = () => setMenuOpen(false);

  return { menuOpen, toggleMenu, closeMenu };
}
