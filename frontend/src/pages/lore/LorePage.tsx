import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { ApiError } from "@/features/lore/api/lores";
import FeatureRenderer from "@/features/lore/components/FeatureRenderer";
import LoreHeader from "@/features/lore/components/LoreHeader";
import LoreSidebar from "@/features/lore/components/LoreSidebar";
import EntityModal from "@/features/lore/components/EntityModal";
import { useLorePage } from "@/features/lore/hooks/useLorePage";
import { buildTree } from "@/features/lore/model/buildTree";
import { groupSidebarEntities } from "@/features/lore/model/groupSidebarEntities";

const LorePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarMode, setSidebarMode] = useState<"all" | "grouped">("grouped");
  const scrollRef = useRef<HTMLDivElement>(null);
  const historySectionRef = useRef<HTMLElement>(null);
  const dragRef = useRef({ dragging: false, startX: 0, scrollLeft: 0 });

  const safeSlug = slug ?? "";
  const {
    loreQuery,
    entitiesQuery,
    relationshipsQuery,
    narrativesQuery,
    isLoading,
  } = useLorePage(safeSlug);

  const lore = loreQuery.data;
  const entities = entitiesQuery.data ?? [];
  const relationships = relationshipsQuery.data ?? [];
  const narratives = narrativesQuery.data ?? [];

  const forest = useMemo(() => buildTree(entities, relationships), [entities, relationships]);
  const groupedEntities = useMemo(
    () => groupSidebarEntities(entities, lore?.sidebar_groups ?? []),
    [entities, lore?.sidebar_groups],
  );
  const selectedEntity = entities.find((entity) => entity.id === selectedId) ?? null;
  const orderedFeatures = lore?.features.slice().sort((a, b) => a.display_order - b.display_order) ?? [];

  useEffect(() => {
    if (!scrollRef.current || forest.length === 0) {
      return;
    }

    const element = scrollRef.current;
    element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
  }, [forest.length]);

  const handleSelectEntity = useCallback((id: number) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  const revealHistory = useCallback(() => {
    historySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    dragRef.current = {
      dragging: true,
      startX: event.pageX - element.offsetLeft,
      scrollLeft: element.scrollLeft,
    };
    element.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((event: React.MouseEvent) => {
    const element = scrollRef.current;

    if (!element || !dragRef.current.dragging) {
      return;
    }

    event.preventDefault();
    const nextX = event.pageX - element.offsetLeft;
    element.scrollLeft = dragRef.current.scrollLeft - (nextX - dragRef.current.startX);
  }, []);

  const onMouseUp = useCallback(() => {
    dragRef.current.dragging = false;

    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
    }
  }, []);

  if (
    loreQuery.error instanceof ApiError &&
    loreQuery.error.status === 404
  ) {
    return <NotFound />;
  }

  if (!safeSlug) {
    return <NotFound />;
  }

  return (
    <main
      className="page-snap h-screen w-full overflow-y-scroll"
      style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
    >
      <section
        className="relative flex h-screen w-full flex-col items-center pl-24 pr-56 pt-16 pb-0"
        style={{ scrollSnapAlign: "start" }}
      >
        <LoreHeader title={lore?.name ?? safeSlug} />

        {orderedFeatures.map((feature) => (
          feature.name === "tree" ? (
            <FeatureRenderer
              key={feature.id}
              feature={feature}
              forest={forest}
              narratives={narratives}
              entities={entities}
              isTreeLoading={isLoading}
              selectedId={selectedId}
              onSelectEntity={handleSelectEntity}
              scrollRef={scrollRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
            />
          ) : null
        ))}

        <button
          onClick={revealHistory}
          className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 cursor-pointer focus:outline-none"
          aria-label="View history"
        >
          <span className="font-display text-xs uppercase tracking-[0.5em] text-primary-light/50 transition-colors duration-300 group-hover:text-primary-light/90">
            history
          </span>
          <div className="flex animate-bounce flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-light/50 transition-colors duration-300 drop-shadow-[0_0_8px_hsl(var(--primary-light)/0.4)] group-hover:text-primary-light group-hover:drop-shadow-[0_0_14px_hsl(var(--primary-light)/0.7)]"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="-mt-3 text-primary-light/20 transition-colors duration-300 group-hover:text-primary-light/50"
            >
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        </button>
      </section>

      <section
        ref={historySectionRef}
        className="flex h-screen w-full flex-col items-center pl-24 pr-56 py-24"
        style={{ scrollSnapAlign: "start" }}
      >
        {orderedFeatures.map((feature) => (
          feature.name === "narratives" ? (
            <FeatureRenderer
              key={feature.id}
              feature={feature}
              forest={forest}
              narratives={narratives}
              entities={entities}
              isTreeLoading={isLoading}
              selectedId={selectedId}
              onSelectEntity={handleSelectEntity}
              scrollRef={scrollRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
            />
          ) : null
        ))}
      </section>

      <LoreSidebar
        isLoading={isLoading}
        entities={entities}
        groupedEntities={groupedEntities}
        selectedId={selectedId}
        sidebarMode={sidebarMode}
        onToggleMode={() => setSidebarMode((current) => (current === "all" ? "grouped" : "all"))}
        onSelect={handleSelectEntity}
      />

      {selectedEntity && (
        <EntityModal
          entity={selectedEntity}
          entities={entities}
          relationships={relationships}
          onClose={() => setSelectedId(null)}
        />
      )}
    </main>
  );
};

export default LorePage;
