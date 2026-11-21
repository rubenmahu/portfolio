import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { Chapter } from "@/types/content.type";
import Stage from "./Stage";

const merged: Chapter = {
  id: "robotics",
  number: "01",
  label: "Robótica",
  branch: "feature/robotics-isr",
  slug: "robotics-isr",
  period: "2020 – 2022",
  title: "Primer trabajo: programar robots",
  summary: "Resumen de prueba.",
  commits: [
    { hash: "aaaaaaa", message: "Primero", description: "Uno.", tags: ["A"] },
    { hash: "bbbbbbb", message: "Segundo", description: "Dos.", tags: ["B"] },
    { hash: "ccccccc", message: "Tercero", description: "Tres.", tags: ["C"] },
  ],
};

test("renders the title as a heading and the branch with its period", () => {
  render(<Stage chapter={merged} />);

  expect(
    screen.getByRole("heading", {
      level: 3,
      name: "Primer trabajo: programar robots",
    }),
  ).toBeDefined();
  expect(screen.getByText("feature/robotics-isr")).toBeDefined();
  expect(screen.getByText("2020 – 2022")).toBeDefined();
  expect(screen.getByText("Resumen de prueba.")).toBeDefined();
});

test("lists the commits of the branch", () => {
  render(<Stage chapter={merged} />);

  expect(
    screen.getAllByRole("heading", { level: 4 }).map((h) => h.textContent),
  ).toEqual(["Historial de commits", "Primero", "Segundo", "Tercero"]);
});

test("does not render a summary paragraph when there is none", () => {
  render(<Stage chapter={{ ...merged, summary: undefined }} />);

  expect(screen.queryByText("Resumen de prueba.")).toBeNull();
  expect(
    screen.getByRole("heading", {
      level: 3,
      name: "Primer trabajo: programar robots",
    }),
  ).toBeDefined();
});
