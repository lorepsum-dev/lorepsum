import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Entity, SidebarEntityGroup } from "../model/types";

interface LoreSidebarProps {
  isLoading: boolean;
  entities: Entity[];
  groupedEntities: SidebarEntityGroup[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

interface EntityListProps {
  entities: Entity[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onClose?: () => void;
}

function EntityList({ entities, selectedId, onSelect, onClose }: EntityListProps) {
  return (
    <>
      {entities.map((entity, index, collection) => (
        <button
          key={entity.id}
          onClick={() => { onSelect(entity.id); onClose?.(); }}
          className={cn(
            "flex items-center gap-2 py-0.5 text-left font-mono text-sm transition-colors",
            selectedId === entity.id
              ? "text-primary-light"
              : "text-muted-foreground hover:text-primary-light",
          )}
        >
          <span className="shrink-0 text-primary-light/20">
            {index === collection.length - 1 ? "╰·" : "├·"}
          </span>
          <span className="truncate">{entity.name}</span>
        </button>
      ))}
    </>
  );
}

function LoreSidebar({
  isLoading,
  entities,
  groupedEntities,
  selectedId,
  onSelect,
}: LoreSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close entities" : "Open entities"}
        className={cn(
          "fixed right-0 top-1/2 z-[55] flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-l-lg border-y border-l px-1.5 py-3 transition-all duration-300 focus:outline-none sm:hidden",
          isOpen
            ? "border-primary-light/30 bg-primary/10 text-primary-light/80"
            : "border-primary-light/10 bg-background/60 text-primary-light/40 hover:border-primary-light/25 hover:text-primary-light/60",
        )}
      >
        <span className="font-mono text-[10px]">╰·</span>
        {!isLoading && entities.length > 0 && (
          <span className="font-mono text-[9px] tabular-nums text-primary-light/50">
            {entities.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[35] bg-background/40 backdrop-blur-sm sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed right-6 top-0 z-40 flex h-screen w-48 flex-col pb-8 pt-16 transition-all duration-300",
          "sm:translate-x-0 sm:opacity-100",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        )}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-sm text-primary-light/30">╰·</span>
          <span className="font-display text-xs uppercase tracking-[0.25em] text-primary-light/60">
            Entities
          </span>
        </div>

        <div className="entity-scroll ml-3 flex flex-1 flex-col gap-1 overflow-y-auto pr-3">
          {isLoading ? (
            [...Array(6)].map((_, index) => <Skeleton key={index} className="my-1 h-5 w-32" />)
          ) : (
            groupedEntities.map((group) => {
              const isExpanded = openGroups.has(group.id);

              return (
                <div key={group.id} className="mb-1">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={isExpanded}
                    className="group flex w-full items-center gap-1.5 py-1 text-left transition-colors focus:outline-none"
                  >
                    <ChevronRight
                      className={cn(
                        "h-3 w-3 shrink-0 text-primary-light/30 transition-transform duration-200 group-hover:text-primary-light/60",
                        isExpanded && "rotate-90 text-primary-light/60",
                      )}
                      strokeWidth={2}
                    />
                    <span
                      className={cn(
                        "font-display text-[11px] uppercase tracking-[0.25em] transition-colors",
                        isExpanded
                          ? "text-primary-light/80"
                          : "text-primary-light/40 group-hover:text-primary-light/70",
                      )}
                    >
                      {group.label}
                    </span>
                    <span className="ml-auto font-mono text-[10px] tabular-nums text-primary-light/30">
                      {group.entities.length}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-1 pl-4">
                      <EntityList
                        entities={group.entities}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        onClose={() => setIsOpen(false)}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}

export default LoreSidebar;
