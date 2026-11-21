import { describe, expect, test } from "vitest";
import { getContact, getJourney, getProfile } from "./content";

describe("getProfile", () => {
  test("returns the profile fields filled in", async () => {
    const profile = await getProfile();

    expect(profile.name).not.toBe("");
    expect(profile.role).not.toBe("");
    expect(profile.headline).not.toBe("");
    expect(profile.intro).not.toBe("");
    expect(profile.description).not.toBe("");
  });

  test("uses an https site URL", async () => {
    const { siteUrl } = await getProfile();

    expect(siteUrl).toMatch(/^https:\/\//);
  });
});

describe("getJourney", () => {
  test("returns the chapters in order: origin, robotics, trains, web", async () => {
    const { chapters } = await getJourney();

    expect(chapters.map((chapter) => chapter.id)).toEqual([
      "origin",
      "robotics",
      "trains",
      "web",
    ]);
  });

  test("every chapter is filled in", async () => {
    const { chapters } = await getJourney();

    for (const chapter of chapters) {
      expect(chapter.number).not.toBe("");
      expect(chapter.label).not.toBe("");
      expect(chapter.title).not.toBe("");
      expect(chapter.branch).not.toBe("");
      expect(chapter.slug).not.toBe("");
      expect(chapter.commits).toHaveLength(3);
    }
  });

  test("every commit is filled in and has a short hash", async () => {
    const { chapters } = await getJourney();
    const commits = chapters.flatMap((chapter) => chapter.commits);

    for (const commit of commits) {
      expect(commit.hash).toMatch(/^[0-9a-f]{7}$/);
      expect(commit.message).not.toBe("");
      expect(commit.tags.length).toBeGreaterThan(0);
    }
  });

  test("uses unique commit hashes", async () => {
    const { chapters } = await getJourney();
    const hashes = chapters.flatMap((chapter) =>
      chapter.commits.map((commit) => commit.hash),
    );

    expect(new Set(hashes).size).toBe(hashes.length);
  });

  test("uses unique ids and numbers", async () => {
    const { chapters } = await getJourney();
    const ids = chapters.map((chapter) => chapter.id);
    const numbers = chapters.map((chapter) => chapter.number);
    const slugs = chapters.map((chapter) => chapter.slug);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

// Every text of the journey that is shown. A placeholder between brackets, like
// "[What I learned]", must never be published: leave the field out instead.
function collectTexts(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectTexts);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectTexts);
  }

  return [];
}

describe("the content has no placeholders", () => {
  test("the journey has no text between brackets", async () => {
    const texts = collectTexts(await getJourney());

    expect(texts.filter((text) => /[[\]]/.test(text))).toEqual([]);
  });

  test("the optional texts are not empty when they are there", async () => {
    const { chapters } = await getJourney();

    for (const chapter of chapters) {
      if (chapter.summary !== undefined) {
        expect(chapter.summary.trim()).not.toBe("");
      }
      for (const commit of chapter.commits) {
        if (commit.description !== undefined) {
          expect(commit.description.trim()).not.toBe("");
        }
      }
    }
  });
});

describe("getContact", () => {
  test("returns at least one link with label and href", async () => {
    const { links } = await getContact();

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.label).not.toBe("");
      expect(link.href).not.toBe("");
    }
  });

  test("uses unique ids and hrefs with a protocol", async () => {
    const { links } = await getContact();
    const ids = links.map((link) => link.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const link of links) {
      expect(link.href).toMatch(/^(https:\/\/|mailto:)/);
    }
  });
});
