import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePerspectiveData } from "../../hooks/usePerspectiveData";
import type { PerspectiveGroup } from "../../model/perspective.utils";
import type { Entity, Relationship } from "../../model/types";
import PerspectiveEntityNode from "./PerspectiveEntityNode";
import PerspectiveLayer from "./PerspectiveLayer";

interface PerspectiveStageProps {
  entities: Entity[];
  relationships: Relationship[];
  isLoading: boolean;
  selectedId: number | null;
  onSelectEntity: (entityId: number) => void;
}

interface SplitGroups {
  upper: PerspectiveGroup[];
  lower: PerspectiveGroup[];
}

function splitGroups(groups: PerspectiveGroup[]): SplitGroups {
  const upper: PerspectiveGroup[] = [];
  const lower: PerspectiveGroup[] = [];

  groups.forEach((group, index) => {
    if (index % 2 === 0) {
      upper.push(group);
    } else {
      lower.push(group);
    }
  });

  return { upper: upper.reverse(), lower };
}

function PerspectiveStage({
  entities,
  relationships,
  isLoading,
  selectedId,
  onSelectEntity,
}: PerspectiveStageProps) {
  const [centerEntityId, setCenterEntityId] = useState<number | null>(null);
  const perspective = usePerspectiveData({
    entities,
    relationships,
    centerEntityId,
  });

  const sortedEntities = useMemo(
    () => entities.slice().sort((left, right) => left.name.localeCompare(right.name)),
    [entities],
  );

  const splits = useMemo<SplitGroups>(
    () => (perspective ? splitGroups(perspective.groups) : { upper: [], lower: [] }),
    [perspective],
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full max-w-5xl flex-col items-center justify-center gap-8">
        <Skeleton className="h-10 w-72 rounded-lg" />
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="flex flex-wrap justify-center gap-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
      </div>
    );
  }

  if (!perspective) {
    return (
      <div className="flex h-full w-full max-w-3xl items-center justify-center">
        <p className="font-mono text-xs text-muted-foreground/50">
          No entities to project a perspective from.
        </p>
      </div>
    );
  }

  const { center, groups } = perspective;
  const totalRelations = groups.reduce((total, group) => total + group.entities.length, 0);

  return (
    <div className="flex h-full w-full max-w-6xl flex-col gap-3 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-light/10 bg-secondary/30 px-3 py-2">
        <div className="flex flex-col gap-0.5">
          <div className="font-mono text-xs text-muted-foreground">
            Pick an entity to inhabit. The world rearranges around it.
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-light/30">
            {groups.length} groups / {totalRelations} relations
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="perspective-center-select"
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60"
          >
            Perspective
          </label>
          <div className="relative">
            <select
              id="perspective-center-select"
              value={center.id}
              onChange={(event) => setCenterEntityId(Number(event.target.value))}
              className="appearance-none rounded-lg border border-primary-light/15 bg-background/70 py-1.5 pl-3 pr-8 font-mono text-xs text-muted-foreground outline-none transition focus:border-primary-light/50"
            >
              {sortedEntities.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "tree-scroll perspective-stage relative min-h-0 flex-1 overflow-y-auto rounded-2xl border border-primary-light/10",
          "bg-[radial-gradient(ellipse_at_center,hsl(var(--primary-light)/0.16),transparent_65%)]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-x-10 bottom-6 h-10 rounded-[50%] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary-light)/0.18),transparent_70%)] blur-2xl"
          aria-hidden="true"
        />

        <div className="perspective-stage-inner flex min-h-full flex-col items-stretch gap-8 px-6 py-10 sm:px-12">
          {splits.upper.map((group, index) => {
            const distance = splits.upper.length - index;
            return (
              <PerspectiveLayer
                key={group.key}
                group={group}
                selectedId={selectedId}
                onSelectEntity={onSelectEntity}
                depth={20 + distance * 14}
                tilt={-0.4 * distance}
                delay={index * 0.6}
                entityDepth={distance * 4}
              />
            );
          })}

          <div className="flex w-full items-center justify-center py-2">
            <PerspectiveEntityNode
              entity={center}
              variant="center"
              isSelected={selectedId === center.id}
              onSelect={onSelectEntity}
            />
          </div>

          {splits.lower.map((group, index) => {
            const distance = index + 1;
            return (
              <PerspectiveLayer
                key={group.key}
                group={group}
                selectedId={selectedId}
                onSelectEntity={onSelectEntity}
                depth={-20 - distance * 14}
                tilt={0.4 * distance}
                delay={index * 0.6 + 0.3}
                entityDepth={-distance * 4}
              />
            );
          })}

          {groups.length === 0 && (
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground/40">
              No relationships radiate from this entity yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerspectiveStage;
