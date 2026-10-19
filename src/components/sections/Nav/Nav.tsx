"use client";

import { useEffect, useRef, useState } from "react";
import { SectionId } from "@/types/section.type";
import styles from "./Nav.module.css";

const NAV_ITEMS = [
  { id: SectionId.Home, label: "Inicio" },
  { id: SectionId.Knowledge, label: "Conocimientos" },
  { id: SectionId.Experience, label: "Experiencia" },
  { id: SectionId.Contact, label: "Contacto" },
];

// Events that mean the person is scrolling by hand, not following a click.
const MANUAL_SCROLL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"];

function Nav() {
  const [activeId, setActiveId] = useState<SectionId>(SectionId.Home);
  const clickedIdRef = useRef<SectionId | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  function selectSection(id: SectionId) {
    clickedIdRef.current = id;
    setActiveId(id);
  }

  useEffect(() => {
    function updateActive() {
      if (clickedIdRef.current) {
        return;
      }

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
      const line = window.innerHeight * progress;
      let current: SectionId = NAV_ITEMS[0].id;

      for (const { id } of NAV_ITEMS) {
        const section = document.getElementById(id);

        if (section && section.getBoundingClientRect().top <= line) {
          current = id;
        }
      }

      setActiveId(current);
    }

    function releaseClicked() {
      clickedIdRef.current = null;
    }

    const frame = requestAnimationFrame(updateActive);
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    for (const type of MANUAL_SCROLL_EVENTS) {
      window.addEventListener(type, releaseClicked, { passive: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      for (const type of MANUAL_SCROLL_EVENTS) {
        window.removeEventListener(type, releaseClicked);
      }
    };
  }, []);

  useEffect(() => {
    function placeMarker() {
      const index = NAV_ITEMS.findIndex(({ id }) => id === activeId);
      const item = listRef.current?.children[index];
      const marker = markerRef.current;

      if (item instanceof HTMLElement && marker) {
        marker.style.transform = `translate(${item.offsetLeft}px, ${item.offsetTop}px)`;
        marker.style.width = `${item.offsetWidth}px`;
        marker.style.height = `${item.offsetHeight}px`;
      }
    }

    placeMarker();
    window.addEventListener("resize", placeMarker);
    document.fonts?.ready.then(placeMarker);

    return () => window.removeEventListener("resize", placeMarker);
  }, [activeId]);

  return (
    <nav className={styles.nav} aria-label="Principal">
      <div className={styles.track}>
        <span ref={markerRef} className={styles.marker} aria-hidden="true" />
        <ol ref={listRef} className={styles.list}>
          {NAV_ITEMS.map(({ id, label }, index) => (
            <li key={id} className={styles.item}>
              <a
                className={styles.link}
                href={`#${id}`}
                onClick={() => selectSection(id)}
                aria-current={id === activeId ? "location" : undefined}
              >
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.label}>{label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

export default Nav;
