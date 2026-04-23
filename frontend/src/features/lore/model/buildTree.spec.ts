import { describe, expect, it } from "vitest";
import { buildTree } from "./buildTree";
import type { Entity, Relationship } from "./types";

const entities: Entity[] = [
  {
    id: 1,
    name: "Chaos",
    description: "Root entity",
    avatarUrl: null,
    gender: null,
    origin: null,
    categories: [],
    groups: [],
  },
  {
    id: 2,
    name: "Gaia",
    description: "Child entity",
    avatarUrl: null,
    gender: null,
    origin: null,
    categories: [],
    groups: [],
  },
  {
    id: 3,
    name: "Uranus",
    description: "Second child entity",
    avatarUrl: null,
    gender: null,
    origin: null,
    categories: [],
    groups: [],
  },
];

describe("buildTree", () => {
  it("builds a forest from parent relationships", () => {
    const relationships: Relationship[] = [
      { entityId: 1, relatedId: 2, kind: "parent" },
      { entityId: 2, relatedId: 3, kind: "parent" },
    ];

    const forest = buildTree(entities, relationships);

    expect(forest).toHaveLength(1);
    expect(forest[0].entity.name).toBe("Chaos");
    expect(forest[0].children[0].entity.name).toBe("Gaia");
    expect(forest[0].children[0].children[0].entity.name).toBe("Uranus");
  });

  it("ignores non-hierarchy relationships", () => {
    const relationships: Relationship[] = [
      { entityId: 1, relatedId: 2, kind: "ally" },
    ];

    expect(buildTree(entities, relationships)).toEqual([]);
  });
});
