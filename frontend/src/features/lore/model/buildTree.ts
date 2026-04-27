import type { Entity, Relationship, TreeNode } from "./types";

const TREE_RELATIONSHIP_TYPE_KEY = "parent_of";

export function buildTree(entities: Entity[], relationships: Relationship[]): TreeNode[] {
  const entitiesById = new Map(entities.map((entity) => [entity.id, entity]));
  const parentLinks = relationships.filter((relationship) => relationship.type.key === TREE_RELATIONSHIP_TYPE_KEY);
  const childrenByParentId = new Map<number, number[]>();
  const parentsByChildId = new Map<number, number[]>();

  for (const relationship of parentLinks) {
    const childIds = childrenByParentId.get(relationship.sourceEntityId) ?? [];
    childIds.push(relationship.targetEntityId);
    childrenByParentId.set(relationship.sourceEntityId, childIds);

    const parentIds = parentsByChildId.get(relationship.targetEntityId) ?? [];
    parentIds.push(relationship.sourceEntityId);
    parentsByChildId.set(relationship.targetEntityId, parentIds);
  }

  const linkedEntityIds = new Set<number>([
    ...childrenByParentId.keys(),
    ...parentsByChildId.keys(),
  ]);

  const rootIds = Array.from(linkedEntityIds)
    .filter((entityId) => !parentsByChildId.has(entityId))
    .sort((left, right) => left - right);

  const primaryParentIdByChildId = new Map<number, number>();

  for (const relationship of parentLinks) {
    const currentParentId = primaryParentIdByChildId.get(relationship.targetEntityId);

    if (currentParentId === undefined || relationship.sourceEntityId < currentParentId) {
      primaryParentIdByChildId.set(relationship.targetEntityId, relationship.sourceEntityId);
    }
  }

  const visitedIds = new Set<number>();

  const buildNode = (entityId: number): TreeNode | null => {
    const entity = entitiesById.get(entityId);

    if (!entity || visitedIds.has(entityId)) {
      return null;
    }

    visitedIds.add(entityId);

    const children = (childrenByParentId.get(entityId) ?? [])
      .filter((childId) => primaryParentIdByChildId.get(childId) === entityId)
      .map((childId) => buildNode(childId))
      .filter((child): child is TreeNode => child !== null);

    const parents = (parentsByChildId.get(entityId) ?? [])
      .map((parentId) => entitiesById.get(parentId))
      .filter((parent): parent is Entity => Boolean(parent));

    return {
      entity,
      children,
      parents,
    };
  };

  return rootIds
    .map((entityId) => buildNode(entityId))
    .filter((root): root is TreeNode => root !== null);
}
