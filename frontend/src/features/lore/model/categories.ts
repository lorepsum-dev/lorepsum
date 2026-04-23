import type { Entity, EntityCategoryAxis } from "./types";

function getEntityCategoryAxis(entity: Entity, axisKey: string): EntityCategoryAxis | null {
  return entity.categories.find((axis) => axis.key === axisKey) ?? null;
}

function entityHasCategoryValue(entity: Entity, axisKey: string, valueKey: string) {
  return getEntityCategoryAxis(entity, axisKey)?.values.some((value) => value.key === valueKey) ?? false;
}

export { entityHasCategoryValue, getEntityCategoryAxis };
