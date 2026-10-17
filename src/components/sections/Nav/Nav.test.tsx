import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Nav from "./Nav";

const DOCUMENT_HEIGHT = 2000;
const SECTION_TOPS = { inicio: 0, conocimientos: 400, contacto: 1700 };

beforeEach(() => {
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(
    DOCUMENT_HEIGHT,
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderNav() {
  const view = render(
    <>
      <Nav />
      <section id="inicio" />
      <section id="conocimientos" />
      <section id="contacto" />
    </>,
  );

  for (const [id, top] of Object.entries(SECTION_TOPS)) {
    const section = document.getElementById(id);

    vi.spyOn(section as Element, "getBoundingClientRect").mockImplementation(
      () => ({ top: top - window.scrollY }) as DOMRect,
    );
  }

  return view;
}

function scrollTo(y: number) {
  window.scrollY = y;
  fireEvent.scroll(window);
}

function currentLabel() {
  return screen
    .getAllByRole("link")
    .find((link) => link.getAttribute("aria-current") === "location")
    ?.textContent;
}

test("renders a link to each section", () => {
  renderNav();

  expect(screen.getByRole("navigation", { name: "Principal" })).toBeDefined();
  expect(
    screen.getByRole("link", { name: "Inicio" }).getAttribute("href"),
  ).toBe("#inicio");
  expect(
    screen.getByRole("link", { name: "Conocimientos" }).getAttribute("href"),
  ).toBe("#conocimientos");
  expect(
    screen.getByRole("link", { name: "Contacto" }).getAttribute("href"),
  ).toBe("#contacto");
});

test("marks the first section as current before any scroll", () => {
  renderNav();

  expect(currentLabel()).toBe("01Inicio");
});

test("follows the sections while scrolling down and back up", () => {
  renderNav();
  const bottom = DOCUMENT_HEIGHT - window.innerHeight;

  scrollTo(bottom / 2);
  expect(currentLabel()).toBe("02Conocimientos");

  scrollTo(bottom);
  expect(currentLabel()).toBe("03Contacto");

  scrollTo(bottom / 2);
  expect(currentLabel()).toBe("02Conocimientos");

  scrollTo(0);
  expect(currentLabel()).toBe("01Inicio");
});

test("reaches the last section even when it is short", () => {
  renderNav();

  scrollTo(DOCUMENT_HEIGHT - window.innerHeight);

  expect(currentLabel()).toBe("03Contacto");
});

test("stops listening to scroll when it unmounts", () => {
  const remove = vi.spyOn(window, "removeEventListener");
  const { unmount } = renderNav();

  unmount();

  expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
});
