// src/__tests__/Header.test.jsx
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header";

// --- Mocks ----------------------------------------------------------
// NOTE: all paths are relative to src/__tests__/ (so no "../src/...")

jest.mock("../Utils/hooks/useAuthLabel", () => {
  const mockToggleAuth = jest.fn();
  return {
    __esModule: true,
    default: () => ({ authLabel: "Login", toggleAuth: mockToggleAuth }),
    mockToggleAuth, // we’ll import this below
  };
});

jest.mock("../Utils/hooks/useMenuToggle", () => {
  const mockToggleMenu = jest.fn();
  const mockCloseMenu = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      menuOpen: false,
      toggleMenu: mockToggleMenu,
      closeMenu: mockCloseMenu,
    }),
    mockToggleMenu,
    mockCloseMenu, // we’ll import these below
  };
});

jest.mock("../components/CartBadge", () => ({
  __esModule: true,
  default: () => <button data-testid="cart-badge">Cart</button>,
}));

jest.mock("../components/ThemeToggle", () => ({
  __esModule: true,
  default: () => <div data-testid="theme-toggle" />,
}));

jest.mock("../components/StatusButton", () => ({
  __esModule: true,
  default: () => <div data-testid="status-button" />,
}));

jest.mock("../Utils/constants", () => ({
  __esModule: true,
  logoLink: "logo.png",
}));

// pull the mock fns from the mocked modules above
const { mockToggleAuth } = require("../Utils/hooks/useAuthLabel");
const { mockToggleMenu, mockCloseMenu } = require("../Utils/hooks/useMenuToggle");

const renderHeader = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Header />
    </MemoryRouter>
  );

// --- Tests ----------------------------------------------------------

describe("<Header />", () => {
  beforeEach(() => {
    mockToggleAuth.mockClear();
    mockToggleMenu.mockClear();
    mockCloseMenu.mockClear();
  });

  test("renders brand, nav links, logo, and action items", () => {
    renderHeader();

    // Brand text + logo
    expect(screen.getByText(/food/i)).toBeInTheDocument();
    expect(screen.getByText(/finder/i)).toBeInTheDocument();
    const logo = screen.getByAltText(/app logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "logo.png");

    // Scope link checks to the <nav> to avoid the brand 'Home' link
    const nav = screen.getByTestId("main-nav");
    const navQ = within(nav);

    expect(navQ.getByRole("link", { name: /^home$/i })).toBeInTheDocument();
    expect(navQ.getByRole("link", { name: /^about$/i })).toBeInTheDocument();
    expect(navQ.getByRole("link", { name: /^contact$/i })).toBeInTheDocument();

    // Cart + Actions
    expect(screen.getByTestId("cart-badge")).toBeInTheDocument();
    expect(screen.getByTestId("status-button")).toBeInTheDocument();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();

    // Auth button label from hook
    const authBtn = screen.getByTestId("auth-button");
    expect(authBtn).toBeInTheDocument();
    expect(authBtn).toHaveTextContent("Login");
  });

  test("clicking mobile toggle calls toggleMenu()", () => {
    renderHeader();
    const mobileToggle = screen.getByTestId("mobile-toggle");
    expect(mobileToggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(mobileToggle);
    expect(mockToggleMenu).toHaveBeenCalledTimes(1);
  });

  test("clicking brand closes menu", () => {
    renderHeader();
    const brandLink = screen.getByTestId("brand-link");
    fireEvent.click(brandLink);
    expect(mockCloseMenu).toHaveBeenCalledTimes(1);
  });

  test("clicking cart wrapper closes menu", () => {
    renderHeader();
    const cartWrapper = screen.getByTestId("cart-link");
    fireEvent.click(cartWrapper);
    expect(mockCloseMenu).toHaveBeenCalledTimes(1);
  });

  test("clicking auth button calls toggleAuth()", () => {
    renderHeader();
    const authBtn = screen.getByTestId("auth-button");
    fireEvent.click(authBtn);
    expect(mockToggleAuth).toHaveBeenCalledTimes(1);
  });

  test("nav element exists and has proper aria-label", () => {
    renderHeader();
    const nav = screen.getByTestId("main-nav");
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("aria-label", "Main navigation");
  });
});
