import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "./page";

test("renders the home heading and the stack and contact sections", async () => {
  render(await Home());

  expect(
    screen.getByRole("heading", { level: 1, name: /rubén maestro/i }),
  ).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 2, name: "Stack" }),
  ).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 2, name: "Contacto" }),
  ).toBeDefined();
});
