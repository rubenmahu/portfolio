import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import RevealOnScroll from "./RevealOnScroll";

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: ObserverCallback;
const unobserve = vi.fn();
const disconnect = vi.fn();

class FakeIntersectionObserver {
  constructor(cb: ObserverCallback) {
    callback = cb;
  }

  observe() {}

  unobserve(element: Element) {
    unobserve(element);
  }

  disconnect() {
    disconnect();
  }
}

function renderBlocks() {
  return render(
    <>
      <RevealOnScroll />
      <div data-reveal data-testid="first" />
      <div data-reveal data-testid="second" />
    </>,
  );
}

function enter(...targets: { element: Element; top: number }[]) {
  act(() =>
    callback(
      targets.map(({ element, top }) => ({
        target: element,
        isIntersecting: true,
        boundingClientRect: { top } as DOMRectReadOnly,
      })),
    ),
  );
}

beforeEach(() => {
  unobserve.mockClear();
  disconnect.mockClear();
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("tells the CSS that the blocks can be hidden until they enter", () => {
  renderBlocks();

  expect(document.documentElement.hasAttribute("data-reveal-ready")).toBe(true);
});

test("marks a block as visible when it enters the screen", () => {
  const { getByTestId } = renderBlocks();
  const first = getByTestId("first");

  enter({ element: first, top: 100 });

  expect(first.hasAttribute("data-visible")).toBe(true);
  expect(getByTestId("second").hasAttribute("data-visible")).toBe(false);
  expect(unobserve).toHaveBeenCalledWith(first);
});

test("staggers the blocks that enter together, from top to bottom", () => {
  const { getByTestId } = renderBlocks();
  const first = getByTestId("first");
  const second = getByTestId("second");

  // The one lower on the screen arrives first in the list on purpose.
  enter({ element: second, top: 300 }, { element: first, top: 100 });

  expect(first.style.animationDelay).toBe("0ms");
  expect(second.style.animationDelay).toBe("90ms");
});

test("ignores the blocks that are not on the screen", () => {
  const { getByTestId } = renderBlocks();
  const first = getByTestId("first");

  act(() =>
    callback([
      {
        target: first,
        isIntersecting: false,
        boundingClientRect: { top: 0 } as DOMRectReadOnly,
      },
    ]),
  );

  expect(first.hasAttribute("data-visible")).toBe(false);
});

test("stops observing and shows everything again on unmount", () => {
  const { unmount } = renderBlocks();

  unmount();

  expect(disconnect).toHaveBeenCalledTimes(1);
  expect(document.documentElement.hasAttribute("data-reveal-ready")).toBe(
    false,
  );
});
