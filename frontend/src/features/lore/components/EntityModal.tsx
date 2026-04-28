import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import CollectibleCard from "./cards/CollectibleCard";
import CollectibleCardBack from "./cards/CollectibleCardBack";
import type { Entity, LoreEntityModalPresentation, Relationship } from "../model/types";

interface EntityModalProps {
  entity: Entity;
  entities: Entity[];
  relationships: Relationship[];
  entityModalPresentation: LoreEntityModalPresentation;
  onClose: () => void;
}

function EntityModal({
  entity,
  entityModalPresentation,
  onClose,
}: EntityModalProps) {
  const [isShowingBack, setIsShowingBack] = useState(false);

  useEffect(() => {
    setIsShowingBack(false);
  }, [entity.id]);

  const handleCardToggle = () => setIsShowingBack((current) => !current);

  return (
    <>
      <div
        className="fixed inset-0 z-40 animate-in fade-in bg-background/60 backdrop-blur-sm duration-200"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[min(30rem,98vw)] -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 px-2 duration-300">
        <button
          onClick={onClose}
          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-primary-light/15 bg-secondary/80 text-3xl leading-none text-muted-foreground/60 transition hover:border-primary-light/40 hover:text-primary-light"
        >
          x
        </button>

        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <button
            onClick={handleCardToggle}
            aria-label="Show card front"
            className={cn(
              "shrink-0 transition-all duration-300 focus:outline-none",
              isShowingBack
                ? "text-primary-light/70 drop-shadow-[0_0_10px_hsl(var(--primary-light)/0.5)] hover:text-primary-light"
                : "text-primary-light/15 hover:text-primary-light/35",
            )}
          >
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
              <path
                d="M30 10 C 20 10, 10 15, 10 30 C 10 45, 20 50, 30 50 M 30 50 L 22 42 M 30 50 L 22 58"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="min-w-0 shrink-0" style={{ perspective: "1200px" }}>
            <div
              className="relative h-[35rem] w-[20rem]"
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)",
                transform: isShowingBack ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  pointerEvents: isShowingBack ? "none" : "auto",
                }}
              >
                <CollectibleCard
                  entity={entity}
                  presentation={entityModalPresentation}
                  size="lg"
                />
              </div>

              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  pointerEvents: isShowingBack ? "auto" : "none",
                }}
              >
                <CollectibleCardBack size="lg" alt={`${entity.name} card back`} />
              </div>
            </div>
          </div>

          <button
            onClick={handleCardToggle}
            aria-label="Show card back"
            className={cn(
              "shrink-0 transition-all duration-300 focus:outline-none",
              !isShowingBack
                ? "text-primary-light/70 drop-shadow-[0_0_10px_hsl(var(--primary-light)/0.5)] hover:text-primary-light"
                : "text-primary-light/15 hover:text-primary-light/35",
            )}
          >
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
              <path
                d="M30 10 C 40 10, 50 15, 50 30 C 50 45, 40 50, 30 50 M 30 50 L 38 42 M 30 50 L 38 58"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default EntityModal;
