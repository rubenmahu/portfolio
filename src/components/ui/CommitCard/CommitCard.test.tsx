import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { Commit } from "@/types/content.type";
import CommitCard from "./CommitCard";

const commit: Commit = {
  hash: "a1b2c3d",
  message: "Mensaje de prueba",
  description: "Descripción de prueba.",
  tags: ["Etiqueta uno", "Etiqueta dos"],
};

test("renders the hash, the message and the description", () => {
  render(<CommitCard commit={commit} />);

  expect(
    screen.getByRole("heading", { level: 4, name: "Mensaje de prueba" }),
  ).toBeDefined();
  expect(screen.getByText("a1b2c3d")).toBeDefined();
  expect(screen.getByText("Descripción de prueba.")).toBeDefined();
});

test("lists every tag", () => {
  render(<CommitCard commit={commit} />);

  const tags = screen.getAllByRole("listitem");

  expect(tags.map((tag) => tag.textContent)).toEqual([
    "Etiqueta uno",
    "Etiqueta dos",
  ]);
});

test("renders a commit without description", () => {
  render(<CommitCard commit={{ ...commit, description: undefined }} />);

  expect(
    screen.getByRole("heading", { level: 4, name: "Mensaje de prueba" }),
  ).toBeDefined();
  expect(screen.queryByText("Descripción de prueba.")).toBeNull();
});
