import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Home from "./page";

// jsdom has no IntersectionObserver or matchMedia, which the journey uses.
beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("renders the hero, the journey, the contact panel and the footer", async () => {
  render(await Home());

  expect(
    screen.getByRole("heading", { level: 1, name: /rubén maestro/i }),
  ).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 2, name: "Mi recorrido" }),
  ).toBeDefined();
  expect(screen.getByRole("button", { name: /Contacto/ })).toBeDefined();
  expect(screen.getByRole("contentinfo")).toBeDefined();
});
