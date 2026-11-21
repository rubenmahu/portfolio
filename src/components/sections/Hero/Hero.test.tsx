import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { Profile } from "@/types/content.type";
import Hero from "./Hero";

const profile: Profile = {
  name: "Nombre Apellido",
  role: "Desarrollador frontend",
  headline: "Titular de prueba.",
  intro: "Presentación de prueba.",
  description: "Descripción de prueba.",
  siteUrl: "https://ejemplo.com",
};

test("renders the full name as the main heading", () => {
  render(<Hero profile={profile} />);

  expect(
    screen.getByRole("heading", { level: 1, name: "Nombre Apellido" }),
  ).toBeDefined();
});

test("renders the headline and the intro", () => {
  render(<Hero profile={profile} />);

  expect(
    screen.getByText("Titular de prueba. Presentación de prueba."),
  ).toBeDefined();
});

test("links to the start of the journey", () => {
  render(<Hero profile={profile} />);

  const link = screen.getByRole("link", { name: /El viaje empieza aquí/ });

  expect(link.getAttribute("href")).toMatch(/^#/);
});

test("shows the portrait with an accessible name", () => {
  render(<Hero profile={profile} />);

  expect(
    screen.getByRole("img", { name: "Retrato de Nombre Apellido" }),
  ).toBeDefined();
});
