import { describe, expect, it } from "vitest";
import { groupEntitiesByType } from "./groupEntitiesByType";
import type { Entity } from "./types";

const character: Entity = {
  id: 10,
  name: "Zeus",
  description: "",
  imageUrl: null,
  entityType: { id: 1, key: "character", label: "Character" },
  categories: [],
  groups: [],
};

const olderCharacter: Entity = {
  id: 11,
  name: "Cronus",
  description: "",
  imageUrl: null,
  entityType: { id: 1, key: "character", label: "Character" },
  categories: [],
  groups: [],
};

const place: Entity = {
  id: 20,
  name: "Olympus",
  description: "",
  imageUrl: null,
  entityType: { id: 2, key: "place", label: "Place" },
  categories: [],
  groups: [],
};

describe("groupEntitiesByType", () => {
  it("groups entities by type key, sorts groups by entityType id, and sorts entities by name", () => {
    const groups = groupEntitiesByType([place, character, olderCharacter]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toEqual({
      id: "character",
      label: "Character",
      entities: [olderCharacter, character],
    });
    expect(groups[1]).toEqual({
      id: "place",
      label: "Place",
      entities: [place],
    });
  });
});
