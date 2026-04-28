import { useMemo } from "react";
import {
  groupRelatedEntities,
  pickInitialPerspectiveCenter,
  type PerspectiveData,
} from "../model/perspective.utils";
import type { Entity, Relationship } from "../model/types";

interface UsePerspectiveDataOptions {
  entities: Entity[];
  relationships: Relationship[];
  centerEntityId: number | null;
}

export function usePerspectiveData({
  entities,
  relationships,
  centerEntityId,
}: UsePerspectiveDataOptions): PerspectiveData | null {
  const resolvedCenter = useMemo(() => {
    if (centerEntityId !== null) {
      return entities.find((entity) => entity.id === centerEntityId) ?? null;
    }

    return pickInitialPerspectiveCenter(entities, relationships);
  }, [centerEntityId, entities, relationships]);

  return useMemo(() => {
    if (!resolvedCenter) {
      return null;
    }

    return groupRelatedEntities(resolvedCenter, entities, relationships);
  }, [entities, relationships, resolvedCenter]);
}
