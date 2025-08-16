// components/Header.js
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { logoLink } from "../Utils/constants";
import ThemeToggle from "./ThemeToggle";
import useAuthLabel from "../Utils/hooks/useAuthLabel";
import useMenuToggle from "../Utils/hooks/useMenuToggle";
import StatusButton from "./StatusButton"; 

const Header = () => {
  const { authLabel, toggleAuth } = useAuthLabel();
  const { menuOpen, toggleMenu, closeMenu } = useMenuToggle();

  return (
    <header className="header">
      {/* Brand */}
      <div className="brand">
        <Link to="/" aria-label="Home" onClick={closeMenu} className="brand-link">
          <img className="logo" src={logoLink} alt="App logo" />
          <span className="brand-name">
            Food<span className="brand-accent">Finder</span>
          </span>
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={toggleMenu}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Nav + Actions */}
      <nav className={`nav-items ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
        <ul className="nav-list" data-open={menuOpen ? "true" : "false"}>
          <li><NavLink to="/" onClick={closeMenu} className="nav-link">Home</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu} className="nav-link">About</NavLink></li>
          <li><NavLink to="/contact" onClick={closeMenu} className="nav-link">Contact</NavLink></li>
          <li><NavLink to="/cart" onClick={closeMenu} className="nav-link">Cart</NavLink></li>
        </ul>

        <div className="actions">
          {/* Show online/offline status */}
          <StatusButton />

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Auth button */}
          <button className="login" onClick={toggleAuth}>
            {authLabel}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
