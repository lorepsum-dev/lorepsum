import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { ApiError } from "@/lib/api";
import FeatureRenderer from "../components/FeatureRenderer";
import LoreFeatureSection from "../components/LoreFeatureSection";
import LoreSidebar from "../components/LoreSidebar";
import EntityModal from "../components/EntityModal";
import { useLorePageData } from "../hooks/useLorePageData";
import { useEntitySelection } from "../hooks/useEntitySelection";
import { useDraggableScroll } from "../hooks/useDraggableScroll";
import { useSectionNavigation } from "../hooks/useSectionNavigation";
import { buildTree } from "../model/buildTree";
import { groupSidebarEntities } from "../model/groupSidebarEntities";
import type { Entity, LoreSidebarGroup, Narrative, Relationship } from "../model/types";

const EMPTY_ENTITIES: Entity[] = [];
const EMPTY_RELATIONSHIPS: Relationship[] = [];
const EMPTY_NARRATIVES: Narrative[] = [];
const EMPTY_SIDEBAR_GROUPS: LoreSidebarGroup[] = [];

function LoreDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const safeSlug = slug ?? "";
  const [sidebarMode, setSidebarMode] = useState<"all" | "grouped">("grouped");
  const lorePageQuery = useLorePageData(safeSlug);
  const lorePage = lorePageQuery.data;
  const entities = lorePage?.entities ?? EMPTY_ENTITIES;
  const relationships = lorePage?.relationships ?? EMPTY_RELATIONSHIPS;
  const narratives = lorePage?.narratives ?? EMPTY_NARRATIVES;
  const lore = lorePage?.lore;
  const sidebarGroups = lore?.sidebarGroups ?? EMPTY_SIDEBAR_GROUPS;

  const { selectedId, selectedEntity, toggleEntitySelection, clearSelection } = useEntitySelection(entities);
  const { scrollRef, dragHandlers } = useDraggableScroll();
  const { setSectionRef, scrollToSection } = useSectionNavigation();

  const forest = useMemo(() => buildTree(entities, relationships), [entities, relationships]);
  const groupedEntities = useMemo(
    () => groupSidebarEntities(entities, sidebarGroups),
    [entities, sidebarGroups],
  );

  useEffect(() => {
    if (!scrollRef.current || forest.length === 0) {
      return;
    }

    const element = scrollRef.current;
    element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
  }, [forest.length, scrollRef]);

  if (!safeSlug) {
    return <NotFound />;
  }

  if (lorePageQuery.error instanceof ApiError && lorePageQuery.error.status === 404) {
    return <NotFound />;
  }

  if (!lore && lorePageQuery.isSuccess) {
    return <NotFound />;
  }

  return (
    <main
      className="page-snap h-screen w-full overflow-y-scroll"
      style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
    >
      {(lore?.features ?? []).map((feature, index, collection) => (
        <LoreFeatureSection
          key={feature.id}
          feature={feature}
          isFirst={index === 0}
          nextFeature={collection[index + 1] ?? null}
          loreTitle={lore?.name ?? safeSlug}
          loreDescription={lore?.description}
          onNext={() => scrollToSection(index + 1)}
          sectionRef={setSectionRef(index)}
        >
          <FeatureRenderer
            feature={feature}
            forest={forest}
            narratives={narratives}
            entities={entities}
            isLoading={lorePageQuery.isLoading}
            selectedId={selectedId}
            onSelectEntity={toggleEntitySelection}
            scrollRef={scrollRef}
            onMouseDown={dragHandlers.onMouseDown}
            onMouseMove={dragHandlers.onMouseMove}
            onMouseUp={dragHandlers.onMouseUp}
          />
        </LoreFeatureSection>
      ))}

      <LoreSidebar
        isLoading={lorePageQuery.isLoading}
        entities={entities}
        groupedEntities={groupedEntities}
        selectedId={selectedId}
        sidebarMode={sidebarMode}
        onToggleMode={() => setSidebarMode((current) => (current === "all" ? "grouped" : "all"))}
        onSelect={toggleEntitySelection}
      />

      {selectedEntity && (
        <EntityModal
          entity={selectedEntity}
          entities={entities}
          relationships={relationships}
          presentation={lore.presentation}
          onClose={clearSelection}
        />
      )}
    </main>
  );
}

export default LoreDetailPage;
