import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders a quote", () => {
  render(<App />);
  // Check if there's an element with the class "quote"
  const quoteElement = screen.getByText(/"/); // looks for text containing a quote mark
  expect(quoteElement).toBeInTheDocument();
});

test("renders New Quote button", () => {
  render(<App />);
  const buttonElement = screen.getByText(/New Quote/i);
  expect(buttonElement).toBeInTheDocument();
});