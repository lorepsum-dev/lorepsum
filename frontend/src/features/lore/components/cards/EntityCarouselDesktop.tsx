import { cn } from "@/lib/utils";
import type { Entity } from "../../model/types";
import EntityCard from "./EntityCard";

interface VisibleCard {
  entity: Entity;
  position: "left" | "center" | "right";
}

interface EntityCarouselDesktopProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  canGoLeft: boolean;
  canGoRight: boolean;
  visibleCards: VisibleCard[];
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (entityId: number) => void;
  compact: boolean;
}

function EntityCarouselDesktop({
  searchQuery,
  onSearch,
  canGoLeft,
  canGoRight,
  visibleCards,
  onPrevious,
  onNext,
  onSelect,
  compact,
}: EntityCarouselDesktopProps) {
  return (
    <>
      <input
        type="text"
        value={searchQuery}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="search entity..."
        className="w-full max-w-[200px] rounded-lg border border-primary-light/15 bg-transparent px-4 py-2 font-mono text-xs tracking-wide text-foreground placeholder:text-muted-foreground/30 transition-colors focus:border-primary-light/40 focus:outline-none"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={onPrevious}
          disabled={!canGoLeft}
          aria-label="Previous entity"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none",
            canGoLeft
              ? "border-primary-light/30 text-primary-light/60 hover:border-primary-light/60 hover:text-primary-light"
              : "cursor-not-allowed border-primary-light/10 text-primary-light/15",
          )}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          {visibleCards.map(({ entity, position }) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              position={position}
              onSelect={() => onSelect(entity.id)}
              compact={compact}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={!canGoRight}
          aria-label="Next entity"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none",
            canGoRight
              ? "border-primary-light/30 text-primary-light/60 hover:border-primary-light/60 hover:text-primary-light"
              : "cursor-not-allowed border-primary-light/10 text-primary-light/15",
          )}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </>
  );
}

export default EntityCarouselDesktop;
