import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { Profile } from "@/types/content.type";
import Footer from "./Footer";

const profile: Profile = {
  name: "Nombre Apellido",
  role: "Desarrollador frontend",
  headline: "Titular.",
  intro: "Intro.",
  description: "Descripción.",
  siteUrl: "https://ejemplo.com",
};

test("renders the name and the role in the footer landmark", () => {
  render(<Footer profile={profile} />);

  const footer = screen.getByRole("contentinfo");

  expect(footer.textContent).toContain("Nombre Apellido");
  expect(footer.textContent).toContain("Desarrollador frontend");
});

test("shows nothing else than the name and the role", () => {
  render(<Footer profile={profile} />);

  expect(screen.queryByText(/HEAD/)).toBeNull();
});
