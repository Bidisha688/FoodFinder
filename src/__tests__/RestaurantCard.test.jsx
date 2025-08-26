import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RestaurantCard from "../components/RestaurantCard";
import MOCK_RESTAURANT from "../mock/restaurantMock";

// Mock hooks
jest.mock("../Utils/hooks/useFormatINR", () => ({
  __esModule: true,
  default: (num) => (num ? `₹${num.toLocaleString("en-IN")}` : null),
}));


jest.mock("../Utils/hooks/useRatingClass", () => ({
  __esModule: true,
  default: (stars) => (stars >= 4 ? "good" : stars >= 3 ? "ok" : "bad"),
}));


jest.mock("../Utils/hooks/useImageFallback.js", () => ({
  __esModule: true,
  default: (src, fallback) => ({
    imgSrc: src || fallback,
    handleError: jest.fn(),
  }),
}));

describe("<RestaurantCard />", () => {
  test("renders with mock restaurant data", () => {
    render(<RestaurantCard {...MOCK_RESTAURANT} />);
    expect(screen.getByText("Roti Ghar")).toBeInTheDocument();
    expect(screen.getByText("Fast Food")).toBeInTheDocument();
    expect(screen.getByText("Khandagiri")).toBeInTheDocument();
    expect(screen.getByText(/₹200 for two/)).toBeInTheDocument();
    expect(screen.getByLabelText("Rating 4.2")).toBeInTheDocument();
    expect(screen.getByAltText("Roti Ghar cover")).toHaveAttribute(
      "src",
      "test-image.jpg"
    );
  });

  test("renders fallback values when props are missing", () => {
    render(<RestaurantCard />);
    expect(screen.getByText("Unnamed Restaurant")).toBeInTheDocument();
    expect(screen.getByText("Cuisine N/A")).toBeInTheDocument();
    expect(screen.getByText("Location N/A")).toBeInTheDocument();
    expect(screen.getByLabelText("Meta info")).toHaveTextContent("—");
  });

  test("renders fallback image when no src provided", () => {
    render(<RestaurantCard {...MOCK_RESTAURANT} image={null} />);
    const img = screen.getByAltText("Roti Ghar cover");
    expect(img.getAttribute("src")).toMatch(/placeholder/);
    fireEvent.error(img);
    expect(img.getAttribute("src")).toMatch(/placeholder/);
  });

  test("renders correct rating class", () => {
    render(<RestaurantCard {...MOCK_RESTAURANT} stars={2.5} />);
    const rating = screen.getByLabelText("Rating 2.5");
    expect(rating.className).toMatch(/red/);
  });

  test("displays 'View menu →' text", () => {
    render(<RestaurantCard {...MOCK_RESTAURANT} />);
    expect(screen.getByText(/View menu/i)).toBeInTheDocument();
  });
});
