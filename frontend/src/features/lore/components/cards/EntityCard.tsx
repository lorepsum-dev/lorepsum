import { cn } from "@/lib/utils";
import type { Entity } from "../../model/types";

interface EntityCardProps {
  entity: Entity;
  position: "left" | "center" | "right";
  onSelect: () => void;
  compact: boolean;
}

function EntityCard({ entity, position, onSelect, compact }: EntityCardProps) {
  const isCenter = position === "center";
  const initials = entity.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex shrink-0 flex-col items-center rounded-xl border transition-all duration-300 focus:outline-none",
        compact ? "w-40 gap-2 px-4 py-4" : "w-52 gap-3 px-6 py-7",
        isCenter
          ? "scale-105 border-primary-light/40 bg-primary/10 opacity-100 shadow-[0_0_20px_hsl(var(--primary-light)/0.12)]"
          : "scale-95 border-primary-light/10 bg-transparent opacity-40 hover:opacity-55",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full border font-display font-bold",
          compact ? "h-12 w-12 text-base" : "h-16 w-16 text-lg",
          isCenter
            ? "border-primary-light/50 text-primary-light"
            : "border-primary-light/20 text-primary-light/40",
        )}
      >
        {entity.avatarUrl ? (
          <img
            src={entity.avatarUrl}
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

      {!compact && isCenter && entity.origin && (
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary-light/40">
          {entity.origin}
        </span>
      )}

      {!compact && isCenter && entity.description && (
        <p className="line-clamp-3 text-center font-mono text-[11px] leading-relaxed text-muted-foreground/55">
          {entity.description}
        </p>
      )}
    </button>
  );
}

export default EntityCard;
