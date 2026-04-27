import type { MouseEvent, ReactNode, RefObject } from "react";
import LoreGraphSection from "./LoreGraphSection";
import LoreCardsSection from "./LoreCardsSection";
import LoreNarrativesSection from "./LoreNarrativesSection";
import LoreTreeSection from "./LoreTreeSection";
import type { Entity, LoreFeature, Narrative, Relationship, TreeNode } from "../model/types";

interface FeatureRendererProps {
  feature: LoreFeature;
  forest: TreeNode[];
  narratives: Narrative[];
  entities: Entity[];
  relationships: Relationship[];
  isLoading: boolean;
  selectedId: number | null;
  onSelectEntity: (id: number) => void;
  scrollRef: RefObject<HTMLDivElement>;
  onMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
}

const featureComponents = {
  "entity-cards": ({ entities, isLoading, onSelectEntity }: FeatureRendererProps) => (
    <LoreCardsSection
      entities={entities}
      isLoading={isLoading}
      onSelectEntity={onSelectEntity}
    />
  ),
  "relationship-tree": ({
    forest,
    isLoading,
    selectedId,
    onSelectEntity,
    scrollRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  }: FeatureRendererProps) => (
    <LoreTreeSection
      forest={forest}
      isLoading={isLoading}
      selectedId={selectedId}
      onSelect={onSelectEntity}
      scrollRef={scrollRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  ),
  "relationship-graph": ({
    entities,
    relationships,
    isLoading,
    selectedId,
    onSelectEntity,
  }: FeatureRendererProps) => (
    <LoreGraphSection
      entities={entities}
      relationships={relationships}
      isLoading={isLoading}
      selectedId={selectedId}
      onSelectEntity={onSelectEntity}
    />
  ),
  narratives: ({ narratives, entities, onSelectEntity }: FeatureRendererProps) => (
    <LoreNarrativesSection
      narratives={narratives}
      entities={entities}
      onSelectEntity={onSelectEntity}
    />
  ),
} satisfies Record<string, (props: FeatureRendererProps) => ReactNode>;

function FeatureRenderer(props: FeatureRendererProps) {
  const renderFeature = featureComponents[props.feature.key];

  if (!renderFeature) {
    return null;
  }

  return <>{renderFeature(props)}</>;
}

export default FeatureRenderer;
