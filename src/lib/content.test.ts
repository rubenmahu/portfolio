import { describe, expect, test } from "vitest";
import { getProfile, getStack } from "./content";

describe("getProfile", () => {
  test("returns the profile fields filled in", async () => {
    const profile = await getProfile();

    expect(profile.name).not.toBe("");
    expect(profile.role).not.toBe("");
    expect(profile.headline).not.toBe("");
    expect(profile.intro).not.toBe("");
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
