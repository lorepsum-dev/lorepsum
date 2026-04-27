import { describe, expect, it } from "vitest";
import { mapEntityModal } from "./mapEntityModal";
import type { Entity, LoreEntityModalPresentation, Relationship } from "./types";

const entity: Entity = {
  id: 1,
  name: "Zeus",
  description: "King of the gods",
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
      values: [{ key: "sky", label: "Sky" }],
    },
    {
      key: "role",
      label: "role",
      values: [{ key: "king", label: "King" }],
    },
    {
      key: "lineage",
      label: "lineage",
      values: [{ key: "god", label: "God" }],
    },
  ],
  groups: [],
};

const parent: Entity = {
  id: 2,
  name: "Cronus",
  description: "Titan parent",
  imageUrl: null,
  entityType: { id: 1, key: "character", label: "Character" },
  categories: [],
  groups: [],
};

const spouse: Entity = {
  id: 3,
  name: "Hera",
  description: "Queen of the gods",
  imageUrl: null,
  entityType: { id: 1, key: "character", label: "Character" },
  categories: [],
  groups: [],
};

const child: Entity = {
  id: 4,
  name: "Ares",
  description: "War god",
  imageUrl: null,
  entityType: { id: 1, key: "character", label: "Character" },
  categories: [],
  groups: [],
};

const relationships: Relationship[] = [
  {
    id: 1,
    sourceEntityId: 2,
    targetEntityId: 1,
    type: {
      id: 1,
      key: "parent_of",
      forwardLabel: "Parent of",
      reverseLabel: "Child of",
      isSymmetric: false,
    },
  },
  {
    id: 2,
    sourceEntityId: 1,
    targetEntityId: 3,
    type: {
      id: 2,
      key: "spouse_of",
      forwardLabel: "Spouse of",
      reverseLabel: "Spouse of",
      isSymmetric: true,
    },
  },
  {
    id: 3,
    sourceEntityId: 1,
    targetEntityId: 4,
    type: {
      id: 1,
      key: "parent_of",
      forwardLabel: "Parent of",
      reverseLabel: "Child of",
      isSymmetric: false,
    },
  },
];

const entityModalPresentation: LoreEntityModalPresentation = {
  badgeRules: [
    {
      id: 1,
      label: "Olympian",
      displayOrder: 1,
      axis: {
        id: 1,
        key: "habitat",
        label: "habitat",
      },
      match: {
        id: 10,
        key: "olympus",
        label: "Olympus",
      },
    },
  ],
  tagAxes: [
    {
      id: 1,
      displayOrder: 1,
      axis: {
        id: 2,
        key: "domain",
        label: "domain",
      },
    },
    {
      id: 2,
      displayOrder: 2,
      axis: {
        id: 3,
        key: "role",
        label: "role",
      },
    },
  ],
};

describe("mapEntityModal", () => {
  it("builds badge, traits, and relationship groups by relationship label from data-driven metadata", () => {
    const modalData = mapEntityModal(entity, relationships, [entity, parent, spouse, child], entityModalPresentation);

    expect(modalData.badgeLabel).toBe("Olympian");
    expect(modalData.relationshipGroups).toEqual([
      {
        key: "parent_of:Child of",
        typeKey: "parent_of",
        label: "Child of",
        relationships: [
          {
            edgeId: 1,
            entity: parent,
          },
        ],
      },
      {
        key: "parent_of:Parent of",
        typeKey: "parent_of",
        label: "Parent of",
        relationships: [
          {
            edgeId: 3,
            entity: child,
          },
        ],
      },
      {
        key: "spouse_of:Spouse of",
        typeKey: "spouse_of",
        label: "Spouse of",
        relationships: [
          {
            edgeId: 2,
            entity: spouse,
          },
        ],
      },
    ]);
    expect(modalData.tagCategories).toEqual(["Sky", "King"]);
    expect(modalData.labeledCategories).toEqual([["habitat", ["Olympus"]], ["lineage", ["God"]]]);
  });
});
