import { entityHasCategoryValue } from "./categories";
import type { Entity, LoreSidebarGroup, SidebarEntityGroup } from "./types";

export function groupSidebarEntities(
  entities: Entity[],
  sidebarGroups: LoreSidebarGroup[],
): SidebarEntityGroup[] {
  const sortedEntities = entities.slice().sort((left, right) => left.id - right.id);
  const remainingEntityIds = new Set(sortedEntities.map((entity) => entity.id));

  const groupedSections = sidebarGroups
    .slice()
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((group) => {
      const matchedEntities = sortedEntities.filter((entity) =>
        entityHasCategoryValue(entity, group.axis.key, group.match.key),
      );

      matchedEntities.forEach((entity) => remainingEntityIds.delete(entity.id));

      return {
        id: String(group.id),
        label: group.label,
        entities: matchedEntities,
      };
    })
    .filter((group) => group.entities.length > 0);

  const ungroupedEntities = sortedEntities.filter((entity) => remainingEntityIds.has(entity.id));

  if (ungroupedEntities.length > 0) {
    groupedSections.push({
      id: "ungrouped",
      label: "Other",
      entities: ungroupedEntities,
    });
  }

  return groupedSections;
}
