import { describe, expect, it } from "vitest";
import { buildTree } from "./buildTree";
import type { Entity, Relationship } from "./types";

const entities: Entity[] = [
  {
    id: 1,
    name: "Chaos",
    description: "Root entity",
    imageUrl: null,
    entityType: { id: 1, key: "character", label: "Character" },
    categories: [],
    groups: [],
  },
  {
    id: 2,
    name: "Gaia",
    description: "Child entity",
    imageUrl: null,
    entityType: { id: 1, key: "character", label: "Character" },
    categories: [],
    groups: [],
  },
  {
    id: 3,
    name: "Uranus",
    description: "Second child entity",
    imageUrl: null,
    entityType: { id: 1, key: "character", label: "Character" },
    categories: [],
    groups: [],
  },
];

function createRelationship(
  id: number,
  sourceEntityId: number,
  targetEntityId: number,
  isTreeRelationship: boolean,
): Relationship {
  return {
    id,
    sourceEntityId,
    targetEntityId,
    type: {
      id: isTreeRelationship ? 1 : 2,
      key: isTreeRelationship ? "parent_of" : "associated_with",
      forwardLabel: isTreeRelationship ? "Parent of" : "Associated with",
      reverseLabel: isTreeRelationship ? "Child of" : "Associated with",
      isSymmetric: !isTreeRelationship,
    },
  };
}

describe("buildTree", () => {
  it("builds a forest from parent relationships", () => {
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

  it("ignores relationships that are not tree projections", () => {
    const relationships: Relationship[] = [
      createRelationship(3, 1, 2, false),
    ];

    expect(buildTree(entities, relationships)).toEqual([]);
  });
});
