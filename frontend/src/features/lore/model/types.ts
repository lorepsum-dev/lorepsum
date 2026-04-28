export interface LoreFeature {
  id: number;
  label: string;
  description: string | null;
  displayOrder: number;
}

export interface LoreSidebarGroup {
  id: number;
  key: string;
  label: string;
  displayOrder: number;
  match: {
    id: number;
    key: string;
    label: string;
  };
  axis: {
    id: number;
    key: string;
    label: string;
  };
}

export interface LoreEntityModalPresentation {
  badgeRules: Array<{
    id: number;
    label: string;
    displayOrder: number;
    axis: {
      id: number;
      key: string;
      label: string;
    };
    match: {
      id: number;
      key: string;
      label: string;
    };
  }>;
  tagAxes: Array<{
    id: number;
    displayOrder: number;
    axis: {
      id: number;
      key: string;
      label: string;
    };
  }>;
}

export interface Lore {
  id: number;
  name: string;
  description: string;
  features: LoreFeature[];
  sidebarGroups: LoreSidebarGroup[];
  entityModalPresentation: LoreEntityModalPresentation;
}

export interface EntityCategoryValue {
  key: string;
  label: string;
}

export interface EntityCategoryAxis {
  key: string;
  label: string;
  values: EntityCategoryValue[];
}

export interface EntityGroup {
  key: string;
  label: string;
  description: string | null;
}

export interface Entity {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  entityType: {
    id: number;
    key: string;
    label: string;
  };
  categories: EntityCategoryAxis[];
  groups: EntityGroup[];
}

export interface Relationship {
  id: number;
  sourceEntityId: number;
  targetEntityId: number;
  type: {
    id: number;
    key: string;
    forwardLabel: string;
    reverseLabel: string;
    isSymmetric: boolean;
  };
}

export interface GraphData {
  nodes: Entity[];
  edges: Relationship[];
}

export interface Narrative {
  id: number;
  title: string;
  subtitle: string | null;
  slug: string;
  content: string;
  displayOrder: number;
  categoryKey: string | null;
  categoryLabel: string | null;
}

export interface TreeNode {
  entity: Entity;
  children: TreeNode[];
  parents: Entity[];
}

export interface SidebarEntityGroup {
  id: string;
  label: string;
  entities: Entity[];
}

export interface EntityModalData {
  relationshipGroups: Array<{
    key: string;
    typeKey: string;
    label: string;
    relationships: Array<{
      edgeId: number;
      entity: Entity;
    }>;
  }>;
  initials: string;
  badgeLabel: string | null;
  tagCategories: string[];
  labeledCategories: Array<[string, string[]]>;
}

export interface CollectibleCardAxis {
  key: string;
  label: string;
  values: string[];
}

export interface CollectibleCardData {
  badgeLabel: string | null;
  description: string;
  axes: CollectibleCardAxis[];
}

export interface LorePageData {
  lore: Lore;
  graph: GraphData;
  narratives: Narrative[];
}
