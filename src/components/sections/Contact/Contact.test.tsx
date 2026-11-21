import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { Contact as ContactData } from "@/types/content.type";
import Contact from "./Contact";

const contact: ContactData = {
  links: [
    {
      id: "email",
      label: "correo@ejemplo.com",
      href: "mailto:correo@ejemplo.com",
    },
    { id: "web", label: "Perfil", href: "https://ejemplo.com/perfil" },
  ],
};

function getToggle() {
  return screen.getByRole("button", { name: /Contacto/ });
}

test("starts closed, with the links hidden", () => {
  render(<Contact contact={contact} />);

  expect(getToggle().getAttribute("aria-expanded")).toBe("false");
  expect(screen.queryByRole("link", { name: "Perfil" })).toBeNull();
});

test("opens on click and shows the links", () => {
  render(<Contact contact={contact} />);

  fireEvent.click(getToggle());

  expect(getToggle().getAttribute("aria-expanded")).toBe("true");
  expect(
    screen
      .getByRole("link", { name: "correo@ejemplo.com" })
      .getAttribute("href"),
  ).toBe("mailto:correo@ejemplo.com");
  expect(
    screen.getByRole("link", { name: "Perfil" }).getAttribute("href"),
  ).toBe("https://ejemplo.com/perfil");
});

test("the button controls the panel that holds the links", () => {
  render(<Contact contact={contact} />);

  fireEvent.click(getToggle());

  const panelId = getToggle().getAttribute("aria-controls");
  const link = screen.getByRole("link", { name: "Perfil" });

  expect(panelId).not.toBeNull();
  expect(link.closest(`[id="${panelId}"]`)).not.toBeNull();
});

test("closes on a second click", () => {
  render(<Contact contact={contact} />);

  fireEvent.click(getToggle());
  fireEvent.click(getToggle());

  expect(getToggle().getAttribute("aria-expanded")).toBe("false");
  expect(screen.queryByRole("link", { name: "Perfil" })).toBeNull();
});

test("closes with the Escape key", () => {
  render(<Contact contact={contact} />);

  fireEvent.click(getToggle());
  fireEvent.keyDown(screen.getByRole("link", { name: "Perfil" }), {
    key: "Escape",
  });

  expect(getToggle().getAttribute("aria-expanded")).toBe("false");
});

test("opens https links in a new tab and keeps mailto links in place", () => {
  render(<Contact contact={contact} />);

  fireEvent.click(getToggle());

  const external = screen.getByRole("link", { name: "Perfil" });
  expect(external.getAttribute("target")).toBe("_blank");
  expect(external.getAttribute("rel")).toBe("noopener noreferrer");

  const mail = screen.getByRole("link", { name: "correo@ejemplo.com" });
  expect(mail.getAttribute("target")).toBeNull();
  expect(mail.getAttribute("rel")).toBeNull();
});

test("shows an icon next to the links that have one and none on the others", () => {
  render(<Contact contact={contact} />);

  fireEvent.click(getToggle());

  const mail = screen.getByRole("link", { name: "correo@ejemplo.com" });
  const web = screen.getByRole("link", { name: "Perfil" });

  expect(mail.querySelector("svg")).not.toBeNull();
  expect(web.querySelector("svg")).toBeNull();
});

test("the icons do not change the accessible name of the links", () => {
  render(
    <Contact
      contact={{
        links: [
          { id: "github", label: "GitHub", href: "https://github.com/x" },
          { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/x" },
        ],
      }}
    />,
  );

  fireEvent.click(getToggle());

  expect(screen.getByRole("link", { name: "GitHub" })).toBeDefined();
  expect(screen.getByRole("link", { name: "LinkedIn" })).toBeDefined();
});

test("the toggle swaps its icon when it opens", () => {
  render(<Contact contact={contact} />);

  const before = getToggle().innerHTML;

  fireEvent.click(getToggle());

  expect(getToggle().innerHTML).not.toBe(before);
});
