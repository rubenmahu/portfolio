import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import type { Chapter, Journey as JourneyData } from "@/types/content.type";
import Journey from "./Journey";

function makeChapter(id: string, number: string, slug: string): Chapter {
  return {
    id,
    number,
    label: slug,
    branch: `feature/${slug}`,
    slug,
    title: `Título ${slug}`,
    summary: `Resumen ${slug}.`,
    commits: [
      {
        hash: `${number}00000`,
        message: `Commit ${slug}`,
        description: "x",
        tags: ["t"],
      },
    ],
  };
}

const journey: JourneyData = {
  chapters: [
    makeChapter("origin", "00", "origen"),
    makeChapter("robotics", "01", "robotics-isr"),
    makeChapter("web", "02", "web"),
  ],
};

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: ObserverCallback;
let observed: HTMLElement[] = [];
const disconnect = vi.fn();
const scrollIntoView = vi.fn();
const scrollTo = vi.fn();

class FakeIntersectionObserver {
  constructor(cb: ObserverCallback) {
    callback = cb;
  }

  observe(element: HTMLElement) {
    observed.push(element);
  }

  disconnect() {
    disconnect();
  }
}

// Simulates a stage crossing (or leaving) the reading line.
function crossReadingLine(id: string, isIntersecting = true, top = 0) {
  const target = observed.find((element) => element.dataset.chapter === id);

  act(() =>
    callback([
      {
        target,
        isIntersecting,
        boundingClientRect: { top } as DOMRectReadOnly,
      },
    ]),
  );
}

function getSegment(slug: string) {
  return screen.getByText(slug).closest("[data-stage]");
}

let pinnedMatches = false;
let onPinnedChange: (() => void) | undefined;

// The journey asks for two media: reduced motion and the pinned layout.
function mockMatchMedia({ reducedMotion = false, pinned = false } = {}) {
  pinnedMatches = pinned;
  onPinnedChange = undefined;
  vi.stubGlobal("matchMedia", (query: string) => {
    if (query === "(prefers-reduced-motion: reduce)") {
      return { matches: reducedMotion };
    }

    return {
      get matches() {
        return pinnedMatches;
      },
      addEventListener: (_type: string, listener: () => void) => {
        onPinnedChange = listener;
      },
      removeEventListener: vi.fn(),
    };
  });
}

function getSection() {
  return document.querySelector("#viaje") as HTMLElement;
}

function getStrip() {
  return document.querySelector("[data-slide]")?.parentElement as HTMLElement;
}

