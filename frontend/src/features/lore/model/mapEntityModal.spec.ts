import { describe, expect, it } from "vitest";
import { mapEntityModal } from "./mapEntityModal";
import type { Entity, LoreEntityModalPresentation, Relationship } from "./types";

const entity: Entity = {
  id: 1,
  name: "Zeus",
  description: "King of the gods",
  avatarUrl: null,
  gender: "male",
  origin: "Greece",
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
  avatarUrl: null,
  gender: "male",
  origin: "Greece",
  categories: [],
  groups: [],
};

const relationships: Relationship[] = [
  {
    entityId: 2,
    relatedId: 1,
    kind: "parent",
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
  it("builds badge and tag categories from data-driven presentation rules", () => {
    const modalData = mapEntityModal(entity, relationships, [entity, parent], entityModalPresentation);

    expect(modalData.badgeLabel).toBe("Olympian");
    expect(modalData.parents).toEqual([parent]);
    expect(modalData.tagCategories).toEqual(["Sky", "King"]);
    expect(modalData.labeledCategories).toEqual([["habitat", ["Olympus"]], ["lineage", ["God"]]]);
  });
});
