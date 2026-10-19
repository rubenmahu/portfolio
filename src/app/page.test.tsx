import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "./page";

test("renders the navigation and the home, knowledge, experience and contact sections", async () => {
  render(await Home());

  expect(screen.getByRole("navigation", { name: "Principal" })).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 1, name: /rubén maestro/i }),
  ).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 2, name: "Conocimientos" }),
  ).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 2, name: "Experiencia" }),
  ).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 2, name: "Experiencia" }),
  ).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 2, name: "Contacto" }),
  ).toBeDefined();
});
