import type {
  Entity,
  EntityCategoryAxis,
  EntityGroup,
  GraphData,
  Lore,
  LoreFeature,
  LorePageData,
  LoreSidebarGroup,
  Narrative,
  Relationship,
} from "./types";

interface ApiLoreFeature {
  id: number;
  label: string;
  description: string | null;
  display_order: number;
}

interface ApiLoreSidebarGroup {
  id: number;
  key: string;
  label: string;
  display_order: number;
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

interface ApiEntityCategoryValue {
  key: string;
  label: string;
}

interface ApiEntityCategoryAxis {
  key: string;
  label: string;
  values: ApiEntityCategoryValue[];
}

interface ApiEntityGroup {
  key: string;
  label: string;
  description: string | null;
}

interface ApiEntity {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  entity_type: {
    id: number;
    key: string;
    label: string;
  };
  categories: ApiEntityCategoryAxis[];
  groups: ApiEntityGroup[];
}

interface ApiRelationship {
  id: number;
  source_entity_id: number;
  target_entity_id: number;
  relationship_type: {
    id: number;
    key: string;
    forward_label: string;
    reverse_label: string;
    is_symmetric: boolean;
  };
}

interface ApiNarrative {
  id: number;
  title: string;
  subtitle: string | null;
  slug: string;
  content: string;
  display_order: number;
  category_key: string | null;
  category_label: string | null;
}

interface ApiLore {
  id: number;
  name: string;
  description: string;
  features: ApiLoreFeature[];
  sidebar_groups: ApiLoreSidebarGroup[];
  entity_modal_presentation: {
    badge_rules: Array<{
      id: number;
      label: string;
      display_order: number;
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
    tag_axes: Array<{
      id: number;
      display_order: number;
      axis: {
        id: number;
        key: string;
        label: string;
      };
    }>;
  };
}

interface ApiLorePageResponse {
  lore: ApiLore;
  graph: {
    nodes: ApiEntity[];
    edges: ApiRelationship[];
  };
  narratives: ApiNarrative[];
}

function normalizeFeature(feature: ApiLoreFeature): LoreFeature {
  return {
    id: feature.id,
    label: feature.label,
    description: feature.description,
    displayOrder: feature.display_order,
  };
}

function normalizeSidebarGroup(group: ApiLoreSidebarGroup): LoreSidebarGroup {
  return {
    id: group.id,
    key: group.key,
    label: group.label,
    displayOrder: group.display_order,
    match: {
      id: group.match.id,
      key: group.match.key,
      label: group.match.label,
    },
    axis: {
      id: group.axis.id,
      key: group.axis.key,
      label: group.axis.label,
    },
  };
}

function normalizeCategoryAxis(axis: ApiEntityCategoryAxis): EntityCategoryAxis {
  return {
    key: axis.key,
    label: axis.label,
    values: axis.values.map((value) => ({
      key: value.key,
      label: value.label,
    })),
  };
}

function normalizeGroup(group: ApiEntityGroup): EntityGroup {
  return {
    key: group.key,
    label: group.label,
    description: group.description,
  };
}

function normalizeEntity(entity: ApiEntity): Entity {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    imageUrl: entity.image_url,
    entityType: {
      id: entity.entity_type.id,
      key: entity.entity_type.key,
      label: entity.entity_type.label,
    },
    categories: entity.categories.map(normalizeCategoryAxis),
    groups: entity.groups.map(normalizeGroup),
  };
}

function normalizeRelationship(relationship: ApiRelationship): Relationship {
  return {
    id: relationship.id,
    sourceEntityId: relationship.source_entity_id,
    targetEntityId: relationship.target_entity_id,
    type: {
      id: relationship.relationship_type.id,
      key: relationship.relationship_type.key,
      forwardLabel: relationship.relationship_type.forward_label,
      reverseLabel: relationship.relationship_type.reverse_label,
      isSymmetric: relationship.relationship_type.is_symmetric,
    },
  };
}

function normalizeGraph(graph: ApiLorePageResponse["graph"]): GraphData {
  return {
    nodes: graph.nodes.map(normalizeEntity),
    edges: graph.edges.map(normalizeRelationship),
  };
}

function normalizeNarrative(narrative: ApiNarrative): Narrative {
  return {
    id: narrative.id,
    title: narrative.title,
    subtitle: narrative.subtitle,
    slug: narrative.slug,
    content: narrative.content,
    displayOrder: narrative.display_order,
    categoryKey: narrative.category_key,
    categoryLabel: narrative.category_label,
  };
}

function normalizeLore(lore: ApiLore): Lore {
  return {
    id: lore.id,
    name: lore.name,
    description: lore.description,
    features: lore.features.map(normalizeFeature),
    sidebarGroups: lore.sidebar_groups.map(normalizeSidebarGroup),
    entityModalPresentation: {
      badgeRules: lore.entity_modal_presentation.badge_rules.map((rule) => ({
        id: rule.id,
        label: rule.label,
        displayOrder: rule.display_order,
        axis: {
          id: rule.axis.id,
          key: rule.axis.key,
          label: rule.axis.label,
        },
        match: {
          id: rule.match.id,
          key: rule.match.key,
          label: rule.match.label,
        },
      })),
      tagAxes: lore.entity_modal_presentation.tag_axes.map((axisRule) => ({
        id: axisRule.id,
        displayOrder: axisRule.display_order,
        axis: {
          id: axisRule.axis.id,
          key: axisRule.axis.key,
          label: axisRule.axis.label,
        },
      })),
    },
  };
}

function normalizeLorePage(response: ApiLorePageResponse): LorePageData {
  return {
    lore: normalizeLore(response.lore),
    graph: normalizeGraph(response.graph),
    narratives: response.narratives.map(normalizeNarrative),
  };
}

export { normalizeLorePage };
export type { ApiLorePageResponse };
