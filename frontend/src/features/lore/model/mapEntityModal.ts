import { entityHasCategoryValue } from "./categories";
import type { Entity, EntityModalData, LoreEntityModalPresentation, Relationship } from "./types";

const relationLabels: Record<string, string> = {
  spouse: "Spouse",
  sibling: "Sibling",
  lover: "Lover",
  rival: "Rival",
  ally: "Ally",
};

function getBadgeLabel(entity: Entity, presentation: LoreEntityModalPresentation) {
  for (const rule of presentation.badgeRules) {
    if (entityHasCategoryValue(entity, rule.axis.key, rule.match.key)) {
      return rule.label;
    }
  }

  return null;
}

export function getRelationLabel(kind: string) {
  return relationLabels[kind] ?? kind;
}

export function mapEntityModal(
  entity: Entity,
  relationships: Relationship[],
  entities: Entity[],
  presentation: LoreEntityModalPresentation,
): EntityModalData {
  const tagAxisKeys = new Set(presentation.tagAxes.map((axisRule) => axisRule.axis.key));

  const parents = relationships
    .filter((relationship) => relationship.kind === "parent" && relationship.relatedId === entity.id)
    .map((relationship) => entities.find((candidate) => candidate.id === relationship.entityId))
    .filter((candidate): candidate is Entity => Boolean(candidate));

  const relatedEntities = relationships
    .filter((relationship) => relationship.kind !== "parent" && relationship.entityId === entity.id)
    .map((relationship) => ({
      kind: relationship.kind,
      label: getRelationLabel(relationship.kind),
      entity: entities.find((candidate) => candidate.id === relationship.relatedId),
    }))
    .filter((relationship): relationship is { kind: string; label: string; entity: Entity } => Boolean(relationship.entity));

  return {
    parents,
    relatedEntities,
    initials: entity.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    badgeLabel: getBadgeLabel(entity, presentation),
    tagCategories: entity.categories
      .filter((categoryAxis) => tagAxisKeys.has(categoryAxis.key))
      .flatMap((categoryAxis) => categoryAxis.values.map((value) => value.label)),
    labeledCategories: entity.categories
      .filter((categoryAxis) => !tagAxisKeys.has(categoryAxis.key))
      .map((categoryAxis) => [categoryAxis.label, categoryAxis.values.map((value) => value.label)]),
  };
}
