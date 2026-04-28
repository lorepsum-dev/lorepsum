import { describe, expect, it } from "vitest";
import { mapCollectibleCard } from "./mapCollectibleCard";
import type { Entity, LoreEntityModalPresentation } from "./types";

const entityModalPresentation: LoreEntityModalPresentation = {
  badgeRules: [
    {
      id: 1,
      label: "Olympian",
      displayOrder: 1,
      axis: { id: 1, key: "habitat", label: "habitat" },
      match: { id: 10, key: "olympus", label: "Olympus" },
    },
  ],
  tagAxes: [
    {
      id: 1,
      displayOrder: 1,
      axis: { id: 2, key: "domain", label: "domain" },
    },
    {
      id: 2,
      displayOrder: 2,
      axis: { id: 3, key: "lineage", label: "lineage" },
    },
  ],
};

const entity: Entity = {
  id: 1,
  name: "Zeus",
  description:
    "King of the gods, ruler of the sky, thunder, law, order, and justice across a very long card-breaking description that keeps going long enough to test a clean two-hundred-character collectible card summary.",
  imageUrl: null,
  entityType: { id: 1, key: "character", label: "Character" },
  categories: [
    {
      key: "habitat",
      label: "habitat",
      values: [{ key: "olympus", label: "Olympus" }],
    },
    {
      key: "domain",
      label: "domain",
      values: [
        { key: "sky", label: "Sky" },
        { key: "thunder", label: "Thunder" },
        { key: "law", label: "Law" },
      ],
    },
    {
      key: "lineage",
      label: "lineage",
      values: [{ key: "god", label: "God" }],
    },
    {
      key: "role",
      label: "role",
      values: [{ key: "king", label: "King" }],
    },
  ],
  groups: [],
};

describe("mapCollectibleCard", () => {
  it("keeps collectible card data short and data-driven", () => {
    const card = mapCollectibleCard(entity, entityModalPresentation);

    expect(card.badgeLabel).toBe("Olympian");
    expect(card.description.length).toBeLessThanOrEqual(200);
    expect(card.axes).toEqual([
      { key: "domain", label: "domain", values: ["Sky", "Thunder"] },
      { key: "lineage", label: "lineage", values: ["God"] },
      { key: "habitat", label: "habitat", values: ["Olympus"] },
    ]);
  });
});
