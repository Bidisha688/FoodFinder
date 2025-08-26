import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../src/components/Header";

// --- Mocks ----------------------------------------------------------

jest.mock("../src/Utils/hooks/useAuthLabel", () => {
  const mockToggleAuth = jest.fn();
  return {
    __esModule: true,
    default: () => ({ authLabel: "Login", toggleAuth: mockToggleAuth }),
    mockToggleAuth,
  };
});

jest.mock("../src/Utils/hooks/useMenuToggle", () => {
  const mockToggleMenu = jest.fn();
  const mockCloseMenu = jest.fn();
  return {
    __esModule: true,
    default: () => ({ menuOpen: false, toggleMenu: mockToggleMenu, closeMenu: mockCloseMenu }),
    mockToggleMenu,
    mockCloseMenu,
  };
});

jest.mock("../src/components/CartBadge", () => ({
  __esModule: true,
  default: () => <button data-testid="cart-badge">Cart</button>,
}));
jest.mock("../src/components/ThemeToggle", () => ({
  __esModule: true,
  default: () => <div data-testid="theme-toggle" />,
}));
jest.mock("../src/components/StatusButton", () => ({
  __esModule: true,
  default: () => <div data-testid="status-button" />,
}));

jest.mock("../src/Utils/constants", () => ({
  __esModule: true,
  logoLink: "logo.png",
}));

const { mockToggleAuth } = require("../src/Utils/hooks/useAuthLabel");
const { mockToggleMenu, mockCloseMenu } = require("../src/Utils/hooks/useMenuToggle");

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

    // Scope link checks to the <nav> to avoid the brand "Home" link
    const nav = screen.getByTestId("main-nav");
    const navQueries = within(nav);

    expect(navQueries.getByRole("link", { name: /^home$/i })).toBeInTheDocument();
    expect(navQueries.getByRole("link", { name: /^about$/i })).toBeInTheDocument();
    expect(navQueries.getByRole("link", { name: /^contact$/i })).toBeInTheDocument();

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