// Places the section on the page as if it had been scrolled `top` pixels.
function scrollSection(top: number) {
  vi.spyOn(getSection(), "getBoundingClientRect").mockReturnValue({
    top,
  } as DOMRect);
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

function stripOffset() {
  return parseFloat(getStrip().style.transform.replace(/[^\d.-]/g, ""));
}

function activeSlides() {
  return Array.from(document.querySelectorAll("[data-slide][data-active]")).map(
    (slide) => (slide as HTMLElement).dataset.chapter,
  );
}

beforeEach(() => {
  observed = [];
  disconnect.mockClear();
  scrollIntoView.mockClear();
  scrollTo.mockClear();
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  // The frame runs at once, so the tests do not have to wait for it.
  // The real one is asynchronous and returns the id after running later; this
  // one runs at once, so it returns 0 (no frame pending) like it would afterwards.
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal("scrollTo", scrollTo);
  mockMatchMedia();
  // jsdom does not implement scrollIntoView.
  Element.prototype.scrollIntoView = scrollIntoView;
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("renders one stage per chapter under an accessible section title", () => {
  render(<Journey journey={journey} />);

  expect(
    screen.getByRole("heading", { level: 2, name: "Mi recorrido" }),
  ).toBeDefined();
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
});

test("has no arrows: the branches of the graph are the only controls", () => {
  render(<Journey journey={journey} />);

  expect(
    screen.queryByRole("button", { name: /anterior|siguiente/i }),
  ).toBeNull();
  expect(screen.getAllByRole("button")).toHaveLength(3);
});

test("has a clickable branch for every stage", () => {
  render(<Journey journey={journey} />);

  expect(
    screen
      .getAllByRole("button")
      .map((button) => button.getAttribute("aria-label")),
  ).toEqual(["Ir a origen", "Ir a robotics-isr", "Ir a web"]);
});

test("starts with the first stage highlighted in the graph", () => {
  render(<Journey journey={journey} />);

  expect(getSegment("origen")?.hasAttribute("data-active")).toBe(true);
  expect(getSegment("web")?.hasAttribute("data-active")).toBe(false);
  expect(activeSlides()).toEqual(["origin"]);
});

// ------------------------------------------------------------------ flow

test("flow: clicking a branch scrolls smoothly to its stage", () => {
  render(<Journey journey={journey} />);

  fireEvent.click(screen.getByRole("button", { name: "Ir a robotics-isr" }));

  expect(scrollIntoView).toHaveBeenCalledTimes(1);
  expect(scrollIntoView).toHaveBeenCalledWith({
    behavior: "smooth",
    block: "start",
  });
  expect((scrollIntoView.mock.contexts[0] as HTMLElement).dataset.chapter).toBe(
    "robotics",
  );
});

test("flow: scrolls without animation when the user prefers reduced motion", () => {
  mockMatchMedia({ reducedMotion: true });
  render(<Journey journey={journey} />);

  fireEvent.click(screen.getByRole("button", { name: "Ir a web" }));

  expect(scrollIntoView).toHaveBeenCalledWith({
    behavior: "auto",
    block: "start",
  });
});

test("flow: highlights the branch of the stage that crosses the reading line", () => {
  render(<Journey journey={journey} />);

  crossReadingLine("robotics");

  expect(getSegment("robotics-isr")?.hasAttribute("data-active")).toBe(true);
  expect(getSegment("origen")?.hasAttribute("data-active")).toBe(false);
  expect(activeSlides()).toEqual(["robotics"]);

  crossReadingLine("web");

  expect(getSegment("web")?.hasAttribute("data-active")).toBe(true);
  expect(getSegment("robotics-isr")?.hasAttribute("data-active")).toBe(false);
});

test("flow: going back up highlights the previous branch again", () => {
  render(<Journey journey={journey} />);

  crossReadingLine("web");
  crossReadingLine("robotics");

  expect(getSegment("robotics-isr")?.hasAttribute("data-active")).toBe(true);
  expect(getSegment("web")?.hasAttribute("data-active")).toBe(false);
});

test("flow: keeps the highlight when a stage leaves the reading line", () => {
  render(<Journey journey={journey} />);

  crossReadingLine("robotics");
  crossReadingLine("robotics", false);

  expect(getSegment("robotics-isr")?.hasAttribute("data-active")).toBe(true);
});

test("flow: on the edge between two stages the one that starts last is the active one", () => {
  render(<Journey journey={journey} />);

  const target = (id: string) =>
    observed.find((element) => element.dataset.chapter === id);

  act(() =>
    callback([
      {
        target: target("origin"),
        isIntersecting: true,
        boundingClientRect: { top: -600 } as DOMRectReadOnly,
      },
      {
        target: target("robotics"),
        isIntersecting: true,
        boundingClientRect: { top: 0 } as DOMRectReadOnly,
      },
    ]),
  );

  expect(getSegment("robotics-isr")?.hasAttribute("data-active")).toBe(true);
  expect(getSegment("origen")?.hasAttribute("data-active")).toBe(false);
});

test("flow: watches every stage and stops watching on unmount", () => {
  const { unmount } = render(<Journey journey={journey} />);

  expect(observed.map((element) => element.dataset.chapter)).toEqual([
    "origin",
    "robotics",
    "web",
  ]);

  unmount();

  expect(disconnect).toHaveBeenCalledTimes(1);
});

test("flow: leaves the section and the strip untouched", () => {
  render(<Journey journey={journey} />);

  expect(getSection().style.height).toBe("");
  expect(getStrip().style.transform).toBe("");
});

// ------------------------------------------------------------------ pinned

test("pinned: makes the section tall enough for the whole scroll", () => {
  mockMatchMedia({ pinned: true });
  render(<Journey journey={journey} />);

  // 3 stages, one screen each, plus the hold at the end.
  expect(getSection().style.height).toBe("330dvh");
  expect(getStrip().style.width).toBe("300%");
});

test("pinned: does not watch the stages with the observer", () => {
  mockMatchMedia({ pinned: true });
  render(<Journey journey={journey} />);

  expect(observed).toHaveLength(0);
});

test("pinned: the strip starts on the first stage", () => {
  mockMatchMedia({ pinned: true });
  render(<Journey journey={journey} />);

  expect(stripOffset()).toBe(0);
  expect(activeSlides()).toEqual(["origin"]);
});

test("pinned: every bit of scroll slides the strip, with no stops", () => {
  mockMatchMedia({ pinned: true });
  render(<Journey journey={journey} />);

  const screenHeight = window.innerHeight;
  const offsets: number[] = [];

  for (const scrolled of [100, 200, 300, 400]) {
    scrollSection(-scrolled);
    offsets.push(stripOffset());
  }

  // Each step moves it further to the left than the one before.
  expect(offsets[0]).toBeLessThan(0);
  expect(offsets[1]).toBeLessThan(offsets[0]);
  expect(offsets[2]).toBeLessThan(offsets[1]);
  expect(offsets[3]).toBeLessThan(offsets[2]);

  // One screen of scroll is exactly one stage (a third of the strip).
  scrollSection(-screenHeight);

  expect(stripOffset()).toBeCloseTo(-100 / 3);
});

test("pinned: highlights the nearest stage while the strip slides", () => {
  mockMatchMedia({ pinned: true });
  render(<Journey journey={journey} />);

  const screenHeight = window.innerHeight;

  scrollSection(-screenHeight * 0.4);
  expect(activeSlides()).toEqual(["origin"]);

  scrollSection(-screenHeight * 0.6);
  expect(activeSlides()).toEqual(["robotics"]);
  expect(getSegment("robotics-isr")?.hasAttribute("data-active")).toBe(true);

  scrollSection(-screenHeight * 1.6);
  expect(activeSlides()).toEqual(["web"]);
});

test("pinned: stops at both ends of the strip", () => {
  mockMatchMedia({ pinned: true });
  render(<Journey journey={journey} />);

  scrollSection(-100000);

  expect(stripOffset()).toBeCloseTo((-200 / 3) * 1);
  expect(activeSlides()).toEqual(["web"]);

  scrollSection(5000);

  expect(stripOffset()).toBe(0);
  expect(activeSlides()).toEqual(["origin"]);
});

test("pinned: clicking a branch scrolls the window to the scroll of its stage", () => {
  mockMatchMedia({ pinned: true });
  render(<Journey journey={journey} />);

  fireEvent.click(screen.getByRole("button", { name: "Ir a web" }));

  expect(scrollTo).toHaveBeenCalledWith({
    top: 2 * window.innerHeight,
    behavior: "smooth",
  });
  expect(scrollIntoView).not.toHaveBeenCalled();
});

test("pinned: stops following the scroll and cleans up on unmount", () => {
  mockMatchMedia({ pinned: true });
  const { unmount } = render(<Journey journey={journey} />);
  const section = getSection();
  const strip = getStrip();

  unmount();

  expect(section.style.height).toBe("");
  expect(strip.style.transform).toBe("");
  expect(strip.style.width).toBe("");
});

test("goes back to the flow when the screen stops being pinned", () => {
  mockMatchMedia({ pinned: true });
  render(<Journey journey={journey} />);

  scrollSection(-window.innerHeight);

  expect(getStrip().style.transform).not.toBe("");

  pinnedMatches = false;
  act(() => onPinnedChange?.());

  expect(getSection().style.height).toBe("");
  expect(getStrip().style.transform).toBe("");
  expect(observed).toHaveLength(3);
});

test("the graph shows main, the stages in between merged and the last one open", () => {
  render(<Journey journey={journey} />);

  // Only the open branch ends in HEAD.
  expect(screen.getAllByText("HEAD")).toHaveLength(1);
  expect(getSegment("web")?.textContent).toContain("HEAD");
  expect(getSegment("robotics-isr")?.textContent).not.toContain("HEAD");
});
