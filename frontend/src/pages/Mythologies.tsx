import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Entity {
  id: number;
  name: string;
  description: string;
  avatar_url: string | null;
  gender: string | null;
  origin: string | null;
  categories: Record<string, string[]>;
}

interface Relationship {
  entity_id: number;
  related_id: number;
  type: string;
}

interface TreeNode {
  entity: Entity;
  children: TreeNode[];
  parents: Entity[];
}

async function fetchEntities(): Promise<Entity[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/entities`);
  const data = await res.json();
  return data.entities;
}

async function fetchRelationships(): Promise<Relationship[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/relationships`);
  const data = await res.json();
  return data.relationships ?? [];
}

function buildForest(entities: Entity[], relationships: Relationship[]): TreeNode[] {
  const parentRels = relationships.filter((r) => r.type === "parent");
  const childIds = new Set(parentRels.map((r) => r.related_id));
  const inTree = new Set([
    ...parentRels.map((r) => r.entity_id),
    ...parentRels.map((r) => r.related_id),
  ]);
  const roots = entities.filter((e) => !childIds.has(e.id) && inTree.has(e.id));

  const placed = new Set<number>();

  const buildNode = (entity: Entity): TreeNode => {
    placed.add(entity.id);
    const children: TreeNode[] = [];
    for (const r of parentRels.filter((r) => r.entity_id === entity.id)) {
      const child = entities.find((e) => e.id === r.related_id);
      if (child && !placed.has(child.id)) {
        children.push(buildNode(child));
      }
    }
    return {
      entity,
      parents: parentRels
        .filter((r) => r.related_id === entity.id)
        .map((r) => entities.find((e) => e.id === r.entity_id))
        .filter((e): e is Entity => !!e),
      children,
    };
  };

  return roots.sort((a, b) => a.id - b.id).map((e) => buildNode(e));
}

