import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { ApiError } from "@/lib/api";
import CommandPalette from "../components/CommandPalette";
import EntityModal from "../components/EntityModal";
import FeatureRenderer from "../components/FeatureRenderer";
import LensDock from "../components/LensDock";
import LoreFeatureSection from "../components/LoreFeatureSection";
import LoreSidebar from "../components/LoreSidebar";
import { useDraggableScroll } from "../hooks/useDraggableScroll";
import { useEntitySelection } from "../hooks/useEntitySelection";
import { useLorePageData } from "../hooks/useLorePageData";
import { useSectionNavigation } from "../hooks/useSectionNavigation";
import { buildTree } from "../model/buildTree";
import { groupEntitiesByType } from "../model/groupEntitiesByType";
import type { Entity, Narrative, Relationship } from "../model/types";

const EMPTY_ENTITIES: Entity[] = [];
const EMPTY_RELATIONSHIPS: Relationship[] = [];
const EMPTY_NARRATIVES: Narrative[] = [];

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

function LoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const safeLoreId = id ?? "";
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const lorePageQuery = useLorePageData(safeLoreId);
  const lorePage = lorePageQuery.data;
  const graph = lorePage?.graph;
  const entities = graph?.nodes ?? EMPTY_ENTITIES;
  const relationships = graph?.edges ?? EMPTY_RELATIONSHIPS;
  const narratives = lorePage?.narratives ?? EMPTY_NARRATIVES;
  const lore = lorePage?.lore;
  const features = lore?.features ?? [];
  const presentation = lore?.entityModalPresentation;

  const { selectedId, selectedEntity, toggleEntitySelection, clearSelection } = useEntitySelection(entities);
  const { scrollRef, dragHandlers } = useDraggableScroll();
  const { setSectionRef, scrollToSection, activeIndex } = useSectionNavigation(features.length);

  const forest = useMemo(() => buildTree(entities, relationships), [entities, relationships]);
  const groupedEntities = useMemo(() => groupEntitiesByType(entities), [entities]);

  useEffect(() => {
    if (!scrollRef.current || forest.length === 0) {
      return;
    }

    const element = scrollRef.current;
    element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
  }, [forest.length, scrollRef]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsPaletteOpen((open) => !open);
        return;
      }

      if (isPaletteOpen || isTypingTarget(event.target)) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const digit = Number(event.key);
      if (Number.isInteger(digit) && digit >= 1 && digit <= features.length) {
        event.preventDefault();
        scrollToSection(digit - 1);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [features.length, isPaletteOpen, scrollToSection]);

  if (!safeLoreId) {
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
      {features.map((feature, index, collection) => (
        <LoreFeatureSection
          key={feature.id}
          feature={feature}
          isFirst={index === 0}
          nextFeature={collection[index + 1] ?? null}
          loreTitle={lore?.name ?? safeLoreId}
          loreDescription={lore?.description}
          onNext={() => scrollToSection(index + 1)}
          sectionRef={setSectionRef(index)}
        >
          <FeatureRenderer
            feature={feature}
            forest={forest}
            narratives={narratives}
            entities={entities}
            relationships={relationships}
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

      <LensDock features={features} activeIndex={activeIndex} onSelect={scrollToSection} />

      <LoreSidebar
        isLoading={lorePageQuery.isLoading}
        entities={entities}
        groupedEntities={groupedEntities}
        selectedId={selectedId}
        onSelect={toggleEntitySelection}
      />

      <CommandPalette
        open={isPaletteOpen}
        onOpenChange={setIsPaletteOpen}
        entities={entities}
        presentation={presentation}
        onSelectEntity={toggleEntitySelection}
      />

      {selectedEntity && presentation && (
        <EntityModal
          entity={selectedEntity}
          entities={entities}
          relationships={relationships}
          entityModalPresentation={presentation}
          onClose={clearSelection}
        />
      )}
    </main>
  );
}

export default LoreDetailPage;
