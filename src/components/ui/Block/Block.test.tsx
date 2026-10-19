import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Block from "./Block";
import { BlockTone } from "./Block.type";

test("renders its children", () => {
  render(<Block>Contenido</Block>);

  expect(screen.getByText("Contenido")).toBeDefined();
});

test("applies the class of the given tone", () => {
  render(<Block tone={BlockTone.Highlight}>Contenido</Block>);

  expect(screen.getByText("Contenido").className).toContain("highlight");
});
