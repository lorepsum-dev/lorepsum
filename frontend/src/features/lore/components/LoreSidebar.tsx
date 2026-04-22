import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Entity, SidebarEntityGroup } from "../model/types";

interface LoreSidebarProps {
  isLoading: boolean;
  entities: Entity[];
  groupedEntities: SidebarEntityGroup[];
  selectedId: number | null;
  sidebarMode: "all" | "grouped";
  onToggleMode: () => void;
  onSelect: (id: number) => void;
}

interface EntityListProps {
  entities: Entity[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const EntityList = ({ entities, selectedId, onSelect }: EntityListProps) => {
  return (
    <>
      {entities.map((entity, index, collection) => (
        <button
          key={entity.id}
          onClick={() => onSelect(entity.id)}
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
};

const LoreSidebar = ({
  isLoading,
  entities,
  groupedEntities,
  selectedId,
  sidebarMode,
  onToggleMode,
  onSelect,
}: LoreSidebarProps) => {
  return (
    <aside className="fixed right-6 top-0 z-40 flex h-screen w-48 flex-col pt-16 pb-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-sm text-primary-light/30">╰·</span>
        <span className="font-display text-xs uppercase tracking-[0.25em] text-primary-light/60">
          Entities
        </span>
      </div>

      <button
        onClick={onToggleMode}
        className={cn(
          "ml-3 mb-3 self-start rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors",
          sidebarMode === "all"
            ? "border-primary-light/40 bg-primary/20 text-primary-light"
            : "border-primary-light/15 text-primary-light/30 hover:border-primary-light/30 hover:text-primary-light/60",
        )}
      >
        All
      </button>

      <div className="entity-scroll ml-3 flex flex-1 flex-col gap-1 overflow-y-auto pr-3">
        {isLoading ? (
          [...Array(6)].map((_, index) => <Skeleton key={index} className="my-1 h-5 w-32" />)
        ) : sidebarMode === "all" ? (
          <EntityList
            entities={entities.slice().sort((a, b) => a.id - b.id)}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ) : (
          groupedEntities.map((group) => (
            <div key={group.id} className="mb-3">
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.25em] text-primary-light/30">
                {group.label}
              </span>
              <EntityList entities={group.entities} selectedId={selectedId} onSelect={onSelect} />
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default LoreSidebar;
