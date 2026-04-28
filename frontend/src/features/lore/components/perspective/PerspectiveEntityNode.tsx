import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  getCenterEntityVisual,
  getEntityTypeVisual,
} from "../../model/entityTypeVisuals";
import type { Entity } from "../../model/types";

interface PerspectiveEntityNodeProps {
  entity: Entity;
  variant?: "center" | "satellite";
  caption?: string | null;
  isSelected?: boolean;
  onSelect?: (entityId: number) => void;
  depth?: number;
  delay?: number;
}

const SHAPE_CLASSES: Record<"circle" | "rounded" | "diamond", string> = {
  circle: "rounded-full",
  rounded: "rounded-2xl",
  diamond: "rounded-md rotate-45",
};

const SHAPE_ICON_COMPENSATION: Record<"circle" | "rounded" | "diamond", string> = {
  circle: "",
  rounded: "",
  diamond: "-rotate-45",
};

function PerspectiveEntityNode({
  entity,
  variant = "satellite",
  caption,
  isSelected = false,
  onSelect,
  depth = 0,
  delay = 0,
}: PerspectiveEntityNodeProps) {
  const isCenter = variant === "center";
  const visual = isCenter ? getCenterEntityVisual(entity) : getEntityTypeVisual(entity);
  const Icon = visual.icon;
  const shapeClass = SHAPE_CLASSES[visual.shape];
  const iconCompensation = SHAPE_ICON_COMPENSATION[visual.shape];

  const dimension = isCenter ? "h-24 w-24 sm:h-28 sm:w-28" : "h-14 w-14 sm:h-16 sm:w-16";
  const iconSize = isCenter ? 36 : 22;

  const style: CSSProperties = {
    "--node-depth": `${depth}px`,
    "--node-delay": `${delay}s`,
  } as CSSProperties;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(entity.id)}
      data-selected={isSelected || undefined}
      className={cn(
        "perspective-node group flex flex-col items-center gap-1.5 focus:outline-none",
        onSelect ? "cursor-pointer" : "cursor-default",
      )}
      style={style}
      aria-label={entity.name}
    >
      <span
        className={cn(
          "flex items-center justify-center border bg-background/70 ring-2 backdrop-blur",
          shapeClass,
          dimension,
          visual.ring,
          visual.glow,
          isCenter && "perspective-center",
          isSelected && !isCenter && "ring-4 ring-primary-light",
        )}
        style={{ borderColor: visual.accent }}
      >
        <Icon
          className={cn(iconCompensation)}
          width={iconSize}
          height={iconSize}
          color={visual.accent}
          strokeWidth={1.6}
        />
      </span>

      <span
        className={cn(
          "max-w-[8.5rem] truncate text-center font-display text-[11px] uppercase tracking-[0.2em] transition-colors",
          isCenter
            ? "text-primary-light"
            : "text-muted-foreground group-hover:text-primary-light",
        )}
      >
        {entity.name}
      </span>

      {caption && (
        <span className="max-w-[9rem] truncate font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/55">
          {caption}
        </span>
      )}
    </button>
  );
}

export default PerspectiveEntityNode;
