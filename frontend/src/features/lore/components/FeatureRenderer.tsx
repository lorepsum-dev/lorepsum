import type { MouseEvent, ReactNode, RefObject } from "react";
import LoreNarrativesSection from "./LoreNarrativesSection";
import LoreTreeSection from "./LoreTreeSection";
import type { Entity, LoreFeature, Narrative, TreeNode } from "../model/types";

interface FeatureRendererProps {
  feature: LoreFeature;
  forest: TreeNode[];
  narratives: Narrative[];
  entities: Entity[];
  isTreeLoading: boolean;
  selectedId: number | null;
  onSelectEntity: (id: number) => void;
  scrollRef: RefObject<HTMLDivElement>;
  onMouseDown: (event: MouseEvent) => void;
  onMouseMove: (event: MouseEvent) => void;
  onMouseUp: () => void;
}

const featureComponents = {
  tree: ({
    forest,
    isTreeLoading,
    selectedId,
    onSelectEntity,
    scrollRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  }: FeatureRendererProps) => (
    <LoreTreeSection
      forest={forest}
      isLoading={isTreeLoading}
      selectedId={selectedId}
      onSelect={onSelectEntity}
      scrollRef={scrollRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  ),
  narratives: ({ narratives, entities, onSelectEntity }: FeatureRendererProps) => (
    <LoreNarrativesSection
      narratives={narratives}
      entities={entities}
      onSelectEntity={onSelectEntity}
    />
  ),
} satisfies Partial<Record<string, (props: FeatureRendererProps) => ReactNode>>;

const FeatureRenderer = (props: FeatureRendererProps) => {
  const renderFeature = featureComponents[props.feature.name];

  if (!renderFeature) {
    return null;
  }

  return <>{renderFeature(props)}</>;
};

export default FeatureRenderer;
