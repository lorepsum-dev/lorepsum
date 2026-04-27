import { describe, expect, it } from "vitest";
import { groupSidebarEntities } from "./groupSidebarEntities";
import type { Entity, LoreSidebarGroup } from "./types";

const entities: Entity[] = [
  {
    id: 1,
    name: "Zeus",
    description: "Olympian entity",
    imageUrl: null,
    entityType: { id: 1, key: "character", label: "Character" },
    categories: [
      {
        key: "habitat",
        label: "Habitat",
        values: [{ key: "olympus", label: "Olympus" }],
      },
    ],
    groups: [],
  },
  {
    id: 2,
    name: "Cronus",
    description: "Titan entity",
    imageUrl: null,
    entityType: { id: 1, key: "character", label: "Character" },
    categories: [
      {
        key: "lineage",
        label: "Lineage",
        values: [{ key: "titan", label: "Titan" }],
      },
    ],
    groups: [],
  },
];

const sidebarGroups: LoreSidebarGroup[] = [
  {
    id: 1,
    key: "sidebar-group-1",
    label: "Olympians",
    displayOrder: 1,
    match: {
      id: 1,
      key: "olympus",
      label: "Olympus",
    },
    axis: {
      id: 1,
      key: "habitat",
      label: "Habitat",
    },
  },
];

describe("groupSidebarEntities", () => {
  it("groups entities using stable axis and value keys", () => {
    const groups = groupSidebarEntities(entities, sidebarGroups);

    expect(groups[0]).toEqual({
      id: "1",
      label: "Olympians",
      entities: [entities[0]],
    });
    expect(groups[1]).toEqual({
      id: "ungrouped",
      label: "Other",
      entities: [entities[1]],
    });
  });
});
