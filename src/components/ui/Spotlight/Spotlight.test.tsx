import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Spotlight from "./Spotlight";

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function getLayer(container: HTMLElement) {
  return container.firstElementChild as HTMLElement;
}

test("is decorative and hidden from assistive technology", () => {
  const { container } = render(<Spotlight />);

  expect(getLayer(container).getAttribute("aria-hidden")).toBe("true");
});

test("follows the pointer and hides when it leaves the page", () => {
  const { container } = render(<Spotlight />);
  const layer = getLayer(container);

  fireEvent.pointerMove(window, { clientX: 120, clientY: 80 });

  expect(layer.style.getPropertyValue("--x")).toBe("120px");
  expect(layer.style.getPropertyValue("--y")).toBe("80px");
  expect(layer.dataset.active).toBe("true");

  fireEvent.pointerLeave(document.documentElement);

  expect(layer.dataset.active).toBeUndefined();
});

test("stops listening to the pointer when it unmounts", () => {
  const remove = vi.spyOn(window, "removeEventListener");
  const { unmount } = render(<Spotlight />);

  unmount();

  expect(remove).toHaveBeenCalledWith("pointermove", expect.any(Function));
});
