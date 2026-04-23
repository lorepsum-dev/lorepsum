import type {
  Entity,
  EntityCategoryAxis,
  EntityGroup,
  Lore,
  LoreFeature,
  LorePageData,
  LoreSidebarGroup,
  Narrative,
  Relationship,
} from "./types";

interface ApiLoreFeature {
  id: number;
  key: string;
  label: string;
  description: string | null;
  display_order: number;
}

interface ApiLoreSidebarGroup {
  id: number;
  key: string;
  label: string;
  display_order: number;
  match_key: string;
  match_value: string;
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
  avatar_url: string | null;
  gender: string | null;
  origin: string | null;
  categories: ApiEntityCategoryAxis[];
  groups: ApiEntityGroup[];
}

interface ApiRelationship {
  entity_id: number;
  related_id: number;
  type: string;
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
  slug: string;
  features: ApiLoreFeature[];
  sidebar_groups: ApiLoreSidebarGroup[];
  presentation: {
    entity_modal: {
      badge_rules: Array<{
        axis_key: string;
        value_key: string;
        label: string;
      }>;
      tag_axis_keys: string[];
    };
  };
}

interface ApiLorePageResponse {
  lore: ApiLore;
  entities: ApiEntity[];
  relationships: ApiRelationship[];
  narratives: ApiNarrative[];
}

function normalizeFeature(feature: ApiLoreFeature): LoreFeature {
  return {
    id: feature.id,
    key: feature.key,
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
    matchKey: group.match_key,
    matchLabel: group.match_value,
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
    avatarUrl: entity.avatar_url,
    gender: entity.gender,
    origin: entity.origin,
    categories: entity.categories.map(normalizeCategoryAxis),
    groups: entity.groups.map(normalizeGroup),
  };
}

function normalizeRelationship(relationship: ApiRelationship): Relationship {
  return {
    entityId: relationship.entity_id,
    relatedId: relationship.related_id,
    kind: relationship.type,
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
    slug: lore.slug,
    features: lore.features.map(normalizeFeature),
    sidebarGroups: lore.sidebar_groups.map(normalizeSidebarGroup),
    presentation: {
      entityModal: {
        badgeRules: lore.presentation.entity_modal.badge_rules.map((rule) => ({
          axisKey: rule.axis_key,
          valueKey: rule.value_key,
          label: rule.label,
        })),
        tagAxisKeys: lore.presentation.entity_modal.tag_axis_keys,
      },
    },
  };
}

function normalizeLorePage(response: ApiLorePageResponse): LorePageData {
  return {
    lore: normalizeLore(response.lore),
    entities: response.entities.map(normalizeEntity),
    relationships: response.relationships.map(normalizeRelationship),
    narratives: response.narratives.map(normalizeNarrative),
  };
}

export { normalizeLorePage };
export type { ApiLorePageResponse };
