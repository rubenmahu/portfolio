import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import type { Stack as StackData } from "@/types/content.type";
import Stack from "./Stack";

const stack: StackData = {
  groups: [
    {
      id: "group-one",
      name: "Grupo uno",
      items: [
        { id: "alpha", name: "Alfa" },
        { id: "beta", name: "Beta" },
      ],
    },
    {
      id: "group-two",
      name: "Grupo dos",
      items: [{ id: "gamma", name: "Gamma" }],
    },
  ],
};

test("renders the section title, a heading per group and its items", () => {
  render(<Stack stack={stack} />);

  expect(
    screen.getByRole("heading", { level: 2, name: "Conocimientos" }),
  ).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 3, name: "Grupo uno" }),
  ).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 3, name: "Grupo dos" }),
  ).toBeDefined();

  const lists = screen.getAllByRole("list");
  expect(lists).toHaveLength(2);
  expect(within(lists[0]).getAllByRole("listitem")).toHaveLength(2);
  expect(within(lists[1]).getAllByRole("listitem")).toHaveLength(1);
});
