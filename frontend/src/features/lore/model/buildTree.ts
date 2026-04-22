import type { Entity, Relationship, TreeNode } from "./types";

export function buildTree(entities: Entity[], relationships: Relationship[]): TreeNode[] {
  const parentRels = relationships.filter((relationship) => relationship.type === "parent");
  const childIds = new Set(parentRels.map((relationship) => relationship.related_id));
  const inTree = new Set([
    ...parentRels.map((relationship) => relationship.entity_id),
    ...parentRels.map((relationship) => relationship.related_id),
  ]);
  const roots = entities.filter((entity) => !childIds.has(entity.id) && inTree.has(entity.id));
  const placed = new Set<number>();

  const buildNode = (entity: Entity): TreeNode => {
    placed.add(entity.id);

    const children = parentRels
      .filter((relationship) => relationship.entity_id === entity.id)
      .map((relationship) => entities.find((candidate) => candidate.id === relationship.related_id))
      .filter((candidate): candidate is Entity => Boolean(candidate))
      .filter((child) => !placed.has(child.id))
      .map((child) => buildNode(child));

    return {
      entity,
      parents: parentRels
        .filter((relationship) => relationship.related_id === entity.id)
        .map((relationship) => entities.find((candidate) => candidate.id === relationship.entity_id))
        .filter((candidate): candidate is Entity => Boolean(candidate)),
      children,
    };
  };

  return roots.sort((a, b) => a.id - b.id).map((root) => buildNode(root));
}
