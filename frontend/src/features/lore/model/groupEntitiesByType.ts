import type { Entity, SidebarEntityGroup } from "./types";

export function groupEntitiesByType(entities: Entity[]): SidebarEntityGroup[] {
  const groupsByKey = new Map<string, SidebarEntityGroup>();

  entities.forEach((entity) => {
    const key = entity.entityType.key || "uncategorized";
    let group = groupsByKey.get(key);

    if (!group) {
      group = {
        id: key,
        label: entity.entityType.label || "Other",
        entities: [],
      };
      groupsByKey.set(key, group);
    }

    group.entities.push(entity);
  });

  return Array.from(groupsByKey.values())
    .map((group) => ({
      ...group,
      entities: group.entities.slice().sort((left, right) => left.name.localeCompare(right.name)),
    }))
    .sort((left, right) => left.entities[0].entityType.id - right.entities[0].entityType.id);
}
