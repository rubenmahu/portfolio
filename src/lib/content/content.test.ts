import { describe, expect, test } from "vitest";
import { getContact, getExperience, getProfile, getStack } from "./content";

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

describe("getStack", () => {
  test("returns at least one group and every group has items", async () => {
    const { groups } = await getStack();

    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      expect(group.name).not.toBe("");
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  test("uses unique ids across groups and items", async () => {
    const { groups } = await getStack();
    const groupIds = groups.map((group) => group.id);
    const itemIds = groups.flatMap((group) => group.items.map((i) => i.id));

    expect(new Set(groupIds).size).toBe(groupIds.length);
    expect(new Set(itemIds).size).toBe(itemIds.length);
  });
});

describe("getExperience", () => {
  test("returns at least one job and every job is filled in", async () => {
    const { jobs } = await getExperience();

    expect(jobs.length).toBeGreaterThan(0);
    for (const job of jobs) {
      expect(job.company).not.toBe("");
      expect(job.role).not.toBe("");
      expect(job.period).not.toBe("");
      expect(job.highlights.length).toBeGreaterThan(0);
    }
  });

  test("uses unique ids", async () => {
    const { jobs } = await getExperience();
    const ids = jobs.map((job) => job.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getContact", () => {
  test("returns an intro and at least one link with label and href", async () => {
    const { intro, links } = await getContact();

    expect(intro).not.toBe("");
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
