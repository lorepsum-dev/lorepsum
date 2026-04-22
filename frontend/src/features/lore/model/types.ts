export interface LoreFeature {
  id: number;
  name: string;
  description: string | null;
  display_order: number;
}

export interface LoreSidebarGroup {
  id: number;
  label: string;
  display_order: number;
  match_value: string;
  axis: {
    id: number;
    name: string;
  };
}

export interface Lore {
  id: number;
  name: string;
  description: string;
  slug: string;
  features: LoreFeature[];
  sidebar_groups: LoreSidebarGroup[];
}

export interface EntityGroup {
  name: string;
  description: string | null;
}

export interface Entity {
  id: number;
  name: string;
  description: string;
  avatar_url: string | null;
  gender: string | null;
  origin: string | null;
  categories: Record<string, string[]>;
  groups: EntityGroup[];
}

export interface Relationship {
  entity_id: number;
  related_id: number;
  type: string;
}

export interface Narrative {
  id: number;
  title: string;
  subtitle: string | null;
  slug: string;
  content: string;
  display_order: number;
  category: string | null;
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
    type: string;
    entity: Entity;
  }>;
  initials: string;
  badgeLabel: string | null;
  tagCategories: string[];
  labeledCategories: Array<[string, string[]]>;
}