// ── Tree node ─────────────────────────────────────────────
const TreeNodeEl = ({
  node,
  selectedId,
  onSelect,
  delay = 0,
}: {
  node: TreeNode;
  selectedId: number | null;
  onSelect: (id: number) => void;
  delay?: number;
}) => {
  const hasChildren = node.children.length > 0;
  const isOnly = node.children.length === 1;
  const isSelected = selectedId === node.entity.id;
  const lineDelay = delay + 120;

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onSelect(node.entity.id)}
        style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
        className={cn(
          "flex flex-col items-center px-3 py-1.5 rounded-lg font-mono border transition-all duration-200 whitespace-nowrap",
          "animate-in fade-in slide-in-from-top-3 duration-500",
          isSelected
            ? "border-primary-light/60 text-primary-light bg-primary/20 shadow-[0_0_12px_hsl(var(--primary-light)/0.2)]"
            : "border-primary-light/15 text-muted-foreground hover:text-primary-light hover:border-primary-light/30"
        )}
      >
        <span className="text-sm">{node.entity.name}</span>
        {node.parents.length > 0 && (
          <span className="text-[9px] text-primary-light/30 mt-0.5 tracking-wide">
            {node.parents.map((p) => p.name).join(" · ")}
          </span>
        )}
      </button>

      {hasChildren && (
        <>
          <div
            className="w-px h-6 bg-primary-light/20 animate-in fade-in duration-500"
            style={{ animationDelay: `${lineDelay}ms`, animationFillMode: "both" }}
          />
          <div className="flex gap-6">
            {node.children.map((child, i) => {
              const isFirst = i === 0;
              const isLast = i === node.children.length - 1;
              const childDelay = lineDelay + 80 + i * 60;
              return (
                <div key={child.entity.id} className="flex flex-col items-center">
                  <div className="relative w-full" style={{ height: "24px" }}>
                    {!isOnly && (
                      <div
                        className="absolute top-0 h-px bg-primary-light/20 animate-in fade-in duration-400"
                        style={{
                          left: isFirst ? "50%" : "0",
                          right: isLast ? "50%" : "0",
                          animationDelay: `${childDelay}ms`,
                          animationFillMode: "both",
                        }}
                      />
                    )}
                    <div
                      className="absolute inset-x-0 top-0 bottom-0 flex justify-center animate-in fade-in duration-400"
                      style={{ animationDelay: `${childDelay}ms`, animationFillMode: "both" }}
                    >
                      <div className="w-px bg-primary-light/20" />
                    </div>
                  </div>
                  <TreeNodeEl
                    node={child}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    delay={childDelay + 60}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// ── Entity card modal ─────────────────────────────────────
const relationLabel: Record<string, string> = {
  spouse: "Spouse",
  sibling: "Sibling",
  lover: "Lover",
  rival: "Rival",
  ally: "Ally",
};

const EntityModal = ({
  entity,
  relationships,
  entities,
  onClose,
}: {
  entity: Entity;
  relationships: Relationship[];
  entities: Entity[];
  onClose: () => void;
}) => {
  const parents = relationships
    .filter((r) => r.type === "parent" && r.related_id === entity.id)
    .map((r) => entities.find((e) => e.id === r.entity_id))
    .filter((e): e is Entity => !!e);

  const otherRels = relationships
    .filter((r) => r.type !== "parent" && r.entity_id === entity.id)
    .map((r) => ({ type: r.type, entity: entities.find((e) => e.id === r.related_id) }))
    .filter((r): r is { type: string; entity: Entity } => !!r.entity);
  const initials = entity.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const tagCategories = Object.entries(entity.categories)
    .filter(([axis]) => axis === "domain" || axis === "role")
    .flatMap(([, cats]) => cats);

  const labeledCategories = Object.entries(entity.categories)
    .filter(([axis]) => axis !== "domain" && axis !== "role");

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* card */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4 animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="mx-auto mb-3 flex items-center justify-center w-10 h-10 text-3xl text-muted-foreground/60 hover:text-primary-light transition leading-none rounded-full bg-secondary/80 border border-primary-light/15 hover:border-primary-light/40"
        >
          ×
        </button>
        <div
          className="relative flex flex-col rounded-[1.25rem] border border-primary-light/10 p-5 card-glow"
          style={{ background: "var(--gradient-card)" }}
        >
          <div className="mb-4 flex items-center min-h-[24px]">
            {entity.origin && (
              <span className="font-display text-xs uppercase tracking-[0.25em] text-primary-light/80">
                {entity.origin}
              </span>
            )}
            {(() => {
              const group = isOlympian(entity) ? "Olympian" : isTitan(entity) ? "Titan" : isPrimordial(entity) ? "Primordial" : null;
              return group ? (
                <span className="ml-auto rounded-full border border-primary-light/30 bg-primary/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-light">
                  {group}
                </span>
              ) : null;
            })()}
          </div>

          <div className="relative mx-auto mb-5 aspect-square w-full overflow-hidden rounded-xl border border-primary-light/12 bg-secondary/60">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-glow/20 via-transparent to-accent/20" />
            {entity.avatar_url ? (
              <img
                src={entity.avatar_url}
                alt={entity.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-6xl text-gradient-purple">{initials}</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary-glow)/0.12),transparent_60%)]" />
          </div>

          <div className="mb-4 text-center">
            <h3 className="font-display text-2xl font-semibold text-foreground">{entity.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entity.description}</p>
          </div>

          {parents.length > 0 && (
            <div className="mb-3 font-mono text-xs text-center text-primary-light/40">
              born of {parents.map((p) => p.name).join(" · ")}
            </div>
          )}

          {otherRels.length > 0 && (
            <div className="mb-3 flex flex-wrap justify-center gap-1.5">
              {otherRels.map((r) => (
                <span key={`${r.type}-${r.entity.id}`} className="rounded-full border border-primary-light/15 px-2.5 py-0.5 text-[10px] font-mono text-primary-light/50">
                  {relationLabel[r.type] ?? r.type}: {r.entity.name}
                </span>
              ))}
            </div>
          )}

          {(tagCategories.length > 0 || labeledCategories.length > 0) && (
            <>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-light/30 to-transparent" />
                <span className="font-display text-[10px] uppercase tracking-[0.3em] text-primary-light/60">Traits</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-light/30 to-transparent" />
              </div>

              {tagCategories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                  {tagCategories.map((cat) => (
                    <span key={cat} className="rounded-md border border-primary-light/18 bg-primary/14 px-2.5 py-1 text-xs font-medium text-primary-light">
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {(labeledCategories.length > 0 || entity.gender) && (
                <div className="flex flex-col gap-1 font-mono text-xs">
                  {entity.gender && (
                    <div className="flex gap-2">
                      <span className="text-primary-light/40 shrink-0">gender:</span>
                      <span className="text-muted-foreground">{entity.gender}</span>
                    </div>
                  )}
                  {labeledCategories.map(([axis, cats]) => (
                    <div key={axis} className="flex gap-2">
                      <span className="text-primary-light/40 shrink-0">{axis}:</span>
                      <span className="text-muted-foreground">{cats.join(", ")}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ── Page ──────────────────────────────────────────────────
// ── Sidebar grouping ─────────────────────────────────────
const ERA_AXIS = "lineage";
const HABITAT_AXIS = "habitat";

const isOlympian = (e: Entity) =>
  e.categories[HABITAT_AXIS]?.includes("olympus") ?? false;

const isTitan = (e: Entity) =>
  !isOlympian(e) && (e.categories[ERA_AXIS]?.includes("titan") ?? false);

const isPrimordial = (e: Entity) =>
  !isOlympian(e) && !isTitan(e) && (e.categories[ERA_AXIS]?.includes("primordial") ?? false);

const GROUPS = [
  { key: "primordial", label: "Primordiais", test: isPrimordial },
  { key: "titan",     label: "Titans",            test: isTitan },
  { key: "olympian",  label: "Olympians",          test: isOlympian },
] as const;

// ── Entity list shared component ─────────────────────────
const EntityList = ({
  entities,
  selectedId,
  onSelect,
}: {
  entities: Entity[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) => (
  <>
    {entities.map((entity, i, arr) => (
      <button
        key={entity.id}
        onClick={() => onSelect(entity.id)}
        className={cn(
          "flex items-center gap-2 text-left font-mono text-sm transition-colors py-0.5",
          selectedId === entity.id
            ? "text-primary-light"
            : "text-muted-foreground hover:text-primary-light"
        )}
      >
        <span className="text-primary-light/20 shrink-0">
          {i === arr.length - 1 ? "╰·" : "├·"}
        </span>
        <span className="truncate">{entity.name}</span>
      </button>
    ))}
  </>
);

// ── Page ──────────────────────────────────────────────────
const Mythologies = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarMode, setSidebarMode] = useState<"all" | "grouped">("grouped");
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ dragging: false, startX: 0, scrollLeft: 0 });

  const { data: entities, isLoading: loadingE } = useQuery({ queryKey: ["entities"], queryFn: fetchEntities });
  const { data: relationships, isLoading: loadingR } = useQuery({ queryKey: ["relationships"], queryFn: fetchRelationships });

  const isLoading = loadingE || loadingR;
  const forest = entities && relationships ? buildForest(entities, relationships) : [];
  const selectedEntity = entities?.find((e) => e.id === selectedId) ?? null;

  useEffect(() => {
    if (scrollRef.current && forest.length > 0) {
      const el = scrollRef.current;
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  }, [forest.length]);

  const handleSelect = useCallback((id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragRef.current = { dragging: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el || !dragRef.current.dragging) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = dragRef.current.scrollLeft - (x - dragRef.current.startX);
  }, []);

  const onMouseUp = useCallback(() => {
    dragRef.current.dragging = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  return (
    <main className="w-full">
      <section className="flex min-h-screen w-full flex-col items-center pl-24 pr-56 py-16">

        <header className="mx-auto mb-16 max-w-4xl text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-gradient-purple md:text-7xl">
            lorepsum
          </h1>
          <p className="mt-4 font-display text-xs uppercase tracking-[0.5em] text-primary-light/70">
            Playing with lore, building something more.
          </p>
        </header>

        <div className="mb-2 flex w-full max-w-5xl items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary-light/40" />
          <h2 className="font-display text-2xl font-bold uppercase tracking-[0.35em] text-gradient-purple">
            Mythologies
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary-light/40" />
        </div>

        <p className="mb-10 font-mono text-xs uppercase tracking-[0.3em] text-primary-light/40">
         Simple Genealogical Tree
        </p>

        {/* Tree */}
        {isLoading ? (
          <Skeleton className="h-12 w-32 rounded-lg" />
        ) : (
          <div
            ref={scrollRef}
            className="tree-scroll w-full max-w-3xl mx-auto overflow-x-auto rounded-xl pb-2 select-none"
            style={{ cursor: "grab" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <div className="flex min-w-max justify-center gap-16 px-16 py-8">
              {forest.map((root, i) => (
                <TreeNodeEl
                  key={root.entity.id}
                  node={root}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  delay={i * 120}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Right sidebar — entity list */}
      <aside className="fixed right-6 top-0 z-40 flex h-screen w-48 flex-col pt-16 pb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-primary-light/30 font-mono text-sm">╰·</span>
          <span className="font-display text-xs uppercase tracking-[0.25em] text-primary-light/60">
            Entities
          </span>
        </div>

        <button
          onClick={() => setSidebarMode((m) => (m === "all" ? "grouped" : "all"))}
          className={cn(
            "ml-3 mb-3 self-start rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] border transition-colors",
            sidebarMode === "all"
              ? "border-primary-light/40 bg-primary/20 text-primary-light"
              : "border-primary-light/15 text-primary-light/30 hover:text-primary-light/60 hover:border-primary-light/30"
          )}
        >
          All
        </button>

        <div className="entity-scroll overflow-y-auto flex-1 ml-3 flex flex-col gap-1 pr-3">
          {isLoading ? (
            [...Array(6)].map((_, i) => <Skeleton key={i} className="h-5 w-32 my-1" />)
          ) : sidebarMode === "all" ? (
            <EntityList
              entities={entities?.slice().sort((a, b) => a.id - b.id) ?? []}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          ) : (
            GROUPS.map((group) => {
              const grouped = entities?.slice().sort((a, b) => a.id - b.id).filter(group.test) ?? [];
              if (grouped.length === 0) return null;
              return (
                <div key={group.key} className="mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-light/30 block mb-1">
                    {group.label}
                  </span>
                  <EntityList
                    entities={grouped}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                  />
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Modal */}
      {selectedEntity && (
        <EntityModal
          entity={selectedEntity}
          relationships={relationships ?? []}
          entities={entities ?? []}
          onClose={() => setSelectedId(null)}
        />
      )}
    </main>
  );
};

export default Mythologies;
