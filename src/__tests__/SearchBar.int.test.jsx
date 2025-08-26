// src/__tests__/SearchBar.int.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/SearchBar";
import "@testing-library/jest-dom";

describe("<SearchBar /> integration", () => {
  it("calls onSearch with entered text when search button is clicked", () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} disabled={false} />);

    const input = screen.getByTestId("searchInput");
    const btn = screen.getByRole("button", { name: "Search" });

    fireEvent.change(input, { target: { value: "pizza" } });
    fireEvent.click(btn);

    expect(onSearchMock).toHaveBeenCalledTimes(1);
    expect(onSearchMock).toHaveBeenCalledWith("pizza");
  });

  it("triggers search on pressing Enter", () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} disabled={false} />);

    const input = screen.getByTestId("searchInput");
    fireEvent.change(input, { target: { value: "burger" } });

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onSearchMock).toHaveBeenCalledWith("burger");
  });
});
