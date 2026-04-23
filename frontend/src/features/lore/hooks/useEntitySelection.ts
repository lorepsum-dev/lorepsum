import { useCallback, useMemo, useState } from "react";
import type { Entity } from "../model/types";

function useEntitySelection(entities: Entity[]) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedEntity = useMemo(
    () => entities.find((entity) => entity.id === selectedId) ?? null,
    [entities, selectedId],
  );

  const toggleEntitySelection = useCallback((id: number) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  return {
    selectedId,
    selectedEntity,
    toggleEntitySelection,
    clearSelection,
  };
}

export { useEntitySelection };
