import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import BranchGraph from "./BranchGraph";
import type { BranchGraphStage } from "./BranchGraph";
import { BranchGraphKind } from "./BranchGraph.type";

const stages: BranchGraphStage[] = [
  {
    id: "origin",
    number: "00",
    slug: "origen",
    kind: BranchGraphKind.Main,
    commits: 3,
  },
  {
    id: "robotics",
    number: "01",
    slug: "robotics-isr",
    kind: BranchGraphKind.Merged,
    commits: 3,
  },
  {
    id: "web",
    number: "02",
    slug: "web",
    kind: BranchGraphKind.Open,
    commits: 3,
  },
];

function renderGraph(activeId = "origin", onSelect = vi.fn()) {
  render(
    <BranchGraph stages={stages} activeId={activeId} onSelect={onSelect} />,
  );

  return onSelect;
}

function getSegment(slug: string) {
  return screen.getByText(`-${slug}`).closest("[data-stage]");
}

test("is a navigation with one button per stage", () => {
  renderGraph();

  expect(
    screen.getByRole("navigation", { name: "Etapas del recorrido" }),
  ).toBeDefined();
  expect(
    screen
      .getAllByRole("button")
      .map((button) => button.getAttribute("aria-label")),
  ).toEqual(["Ir a 00-origen", "Ir a 01-robotics-isr", "Ir a 02-web"]);
});

test("calls onSelect with the id of the stage that is clicked", () => {
  const onSelect = renderGraph();

  fireEvent.click(screen.getByRole("button", { name: "Ir a 01-robotics-isr" }));

  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onSelect).toHaveBeenCalledWith("robotics");
});

test("marks the active stage as the current one", () => {
  renderGraph("robotics");

  expect(
    screen
      .getByRole("button", { name: "Ir a 01-robotics-isr" })
      .getAttribute("aria-current"),
  ).toBe("true");
  expect(
    screen
      .getByRole("button", { name: "Ir a 00-origen" })
      .getAttribute("aria-current"),
  ).toBeNull();
});

test("hides the drawing from assistive technology", () => {
  renderGraph();

  expect(
    screen.getByText("-origen").closest('[aria-hidden="true"]'),
  ).not.toBeNull();
});

test("draws one segment per stage, labelled with its number and slug", () => {
  renderGraph();

  for (const slug of ["origen", "robotics-isr", "web"]) {
    expect(getSegment(slug)).not.toBeNull();
  }
  expect(getSegment("robotics-isr")?.textContent).toBe("01-robotics-isr");
});

test("highlights only the active stage", () => {
  renderGraph("robotics");

  expect(getSegment("robotics-isr")?.hasAttribute("data-active")).toBe(true);
  expect(getSegment("origen")?.hasAttribute("data-active")).toBe(false);
  expect(getSegment("web")?.hasAttribute("data-active")).toBe(false);
});

test("moves the highlight when the active stage changes", () => {
  const { rerender } = render(
    <BranchGraph stages={stages} activeId="origin" onSelect={vi.fn()} />,
  );

  rerender(<BranchGraph stages={stages} activeId="web" onSelect={vi.fn()} />);

  expect(getSegment("web")?.hasAttribute("data-active")).toBe(true);
  expect(getSegment("origen")?.hasAttribute("data-active")).toBe(false);
});

test("only the open branch ends in HEAD", () => {
  renderGraph();

  expect(screen.getAllByText("HEAD")).toHaveLength(1);
  expect(getSegment("web")?.textContent).toContain("HEAD");
});
