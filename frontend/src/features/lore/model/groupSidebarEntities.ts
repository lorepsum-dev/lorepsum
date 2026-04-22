import type { Entity, LoreSidebarGroup, SidebarEntityGroup } from "./types";

export function groupSidebarEntities(
  entities: Entity[],
  sidebarGroups: LoreSidebarGroup[],
): SidebarEntityGroup[] {
  const sortedEntities = entities.slice().sort((a, b) => a.id - b.id);
  const remainingEntities = new Set(sortedEntities.map((entity) => entity.id));

  const groupedSections = sidebarGroups
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((group) => {
      const matchedEntities = sortedEntities.filter((entity) =>
        entity.categories[group.axis.name]?.includes(group.match_value),
      );

      matchedEntities.forEach((entity) => remainingEntities.delete(entity.id));

      return {
        id: String(group.id),
        label: group.label,
        entities: matchedEntities,
      };
    })
    .filter((group) => group.entities.length > 0);

  const ungroupedEntities = sortedEntities.filter((entity) => remainingEntities.has(entity.id));

  if (ungroupedEntities.length > 0) {
    groupedSections.push({
      id: "ungrouped",
      label: "Other",
      entities: ungroupedEntities,
    });
  }

  return groupedSections;
}
