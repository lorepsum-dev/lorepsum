import { entityHasCategoryValue } from "./categories";
import type { Entity, EntityModalData, LoreEntityModalPresentation, Relationship } from "./types";

function getBadgeLabel(entity: Entity, presentation: LoreEntityModalPresentation) {
  for (const rule of presentation.badgeRules) {
    if (entityHasCategoryValue(entity, rule.axis.key, rule.match.key)) {
      return rule.label;
    }
  }

  return null;
}

export function mapEntityModal(
  entity: Entity,
  relationships: Relationship[],
  entities: Entity[],
  presentation: LoreEntityModalPresentation,
): EntityModalData {
  const tagAxisKeys = new Set(presentation.tagAxes.map((axisRule) => axisRule.axis.key));
  const relationshipGroupsByKey = new Map<string, EntityModalData["relationshipGroups"][number]>();

  const relatedRelationships = relationships
    .filter((relationship) => relationship.sourceEntityId === entity.id || relationship.targetEntityId === entity.id)
    .map((relationship) => {
      const isSource = relationship.sourceEntityId === entity.id;
      const relatedEntityId = isSource ? relationship.targetEntityId : relationship.sourceEntityId;
      const relatedEntity = entities.find((candidate) => candidate.id === relatedEntityId);

      if (!relatedEntity) {
        return null;
      }

      return {
        edgeId: relationship.id,
        typeKey: relationship.type.key,
        label: isSource || relationship.type.isSymmetric
          ? relationship.type.forwardLabel
          : relationship.type.reverseLabel,
        entity: relatedEntity,
      };
    })
    .filter((relationship): relationship is NonNullable<typeof relationship> => Boolean(relationship))
    .sort((left, right) => {
      if (left.label !== right.label) {
        return left.label.localeCompare(right.label);
      }

      return left.entity.name.localeCompare(right.entity.name);
    });

  relatedRelationships.forEach((relationship) => {
    const groupKey = `${relationship.typeKey}:${relationship.label}`;
    const existingGroup = relationshipGroupsByKey.get(groupKey);

    if (existingGroup) {
      existingGroup.relationships.push({
        edgeId: relationship.edgeId,
        entity: relationship.entity,
      });
      return;
    }

    relationshipGroupsByKey.set(groupKey, {
      key: groupKey,
      typeKey: relationship.typeKey,
      label: relationship.label,
      relationships: [
        {
          edgeId: relationship.edgeId,
          entity: relationship.entity,
        },
      ],
    });
  });

  return {
    relationshipGroups: Array.from(relationshipGroupsByKey.values()),
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
