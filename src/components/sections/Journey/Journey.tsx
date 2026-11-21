"use client";

import { useEffect, useRef, useState } from "react";
import Stage from "@/components/sections/Stage/Stage";
import BranchGraph from "@/components/ui/BranchGraph/BranchGraph";
import type { BranchGraphStage } from "@/components/ui/BranchGraph/BranchGraph";
import { BranchGraphKind } from "@/components/ui/BranchGraph/BranchGraph.type";
import type { Chapter, Journey as JourneyData } from "@/types/content.type";
import { SectionId } from "@/types/section.type";
import styles from "./Journey.module.css";

interface JourneyProps {
  journey: JourneyData;
}

// The stage that crosses this line, in the middle of the screen, is the one
// being read when the stages go one after the other.
const READING_LINE = "-50% 0px -50% 0px";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
// Wide and tall screens, when the person accepts motion: the journey is pinned
// and the scroll slides the stages sideways. Same condition as in
// Journey.module.css and Stage.module.css.
const PINNED_QUERY =
  "(min-width: 1300px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";
// Extra scroll, as a percentage of the screen, that keeps the last stage still
// before the journey is released.
const END_HOLD = 30;

// The origin lives in main, the last stage is the branch that is still open
// and the ones in between have been merged.
function getKind(chapter: Chapter, isLast: boolean) {
  if (chapter.branch === "main") {
    return BranchGraphKind.Main;
  }

  return isLast ? BranchGraphKind.Open : BranchGraphKind.Merged;
}

// Flow: the stage that crosses the reading line is the one being read.
function followReading(
  section: HTMLElement,
  onActive: (id: string) => void,
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      // On the edge between two stages both touch the line: the one that
      // starts last is the one being read.
      const reading = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .pop();
      const id = (reading?.target as HTMLElement | undefined)?.dataset.chapter;

      if (id) {
        onActive(id);
      }
    },
    { rootMargin: READING_LINE },
  );

  for (const slide of section.querySelectorAll<HTMLElement>("[data-slide]")) {
    observer.observe(slide);
  }

  return () => observer.disconnect();
}

// Pinned: the section is as tall as the scroll of the whole journey and the
// strip with the stages slides sideways in step with it, with no stops.
function followScroll(
  section: HTMLElement,
  strip: HTMLElement,
  chapters: Chapter[],
  onActive: (id: string) => void,
): () => void {
  const count = chapters.length;
  const lastIndex = count - 1;
  let frame = 0;

  section.style.height = `${count * 100 + END_HOLD}dvh`;
  strip.style.width = `${count * 100}%`;

  const update = () => {
    frame = 0;

    // One screen of scroll moves the strip from one stage to the next.
    const travel = lastIndex * window.innerHeight;
    const scrolled = -section.getBoundingClientRect().top;
    const progress =
      travel > 0 ? Math.min(Math.max(scrolled / travel, 0), 1) : 0;

    strip.style.transform = `translateX(${-progress * lastIndex * (100 / count)}%)`;
    onActive(chapters[Math.round(progress * lastIndex)].id);
  };

  const schedule = () => {
    if (!frame) {
      frame = requestAnimationFrame(update);
    }
  };

  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    cancelAnimationFrame(frame);
    section.style.height = "";
    strip.style.width = "";
    strip.style.transform = "";
  };
}

function Journey({ journey }: JourneyProps) {
  const { chapters } = journey;
  const [activeId, setActiveId] = useState(chapters[0].id);
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const strip = stripRef.current;

    if (!section || !strip) {
      return;
    }

    const pinnedQuery = window.matchMedia(PINNED_QUERY);
    let stopFollowing = () => {};

    const follow = () => {
      stopFollowing();
      stopFollowing = pinnedQuery.matches
        ? followScroll(section, strip, chapters, setActiveId)
        : followReading(section, setActiveId);
    };

    follow();
    pinnedQuery.addEventListener("change", follow);

    return () => {
      pinnedQuery.removeEventListener("change", follow);
      stopFollowing();
    };
  }, [chapters]);

  // Takes the page to the stage of the branch that has been clicked.
  function handleSelect(id: string) {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const reduceMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const behavior = reduceMotion ? "auto" : "smooth";

    if (window.matchMedia(PINNED_QUERY).matches) {
      const index = chapters.findIndex((chapter) => chapter.id === id);
      const top =
        window.scrollY +
        section.getBoundingClientRect().top +
        index * window.innerHeight;

      window.scrollTo({ top, behavior });

      return;
    }

    const slide = Array.from(
      section.querySelectorAll<HTMLElement>("[data-slide]"),
    ).find((element) => element.dataset.chapter === id);

    slide?.scrollIntoView({ behavior, block: "start" });
  }

  const graphStages: BranchGraphStage[] = chapters.map((chapter, index) => ({
    id: chapter.id,
    number: chapter.number,
    slug: chapter.slug,
    kind: getKind(chapter, index === chapters.length - 1),
    commits: chapter.commits.length,
  }));

  return (
    <section
      ref={sectionRef}
      id={SectionId.Journey}
      className={styles.journey}
      aria-labelledby="journey-title"
    >
      <h2 id="journey-title" className={styles.srOnly}>
        Mi recorrido
      </h2>
      <div className={styles.pin}>
        <div className={styles.viewport}>
          <div ref={stripRef} className={styles.panel}>
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={styles.slide}
                data-slide
                data-chapter={chapter.id}
                data-active={chapter.id === activeId ? "" : undefined}
              >
                <Stage chapter={chapter} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.dock}>
          <BranchGraph
            stages={graphStages}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </section>
  );
}

export default Journey;
