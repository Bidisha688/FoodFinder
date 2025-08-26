import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Cart from "../components/Cart";
import makeCartStore from "../src-utils/makeCartStore"
import { Provider } from "react-redux";

function renderWithProviders(ui, { store } = {}) {
  return render(
    <MemoryRouter>
      <Provider store={store}>{ui}</Provider>
    </MemoryRouter>
  );
}

describe("<Cart /> integration", () => {
  test("shows empty state when there are no items", () => {
    const store = makeCartStore({ items: [] });
    renderWithProviders(<Cart />, { store });

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /browse restaurants/i })
    ).toHaveAttribute("href", "/");
  });

  test("renders items, supports +, -, Remove and Clear Cart, and updates totals", () => {
    const store = makeCartStore({
      items: [
        { id: "id-1", name: "Paneer Roll", price: 120, image: "img-1.jpg", qty: 1 },
        { id: "id-2", name: "Veg Biryani", price: 200, image: "img-2.jpg", qty: 2 },
      ],
    });

    renderWithProviders(<Cart />, { store });

    // Names + unit prices exist
    expect(screen.getByText("Paneer Roll")).toBeInTheDocument();
    expect(screen.getByText("Veg Biryani")).toBeInTheDocument();
    expect(screen.getByText("₹120.00")).toBeInTheDocument();
    expect(screen.getByText("₹200.00")).toBeInTheDocument();

    // Initial total = 1*120 + 2*200 = 520
    let totalRow = screen.getByText(/^total$/i).closest("div");
    expect(within(totalRow).getByText("₹520.00")).toBeInTheDocument();

    // + on first row => 2*120 + 2*200 = 640
    fireEvent.click(screen.getAllByLabelText(/increase quantity/i)[0]);
    totalRow = screen.getByText(/^total$/i).closest("div");
    expect(within(totalRow).getByText("₹640.00")).toBeInTheDocument();

    // - on second row => 2*120 + 1*200 = 440
    fireEvent.click(screen.getAllByLabelText(/decrease quantity/i)[1]);
    totalRow = screen.getByText(/^total$/i).closest("div");
    expect(within(totalRow).getByText("₹440.00")).toBeInTheDocument();

    // Remove first row (Paneer Roll) => only 1*200
    fireEvent.click(screen.getAllByRole("button", { name: /remove/i })[0]);
    expect(screen.queryByText("Paneer Roll")).not.toBeInTheDocument();
    totalRow = screen.getByText(/^total$/i).closest("div");
    expect(within(totalRow).getByText("₹200.00")).toBeInTheDocument();

    // Clear cart => empty state
    fireEvent.click(screen.getByRole("button", { name: /clear cart/i }));
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});
