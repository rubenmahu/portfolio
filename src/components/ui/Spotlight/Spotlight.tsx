"use client";

import { useEffect, useRef } from "react";
import styles from "./Spotlight.module.css";

function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    function follow(event: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const layer = ref.current;

        if (layer) {
          layer.style.setProperty("--x", `${event.clientX}px`);
          layer.style.setProperty("--y", `${event.clientY}px`);
          layer.dataset.active = "true";
        }
      });
    }

    function hide() {
      cancelAnimationFrame(frame);
      ref.current?.removeAttribute("data-active");
    }

    window.addEventListener("pointermove", follow, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", follow);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  }, []);

  return <div ref={ref} className={styles.spotlight} aria-hidden="true" />;
}

export default Spotlight;
