import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Icon from "./Icon";
import { IconName } from "./Icon.type";

test("is hidden from assistive technology", () => {
  const { container } = render(<Icon name={IconName.Mail} />);

  expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
    "true",
  );
});

test("draws every icon", () => {
  for (const name of Object.values(IconName)) {
    const { container, unmount } = render(<Icon name={name} />);

    expect(container.querySelector("svg path, svg rect")).not.toBeNull();
    unmount();
  }
});

test("strokes the line icons and fills the brand logos", () => {
  const line = render(<Icon name={IconName.Mail} />).container.querySelector(
    "svg",
  );
  const brand = render(<Icon name={IconName.Github} />).container.querySelector(
    "svg",
  );

  expect(line?.getAttribute("stroke")).toBe("currentColor");
  expect(line?.getAttribute("fill")).toBe("none");
  expect(brand?.getAttribute("fill")).toBe("currentColor");
});

test("passes the class name to the svg", () => {
  const { container } = render(
    <Icon name={IconName.Close} className="mi-clase" />,
  );

  expect(container.querySelector("svg")?.getAttribute("class")).toBe(
    "mi-clase",
  );
});
