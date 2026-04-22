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
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

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

  const scrollToSection = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    dragRef.current = {
      dragging: true,
      startX: event.pageX - element.offsetLeft,
      startY: event.pageY - element.offsetTop,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
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
    const nextY = event.pageY - element.offsetTop;
    element.scrollLeft = dragRef.current.scrollLeft - (nextX - dragRef.current.startX);
    element.scrollTop = dragRef.current.scrollTop - (nextY - dragRef.current.startY);
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
      {orderedFeatures.map((feature, index) => {
        const isFirst = index === 0;
        const nextFeature = orderedFeatures[index + 1] ?? null;

        return (
          <section
            key={feature.id}
            ref={(el) => { sectionRefs.current[index] = el; }}
            className={`flex h-screen w-full flex-col items-center pl-24 pr-56 ${isFirst ? "pt-16 pb-0" : "py-16"}`}
            style={{ scrollSnapAlign: "start" }}
          >
            {isFirst && (
              <LoreHeader
                title={lore?.name ?? safeSlug}
                description={lore?.description}
              />
            )}

            {!isFirst && (
              <>
                <div className="mb-2 flex w-full max-w-5xl items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary-light/40" />
                  <h2 className="font-display text-2xl font-bold uppercase tracking-[0.35em] text-gradient-purple">
                    {feature.name}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary-light/40" />
                </div>
                {feature.description && (
                  <p className="mt-3 mb-6 max-w-xl text-center font-mono text-xs leading-relaxed text-muted-foreground/50">
                    {feature.description}
                  </p>
                )}
              </>
            )}

            <div className="flex-1 min-h-0 flex w-full flex-col items-center">
              <FeatureRenderer
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
            </div>

            {nextFeature && (
              <button
                onClick={() => scrollToSection(index + 1)}
                className="group mb-8 flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
                aria-label={`View ${nextFeature.name}`}
              >
                <span className="font-display text-xs uppercase tracking-[0.5em] text-primary-light/50 transition-colors duration-300 group-hover:text-primary-light/90">
                  {nextFeature.name}
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
            )}
          </section>
        );
      })}

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
