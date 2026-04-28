import { cn } from "@/lib/utils";
import { useEntityImage } from "../../hooks/useEntityImage";
import type { Entity } from "../../model/types";

interface EntityCardProps {
  entity: Entity;
  position: "left" | "center" | "right";
  onSelect: () => void;
  compact: boolean;
}

function EntityCard({ entity, position, onSelect, compact }: EntityCardProps) {
  const isCenter = position === "center";
  const { imageSrc, onImageError } = useEntityImage(entity.imageUrl);

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative flex shrink-0 flex-col overflow-hidden rounded-xl border transition-all duration-300 focus:outline-none",
        compact ? "w-40" : "w-52",
        isCenter
          ? "scale-105 border-primary-light/40 bg-primary/10 opacity-100 shadow-[0_0_20px_hsl(var(--primary-light)/0.12)]"
          : "scale-95 border-primary-light/10 bg-transparent opacity-40 hover:opacity-55",
      )}
      style={{ aspectRatio: "3 / 4" }}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        <img
          src={imageSrc}
          alt={entity.name}
          onError={onImageError}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>

      <div
        className={cn(
          "shrink-0 border-t px-3 py-2.5 text-center",
          isCenter ? "border-primary-light/20" : "border-primary-light/8",
        )}
      >
        <span
          className={cn(
            "block truncate font-display text-sm font-semibold leading-tight",
            isCenter ? "text-foreground" : "text-foreground/40",
          )}
        >
          {entity.name}
        </span>

        {!compact && isCenter && (
          <span className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.3em] text-primary-light/40">
            {entity.entityType.label}
          </span>
        )}
      </div>
    </button>
  );
}

export default EntityCard;
