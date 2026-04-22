import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Entity } from "../model/types";

interface LoreCardsSectionProps {
  entities: Entity[];
  isLoading: boolean;
  onSelectEntity: (id: number) => void;
}

const EntityCard = ({
  entity,
  position,
  onSelect,
}: {
  entity: Entity;
  position: "left" | "center" | "right";
  onSelect: () => void;
}) => {
  const isCenter = position === "center";
  const initials = entity.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-52 shrink-0 flex-col items-center gap-3 rounded-xl border px-6 py-7 transition-all duration-300 focus:outline-none",
        isCenter
          ? "scale-105 border-primary-light/40 bg-primary/10 opacity-100 shadow-[0_0_20px_hsl(var(--primary-light)/0.12)]"
          : "scale-95 border-primary-light/10 bg-transparent opacity-40 hover:opacity-55",
      )}
    >
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full border font-display text-lg font-bold",
          isCenter
            ? "border-primary-light/50 text-primary-light"
            : "border-primary-light/20 text-primary-light/40",
        )}
      >
        {entity.avatar_url ? (
          <img
            src={entity.avatar_url}
            alt={entity.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <span
        className={cn(
          "text-center font-display text-sm font-semibold leading-tight",
          isCenter ? "text-foreground" : "text-foreground/40",
        )}
      >
        {entity.name}
      </span>

      {isCenter && entity.origin && (
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary-light/40">
          {entity.origin}
        </span>
      )}

      {isCenter && entity.description && (
        <p className="line-clamp-3 text-center font-mono text-[11px] leading-relaxed text-muted-foreground/55">
          {entity.description}
        </p>
      )}
    </button>
  );
};

const LoreCardsSection = ({
  entities,
  isLoading,
  onSelectEntity,
}: LoreCardsSectionProps) => {
  const [centerIndex, setCenterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) return;
      const idx = entities.findIndex((e) =>
        e.name.toLowerCase().includes(query.toLowerCase()),
      );
      if (idx !== -1) setCenterIndex(idx);
    },
    [entities],
  );

  const canGoLeft = centerIndex > 0;
  const canGoRight = centerIndex < entities.length - 1;

  const visibleCards = (): Array<{ entity: Entity; position: "left" | "center" | "right" }> => {
    if (entities.length === 0) return [];

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

    // 3+ entities
    const result: Array<{ entity: Entity; position: "left" | "center" | "right" }> = [];
    if (centerIndex > 0) result.push({ entity: entities[centerIndex - 1], position: "left" });
    result.push({ entity: entities[centerIndex], position: "center" });
    if (centerIndex < entities.length - 1) result.push({ entity: entities[centerIndex + 1], position: "right" });
    return result;
  };

  const cards = visibleCards();
  const dotCount = Math.min(entities.length, 3);
  const hasDots = dotCount > 1;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="h-9 w-48 rounded-lg" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex gap-4">
            <Skeleton className="h-48 w-52 rounded-xl opacity-40" />
            <Skeleton className="h-48 w-52 rounded-xl" />
            <Skeleton className="h-48 w-52 rounded-xl opacity-40" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      {/* Search bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="search entity..."
        className="mb-8 w-full max-w-[200px] rounded-lg border border-primary-light/15 bg-transparent px-4 py-2 font-mono text-xs tracking-wide text-foreground placeholder:text-muted-foreground/30 transition-colors focus:border-primary-light/40 focus:outline-none"
      />

      {/* Carousel */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCenterIndex((i) => i - 1)}
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
          {cards.map(({ entity, position }) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              position={position}
              onSelect={() => onSelectEntity(entity.id)}
            />
          ))}
        </div>

        <button
          onClick={() => setCenterIndex((i) => i + 1)}
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

      {/* Indicator dots */}
      {hasDots && (
        <div className="mt-5 flex items-center gap-2">
          {dotCount === 2 ? (
            [0, 1].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === centerIndex
                    ? "h-1.5 w-4 bg-primary-light/70"
                    : "h-1.5 w-1.5 bg-primary-light/20",
                )}
              />
            ))
          ) : (
            <>
              <div className={cn("h-1.5 w-1.5 rounded-full transition-all duration-300", canGoLeft ? "bg-primary-light/30" : "bg-primary-light/10")} />
              <div className="h-1.5 w-4 rounded-full bg-primary-light/70" />
              <div className={cn("h-1.5 w-1.5 rounded-full transition-all duration-300", canGoRight ? "bg-primary-light/30" : "bg-primary-light/10")} />
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default LoreCardsSection;
