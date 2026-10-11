import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { Contact as ContactData } from "@/types/content.type";
import Contact from "./Contact";

const contact: ContactData = {
  intro: "Introducción de prueba.",
  links: [
    {
      id: "email",
      label: "correo@ejemplo.com",
      href: "mailto:correo@ejemplo.com",
    },
    { id: "web", label: "Perfil", href: "https://ejemplo.com/perfil" },
  ],
};

test("renders the title, the intro and the links", () => {
  render(<Contact contact={contact} />);

  expect(
    screen.getByRole("heading", { level: 2, name: "Contacto" }),
  ).toBeDefined();
  expect(screen.getByText("Introducción de prueba.")).toBeDefined();
  expect(
    screen
      .getByRole("link", { name: "correo@ejemplo.com" })
      .getAttribute("href"),
  ).toBe("mailto:correo@ejemplo.com");
  expect(
    screen.getByRole("link", { name: "Perfil" }).getAttribute("href"),
  ).toBe("https://ejemplo.com/perfil");
});

test("opens https links in a new tab and keeps mailto links in place", () => {
  render(<Contact contact={contact} />);

  const external = screen.getByRole("link", { name: "Perfil" });
  expect(external.getAttribute("target")).toBe("_blank");
  expect(external.getAttribute("rel")).toBe("noopener noreferrer");

  const mail = screen.getByRole("link", { name: "correo@ejemplo.com" });
  expect(mail.getAttribute("target")).toBeNull();
  expect(mail.getAttribute("rel")).toBeNull();
});
