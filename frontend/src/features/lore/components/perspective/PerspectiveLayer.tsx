import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import PerspectiveEntityNode from "./PerspectiveEntityNode";
import type { PerspectiveGroup } from "../../model/perspective.utils";

interface PerspectiveLayerProps {
  group: PerspectiveGroup;
  selectedId: number | null;
  onSelectEntity: (entityId: number) => void;
  depth: number;
  tilt: number;
  delay: number;
  entityDepth: number;
}

function PerspectiveLayer({
  group,
  selectedId,
  onSelectEntity,
  depth,
  tilt,
  delay,
  entityDepth,
}: PerspectiveLayerProps) {
  const ringStyle: CSSProperties = {
    "--ring-depth": `${depth}px`,
    "--ring-tilt": `${tilt}deg`,
    "--ring-delay": `${delay}s`,
  } as CSSProperties;

  return (
    <div className="perspective-ring flex w-full flex-col items-center gap-3" style={ringStyle}>
      <div className="flex items-center gap-3">
        <span className="h-px w-10 rounded-full bg-gradient-to-r from-primary-light/40 to-transparent" />
        <span className="font-display text-[10px] uppercase tracking-[0.45em] text-muted-foreground/70">
          {group.label}
          <span className="ml-2 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/35">
            {group.entities.length}
          </span>
        </span>
        <span className="h-px w-10 rounded-full bg-gradient-to-l from-primary-light/40 to-transparent" />
      </div>

      <div
        className={cn(
          "flex flex-wrap items-start justify-center gap-x-6 gap-y-4",
          "px-2",
        )}
      >
        {group.entities.map((relatedEntity, index) => (
          <PerspectiveEntityNode
            key={`${group.key}-${relatedEntity.entity.id}`}
            entity={relatedEntity.entity}
            isSelected={selectedId === relatedEntity.entity.id}
            onSelect={onSelectEntity}
            depth={entityDepth + (index % 3) * 6}
            delay={(index % 5) * 0.3 + delay * 0.2}
          />
        ))}
      </div>
    </div>
  );
}

export default PerspectiveLayer;
