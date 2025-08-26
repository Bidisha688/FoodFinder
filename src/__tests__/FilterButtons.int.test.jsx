// src/__tests__/FilterButtons.int.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import FilterButtons from "../components/FilterButtons";
import "@testing-library/jest-dom";

describe("<FilterButtons /> integration", () => {
  it("calls onTopRated when Top Rated button is clicked", () => {
    const onTopRatedMock = jest.fn();
    const onResetMock = jest.fn();

    render(
      <FilterButtons
        onTopRated={onTopRatedMock}
        onReset={onResetMock}
        disabled={false}
      />
    );

    const topRatedBtn = screen.getByRole("button", { name: "⭐ Top Rated" });
    fireEvent.click(topRatedBtn);

    expect(onTopRatedMock).toHaveBeenCalledTimes(1);
  });

  it("calls onReset when Reset button is clicked", () => {
    const onTopRatedMock = jest.fn();
    const onResetMock = jest.fn();

    render(
      <FilterButtons
        onTopRated={onTopRatedMock}
        onReset={onResetMock}
        disabled={false}
      />
    );

    const resetBtn = screen.getByRole("button", { name: "🔄 Reset" });
    fireEvent.click(resetBtn);

    expect(onResetMock).toHaveBeenCalledTimes(1);
  });
});
