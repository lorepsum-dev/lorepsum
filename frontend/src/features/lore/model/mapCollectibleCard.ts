import { entityHasCategoryValue } from "./categories";
import type { CollectibleCardData, Entity, LoreEntityModalPresentation } from "./types";

const DESCRIPTION_LIMIT = 200;
const AXIS_LIMIT = 3;
const VALUES_PER_AXIS_LIMIT = 2;

function truncateText(value: string, limit: number) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, limit - 3).trimEnd()}...`;
}

function getBadgeLabel(entity: Entity, presentation: LoreEntityModalPresentation) {
  for (const rule of presentation.badgeRules) {
    if (entityHasCategoryValue(entity, rule.axis.key, rule.match.key)) {
      return rule.label;
    }
  }

  return null;
}

function getPresentationAxisOrder(presentation: LoreEntityModalPresentation) {
  return new Map(
    presentation.tagAxes.map((axisRule, index) => [axisRule.axis.key, axisRule.displayOrder || index]),
  );
}

export function mapCollectibleCard(
  entity: Entity,
  presentation: LoreEntityModalPresentation,
): CollectibleCardData {
  const axisOrder = getPresentationAxisOrder(presentation);
  const orderedCategories = entity.categories
    .filter((axis) => axis.values.length > 0)
    .sort((left, right) => {
      const leftOrder = axisOrder.get(left.key) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = axisOrder.get(right.key) ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.label.localeCompare(right.label);
    });

  const primaryCategories = orderedCategories.filter((axis) => axisOrder.has(axis.key));
  const fallbackDetails = [
    ...entity.groups.map((group) => ({
      key: `group:${group.key}`,
      label: "group",
      values: [{ key: group.key, label: group.label }],
    })),
    ...orderedCategories.filter((axis) => !axisOrder.has(axis.key)),
  ];

  return {
    badgeLabel: getBadgeLabel(entity, presentation),
    description: truncateText(entity.description, DESCRIPTION_LIMIT),
    axes: [...primaryCategories, ...fallbackDetails]
      .slice(0, AXIS_LIMIT)
      .map((axis) => ({
        key: axis.key,
        label: axis.label,
        values: axis.values.slice(0, VALUES_PER_AXIS_LIMIT).map((value) => value.label),
      })),
  };
}
