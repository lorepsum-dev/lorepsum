export interface LoreFeature {
  id: number;
  key: string;
  label: string;
  description: string | null;
  displayOrder: number;
}

export interface LoreSidebarGroup {
  id: number;
  key: string;
  label: string;
  displayOrder: number;
  matchKey: string;
  matchLabel: string;
  axis: {
    id: number;
    key: string;
    label: string;
  };
}

export interface LorePresentation {
  entityModal: {
    badgeRules: Array<{
      axisKey: string;
      valueKey: string;
      label: string;
    }>;
    tagAxisKeys: string[];
  };
}

export interface Lore {
  id: number;
  name: string;
  description: string;
  slug: string;
  features: LoreFeature[];
  sidebarGroups: LoreSidebarGroup[];
  presentation: LorePresentation;
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
  avatarUrl: string | null;
  gender: string | null;
  origin: string | null;
  categories: EntityCategoryAxis[];
  groups: EntityGroup[];
}

export interface Relationship {
  entityId: number;
  relatedId: number;
  kind: string;
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
  parents: Entity[];
  relatedEntities: Array<{
    kind: string;
    label: string;
    entity: Entity;
  }>;
  initials: string;
  badgeLabel: string | null;
  tagCategories: string[];
  labeledCategories: Array<[string, string[]]>;
}

export interface LorePageData {
  lore: Lore;
  entities: Entity[];
  relationships: Relationship[];
  narratives: Narrative[];
}
