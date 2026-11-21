"use client";

import { useEffect } from "react";

// Delay between the blocks that enter the screen together, so they stack up
// one after another.
const STEP_MS = 90;

// Marks as visible every [data-reveal] block when it enters the screen. The
// CSS hides them only once this component is mounted, so without JavaScript
// the page stays fully visible.
function RevealOnScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        entering.forEach((entry, index) => {
          const block = entry.target as HTMLElement;

          block.style.animationDelay = `${index * STEP_MS}ms`;
          block.dataset.visible = "";
          observer.unobserve(block);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    for (const block of document.querySelectorAll("[data-reveal]")) {
      observer.observe(block);
    }

    root.dataset.revealReady = "";

    return () => {
      observer.disconnect();
      delete root.dataset.revealReady;
    };
  }, []);

  return null;
}

export default RevealOnScroll;
