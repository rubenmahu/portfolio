import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import type { Experience as ExperienceData } from "@/types/content.type";
import Experience from "./Experience";

const experience: ExperienceData = {
  jobs: [
    {
      id: "job-one",
      company: "Empresa uno",
      role: "Puesto uno",
      period: "2024 - actualidad",
      highlights: ["Logro uno", "Logro dos"],
    },
    {
      id: "job-two",
      company: "Empresa dos",
      role: "Puesto dos",
      period: "2020 - 2024",
      highlights: ["Logro tres"],
    },
  ],
};

test("renders the section title, a heading per job and its highlights", () => {
  render(<Experience experience={experience} />);

  expect(
    screen.getByRole("heading", { level: 2, name: "Experiencia" }),
  ).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 3, name: "Empresa uno" }),
  ).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 3, name: "Empresa dos" }),
  ).toBeDefined();

  const lists = screen.getAllByRole("list");
  expect(lists).toHaveLength(2);
  expect(within(lists[0]).getAllByRole("listitem")).toHaveLength(2);
  expect(within(lists[1]).getAllByRole("listitem")).toHaveLength(1);
});
