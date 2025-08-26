// src/__tests__/Contact.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
// If you don't already add this in setupTests.js, uncomment the next line:
// import "@testing-library/jest-dom";
import Contact from "../components/Contact";

describe("<Contact />", () => {
  describe("Rendering", () => {
    test("shows heading and description", () => {
      render(<Contact />);
      expect(
        screen.getByRole("heading", { name: /contact us/i, level: 1 })
      ).toBeInTheDocument();

      // Accept both straight and curly apostrophes
      expect(
        screen.getByText(/we(’|')d love to hear from you/i)
      ).toBeInTheDocument();
    });

    test("renders three textboxes (name, email, message) and a submit button", () => {
      render(<Contact />);
      const textboxes = screen.getAllByRole("textbox");
      expect(textboxes).toHaveLength(3);
      expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your message/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /send message/i })
      ).toBeInTheDocument();
    });

    test("email input has correct type='email'", () => {
      render(<Contact />);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      expect(emailInput).toHaveAttribute("type", "email");
    });

    test("initial values are empty", () => {
      render(<Contact />);
      expect(screen.getByPlaceholderText(/your name/i)).toHaveValue("");
      expect(screen.getByPlaceholderText(/your email/i)).toHaveValue("");
      expect(screen.getByPlaceholderText(/your message/i)).toHaveValue("");
    });
  });

  describe("Interactions", () => {
    test("allows typing into all fields", () => {
      render(<Contact />);
      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const messageArea = screen.getByPlaceholderText(/your message/i);

      fireEvent.change(nameInput, { target: { value: "Ada Lovelace" } });
      fireEvent.change(emailInput, { target: { value: "ada@example.com" } });
      fireEvent.change(messageArea, { target: { value: "Hello there!" } });

      expect(nameInput).toHaveValue("Ada Lovelace");
      expect(emailInput).toHaveValue("ada@example.com");
      expect(messageArea).toHaveValue("Hello there!");
    });

    test("form submission prevents default and calls onSubmit with prevented event", () => {
      const onSubmit = jest.fn();
      const { container } = render(<Contact onSubmit={onSubmit} />);

      // Prefer role="form" if present; otherwise query the element directly
      const form =
        screen.queryByRole("form") || container.querySelector("form");
      expect(form).toBeTruthy();

      fireEvent.submit(form);

      expect(onSubmit).toHaveBeenCalledTimes(1);
      const eventArg = onSubmit.mock.calls[0][0];
      expect(eventArg).toBeTruthy();
      expect(eventArg.defaultPrevented).toBe(true);
    });

    test("submit button is type='submit' and belongs to the form", () => {
      const { container } = render(<Contact />);
      const submitBtn = screen.getByRole("button", { name: /send message/i });
      expect(submitBtn).toHaveAttribute("type", "submit");

      const form =
        screen.queryByRole("form") || container.querySelector("form");
      expect(submitBtn.closest("form")).toBe(form);
    });
  });
});
