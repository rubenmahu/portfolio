import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { Profile } from "@/types/content.type";
import Hero from "./Hero";

const profile: Profile = {
  name: "Nombre Apellido",
  role: "Desarrollador frontend",
  headline: "Titular de prueba.",
  intro: "Presentación de prueba.",
};

test("renders the name as the main heading with headline and intro", () => {
  render(<Hero profile={profile} />);

  expect(
    screen.getByRole("heading", { level: 1, name: "Nombre Apellido" }),
  ).toBeDefined();
  expect(screen.getByText("Titular de prueba.")).toBeDefined();
  expect(screen.getByText("Presentación de prueba.")).toBeDefined();
});
