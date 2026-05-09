import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders game container", () => {
  render(<App />);
  const gameContainer = screen.getByRole("textbox");
  expect(gameContainer).toBeInTheDocument();
});
