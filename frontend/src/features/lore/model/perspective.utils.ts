import type { Entity, Relationship } from "./types";

export interface PerspectiveRelatedEntity {
  entity: Entity;
  relationship: Relationship;
}

export interface PerspectiveGroup {
  key: string;
  label: string;
  relationshipTypeId: number;
  isSymmetric: boolean;
  isReverse: boolean;
  entities: PerspectiveRelatedEntity[];
}

export interface PerspectiveData {
  center: Entity;
  groups: PerspectiveGroup[];
}

function getActiveLabel(relationship: Relationship, isReverse: boolean) {
  const { forwardLabel, reverseLabel, key, isSymmetric } = relationship.type;

  if (isSymmetric) {
    return forwardLabel || reverseLabel || key;
  }

  if (isReverse) {
    return reverseLabel || forwardLabel || key;
  }

  return forwardLabel || reverseLabel || key;
}

function getGroupKey(relationship: Relationship, isReverse: boolean) {
  if (relationship.type.isSymmetric) {
    return `${relationship.type.id}:symmetric`;
  }

  return `${relationship.type.id}:${isReverse ? "reverse" : "forward"}`;
}

export function groupRelatedEntities(
  center: Entity,
  entities: Entity[],
  relationships: Relationship[],
): PerspectiveData {
  const entityIndex = new Map(entities.map((entity) => [entity.id, entity]));
  const groupsByKey = new Map<string, PerspectiveGroup>();
  const seenEntityByGroup = new Map<string, Set<number>>();

  relationships.forEach((relationship) => {
    const isSource = relationship.sourceEntityId === center.id;
    const isTarget = relationship.targetEntityId === center.id;

    if (!isSource && !isTarget) {
      return;
    }

    const otherEntityId = isSource ? relationship.targetEntityId : relationship.sourceEntityId;
    const otherEntity = entityIndex.get(otherEntityId);

    if (!otherEntity || otherEntity.id === center.id) {
      return;
    }

    const isReverse = isTarget && !relationship.type.isSymmetric;
    const groupKey = getGroupKey(relationship, isReverse);
    const label = getActiveLabel(relationship, isReverse);

    let group = groupsByKey.get(groupKey);

    if (!group) {
      group = {
        key: groupKey,
        label,
        relationshipTypeId: relationship.type.id,
        isSymmetric: relationship.type.isSymmetric,
        isReverse,
        entities: [],
      };
      groupsByKey.set(groupKey, group);
      seenEntityByGroup.set(groupKey, new Set());
    }

    const seen = seenEntityByGroup.get(groupKey)!;

    if (seen.has(otherEntity.id)) {
      return;
    }

    seen.add(otherEntity.id);
    group.entities.push({ entity: otherEntity, relationship });
  });

  const groups = Array.from(groupsByKey.values()).sort((left, right) => {
    if (left.relationshipTypeId !== right.relationshipTypeId) {
      return left.relationshipTypeId - right.relationshipTypeId;
    }

    if (left.isReverse !== right.isReverse) {
      return left.isReverse ? 1 : -1;
    }

    return 0;
  });

  return { center, groups };
}

export function pickInitialPerspectiveCenter(
  entities: Entity[],
  relationships: Relationship[],
): Entity | null {
  if (entities.length === 0) {
    return null;
  }

  const degreeById = new Map<number, number>();

  relationships.forEach((relationship) => {
    degreeById.set(relationship.sourceEntityId, (degreeById.get(relationship.sourceEntityId) ?? 0) + 1);
    degreeById.set(relationship.targetEntityId, (degreeById.get(relationship.targetEntityId) ?? 0) + 1);
  });

  return entities
    .slice()
    .sort((left, right) => {
      const delta = (degreeById.get(right.id) ?? 0) - (degreeById.get(left.id) ?? 0);
      return delta || left.name.localeCompare(right.name);
    })[0];
}
