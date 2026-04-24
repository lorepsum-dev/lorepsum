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

function createRelationship(
  id: number,
  sourceEntityId: number,
  targetEntityId: number,
  isHierarchical: boolean,
): Relationship {
  return {
    id,
    sourceEntityId,
    targetEntityId,
    type: {
      id: isHierarchical ? 1 : 2,
      key: isHierarchical ? "parent_of" : "ally_of",
      familyKey: isHierarchical ? "kinship" : "alliance",
      forwardLabel: isHierarchical ? "Parent of" : "Ally of",
      reverseLabel: isHierarchical ? "Child of" : "Ally of",
      isSymmetric: !isHierarchical,
      isHierarchical,
    },
  };
}

describe("buildTree", () => {
  it("builds a forest from hierarchical relationships", () => {
    const relationships: Relationship[] = [
      createRelationship(1, 1, 2, true),
      createRelationship(2, 2, 3, true),
    ];

    const forest = buildTree(entities, relationships);

    expect(forest).toHaveLength(1);
    expect(forest[0].entity.name).toBe("Chaos");
    expect(forest[0].children[0].entity.name).toBe("Gaia");
    expect(forest[0].children[0].children[0].entity.name).toBe("Uranus");
  });

  it("ignores non-hierarchical relationships", () => {
    const relationships: Relationship[] = [
      createRelationship(3, 1, 2, false),
    ];

    expect(buildTree(entities, relationships)).toEqual([]);
  });
});
