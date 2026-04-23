import { useCallback, useMemo, useState } from "react";
import type { Entity } from "../model/types";

interface CarouselCard {
  entity: Entity;
  position: "left" | "center" | "right";
}

function useEntityCarousel(
  entities: Entity[],
  onSelectEntity: (id: number) => void,
) {
  const [centerIndex, setCenterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const selectIndex = useCallback((index: number) => {
    const entity = entities[index];

    if (!entity) {
      return;
    }

    setCenterIndex(index);
    onSelectEntity(entity.id);
  }, [entities, onSelectEntity]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      return;
    }

    const nextIndex = entities.findIndex((entity) =>
      entity.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (nextIndex !== -1) {
      setCenterIndex(nextIndex);
    }
  }, [entities]);

  const visibleCards = useMemo<Array<CarouselCard>>(() => {
    if (entities.length === 0) {
      return [];
    }

    if (entities.length === 1) {
      return [{ entity: entities[0], position: "center" }];
    }

    if (entities.length === 2) {
      if (centerIndex === 0) {
        return [
          { entity: entities[0], position: "center" },
          { entity: entities[1], position: "right" },
        ];
      }

      return [
        { entity: entities[0], position: "left" },
        { entity: entities[1], position: "center" },
      ];
    }

    const cards: CarouselCard[] = [];

    if (centerIndex > 0) {
      cards.push({ entity: entities[centerIndex - 1], position: "left" });
    }

    cards.push({ entity: entities[centerIndex], position: "center" });

    if (centerIndex < entities.length - 1) {
      cards.push({ entity: entities[centerIndex + 1], position: "right" });
    }

    return cards;
  }, [centerIndex, entities]);

  return {
    centerIndex,
    searchQuery,
    visibleCards,
    canGoLeft: centerIndex > 0,
    canGoRight: centerIndex < entities.length - 1,
    selectIndex,
    goToPrevious: () => setCenterIndex((current) => Math.max(0, current - 1)),
    goToNext: () => setCenterIndex((current) => Math.min(entities.length - 1, current + 1)),
    handleSearch,
  };
}

export { useEntityCarousel };
