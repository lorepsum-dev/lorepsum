import type { Entity, EntityModalData, Relationship } from "./types";

const relationLabels: Record<string, string> = {
  spouse: "Spouse",
  sibling: "Sibling",
  lover: "Lover",
  rival: "Rival",
  ally: "Ally",
};

function getBadgeLabel(entity: Entity) {
  if (entity.categories.habitat?.includes("olympus")) {
    return "Olympian";
  }

  if (entity.categories.lineage?.includes("titan")) {
    return "Titan";
  }

  if (entity.categories.lineage?.includes("primordial")) {
    return "Primordial";
  }

  return null;
}

export function getRelationLabel(type: string) {
  return relationLabels[type] ?? type;
}

export function mapEntityModal(
  entity: Entity,
  relationships: Relationship[],
  entities: Entity[],
): EntityModalData {
  const parents = relationships
    .filter((relationship) => relationship.type === "parent" && relationship.related_id === entity.id)
    .map((relationship) => entities.find((candidate) => candidate.id === relationship.entity_id))
    .filter((candidate): candidate is Entity => Boolean(candidate));

  const relatedEntities = relationships
    .filter((relationship) => relationship.type !== "parent" && relationship.entity_id === entity.id)
    .map((relationship) => ({
      type: relationship.type,
      entity: entities.find((candidate) => candidate.id === relationship.related_id),
    }))
    .filter((item): item is { type: string; entity: Entity } => Boolean(item.entity));

  return {
    parents,
    relatedEntities,
    initials: entity.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    badgeLabel: getBadgeLabel(entity),
    tagCategories: Object.entries(entity.categories)
      .filter(([axis]) => axis === "domain" || axis === "role")
      .flatMap(([, values]) => values),
    labeledCategories: Object.entries(entity.categories).filter(
      ([axis]) => axis !== "domain" && axis !== "role",
    ),
  };
}
