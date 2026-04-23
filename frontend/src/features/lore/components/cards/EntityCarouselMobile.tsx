import type { RefObject } from "react";
import { cn } from "@/lib/utils";
import type { Entity } from "../../model/types";
import EntityCard from "./EntityCard";

interface EntityCarouselMobileProps {
  entities: Entity[];
  centerIndex: number;
  searchQuery: string;
  canGoLeft: boolean;
  canGoRight: boolean;
  onSearch: (query: string) => void;
  onScroll: () => void;
  setCardRef: (index: number, element: HTMLDivElement | null) => void;
  onSelectIndex: (index: number) => void;
  scrollRef: RefObject<HTMLDivElement>;
}

function EntityCarouselMobile({
  entities,
  centerIndex,
  searchQuery,
  canGoLeft,
  canGoRight,
  onSearch,
  onScroll,
  setCardRef,
  onSelectIndex,
  scrollRef,
}: EntityCarouselMobileProps) {
  const dotCount = Math.min(entities.length, 3);
  const hasDots = dotCount > 1;

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 pt-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="search entity..."
        className="w-full max-w-[200px] shrink-0 rounded-lg border border-primary-light/15 bg-transparent px-4 py-2 font-mono text-xs tracking-wide text-foreground placeholder:text-muted-foreground/30 transition-colors focus:border-primary-light/40 focus:outline-none"
      />

      <div className="flex min-h-0 w-full flex-1 items-center justify-center gap-3 px-4">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex-1 overflow-y-scroll"
          style={{
            scrollSnapType: "y mandatory",
            scrollbarWidth: "none",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
          }}
        >
          {entities.map((entity, index) => (
            <div
              key={entity.id}
              ref={(element) => setCardRef(index, element)}
              className="flex shrink-0 items-center justify-center py-3"
              style={{ scrollSnapAlign: "center" }}
            >
              <EntityCard
                entity={entity}
                position={index === centerIndex ? "center" : "left"}
                onSelect={() => onSelectIndex(index)}
                compact
              />
            </div>
          ))}
        </div>

        {hasDots && (
          <div className="flex flex-col items-center gap-1.5">
            {dotCount === 2 ? (
              [0, 1].map((index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    index === centerIndex ? "h-4 w-1.5 bg-primary-light/70" : "h-1.5 w-1.5 bg-primary-light/20",
                  )}
                />
              ))
            ) : (
              <>
                <div className={cn("rounded-full transition-all duration-300", canGoLeft ? "h-1.5 w-1.5 bg-primary-light/30" : "h-1 w-1 bg-primary-light/10")} />
                <div className="h-4 w-1.5 rounded-full bg-primary-light/70" />
                <div className={cn("rounded-full transition-all duration-300", canGoRight ? "h-1.5 w-1.5 bg-primary-light/30" : "h-1 w-1 bg-primary-light/10")} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EntityCarouselMobile;
