import React from "react";
import { Link, NavLink } from "react-router-dom";
import { logoLink } from "../Utils/constants";
import ThemeToggle from "./ThemeToggle";
import useAuthLabel from "../Utils/hooks/useAuthLabel";
import useMenuToggle from "../Utils/hooks/useMenuToggle";
import StatusButton from "./StatusButton";

export default function Header() {
  const { authLabel, toggleAuth } = useAuthLabel();
  const { menuOpen, toggleMenu, closeMenu } = useMenuToggle();

  const navLink = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-xl transition ${
      isActive
        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-900/60 bg-white/80 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="Home" onClick={closeMenu} className="flex items-center gap-2">
            <img className="h-8 w-8 rounded-lg ring-1 ring-black/5" src={logoLink} alt="App logo" />
            <span className="text-lg font-bold tracking-tight">Food<span className="text-indigo-600">Finder</span></span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Nav + Actions */}
        <nav className={`fixed inset-x-0 top-16 lg:static lg:inset-auto lg:top-auto ${menuOpen ? "block" : "hidden lg:block"}`} aria-label="Main navigation">
          <div className="lg:flex lg:items-center lg:gap-6 bg-white dark:bg-zinc-900 lg:bg-transparent lg:dark:bg-transparent px-4 lg:px-0 pb-4 lg:pb-0 border-b lg:border-0 border-zinc-200 dark:border-zinc-800">
            <ul className="flex flex-col lg:flex-row gap-2 lg:gap-1 py-3 lg:py-0">
              <li><NavLink to="/" onClick={closeMenu} className={navLink}>Home</NavLink></li>
              <li><NavLink to="/about" onClick={closeMenu} className={navLink}>About</NavLink></li>
              <li><NavLink to="/contact" onClick={closeMenu} className={navLink}>Contact</NavLink></li>
              <li><NavLink to="/cart" onClick={closeMenu} className={navLink}>Cart</NavLink></li>
            </ul>

            <div className="flex items-center gap-3 py-3 lg:py-0">
              <StatusButton />
              <ThemeToggle />
              <button className="inline-flex items-center rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500" onClick={toggleAuth}>
                {authLabel}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}