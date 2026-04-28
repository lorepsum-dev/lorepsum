import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarDays,
  Castle,
  Circle,
  Drama,
  Gem,
  Sparkles,
  User,
} from "lucide-react";
import type { Entity } from "./types";

export interface EntityTypeVisual {
  icon: LucideIcon;
  accent: string;
  shape: "circle" | "rounded" | "diamond";
  ring: string;
  glow: string;
}

export interface EntityTypeGraphVisual {
  color: string;
  softFill: string;
  focusFill: string;
  stroke: string;
  glow: string;
}

interface EntityTypeVisualDefinition extends EntityTypeVisual {
  graph: EntityTypeGraphVisual;
}

const VISUAL_BY_TYPE_KEY: Record<string, EntityTypeVisualDefinition> = {
  character: {
    icon: User,
    accent: "hsl(214 76% 68%)",
    shape: "circle",
    ring: "ring-[hsl(214_76%_68%/0.45)]",
    glow: "shadow-[0_0_18px_hsl(214_76%_68%/0.35)]",
    graph: {
      color: "hsl(var(--primary-light))",
      softFill: "hsl(var(--primary-light) / 0.2)",
      focusFill: "hsl(var(--primary-light) / 0.9)",
      stroke: "hsl(var(--primary-light))",
      glow: "hsl(var(--primary-light) / 0.18)",
    },
  },
  place: {
    icon: Castle,
    accent: "hsl(174 58% 57%)",
    shape: "rounded",
    ring: "ring-[hsl(174_58%_57%/0.45)]",
    glow: "shadow-[0_0_18px_hsl(174_58%_57%/0.35)]",
    graph: {
      color: "hsl(174 58% 57%)",
      softFill: "hsl(174 58% 57% / 0.2)",
      focusFill: "hsl(174 58% 57% / 0.9)",
      stroke: "hsl(174 58% 57%)",
      glow: "hsl(174 58% 57% / 0.18)",
    },
  },
  object: {
    icon: Gem,
    accent: "hsl(43 92% 68%)",
    shape: "diamond",
    ring: "ring-[hsl(43_92%_68%/0.5)]",
    glow: "shadow-[0_0_18px_hsl(43_92%_68%/0.4)]",
    graph: {
      color: "hsl(43 92% 68%)",
      softFill: "hsl(43 92% 68% / 0.2)",
      focusFill: "hsl(43 92% 68% / 0.9)",
      stroke: "hsl(43 92% 68%)",
      glow: "hsl(43 92% 68% / 0.2)",
    },
  },
  event: {
    icon: CalendarDays,
    accent: "hsl(12 86% 68%)",
    shape: "rounded",
    ring: "ring-[hsl(12_86%_68%/0.45)]",
    glow: "shadow-[0_0_18px_hsl(12_86%_68%/0.35)]",
    graph: {
      color: "hsl(12 86% 68%)",
      softFill: "hsl(12 86% 68% / 0.18)",
      focusFill: "hsl(12 86% 68% / 0.9)",
      stroke: "hsl(12 86% 68%)",
      glow: "hsl(12 86% 68% / 0.18)",
    },
  },
  concept: {
    icon: Sparkles,
    accent: "hsl(265 68% 72%)",
    shape: "diamond",
    ring: "ring-[hsl(265_68%_72%/0.5)]",
    glow: "shadow-[0_0_18px_hsl(265_68%_72%/0.4)]",
    graph: {
      color: "hsl(265 68% 72%)",
      softFill: "hsl(265 68% 72% / 0.18)",
      focusFill: "hsl(265 68% 72% / 0.88)",
      stroke: "hsl(265 68% 72%)",
      glow: "hsl(265 68% 72% / 0.18)",
    },
  },
  organization: {
    icon: Building2,
    accent: "hsl(190 78% 62%)",
    shape: "rounded",
    ring: "ring-[hsl(190_78%_62%/0.45)]",
    glow: "shadow-[0_0_18px_hsl(190_78%_62%/0.35)]",
    graph: {
      color: "hsl(190 78% 62%)",
      softFill: "hsl(190 78% 62% / 0.18)",
      focusFill: "hsl(190 78% 62% / 0.9)",
      stroke: "hsl(190 78% 62%)",
      glow: "hsl(190 78% 62% / 0.18)",
    },
  },
  symbol: {
    icon: Drama,
    accent: "hsl(322 65% 70%)",
    shape: "circle",
    ring: "ring-[hsl(322_65%_70%/0.45)]",
    glow: "shadow-[0_0_18px_hsl(322_65%_70%/0.35)]",
    graph: {
      color: "hsl(322 65% 70%)",
      softFill: "hsl(322 65% 70% / 0.18)",
      focusFill: "hsl(322 65% 70% / 0.88)",
      stroke: "hsl(322 65% 70%)",
      glow: "hsl(322 65% 70% / 0.18)",
    },
  },
} satisfies Record<string, EntityTypeVisualDefinition>;

const FALLBACK_VISUAL: EntityTypeVisualDefinition = {
  icon: Circle,
  accent: "hsl(var(--primary-light))",
  shape: "circle",
  ring: "ring-[hsl(var(--primary-light)/0.4)]",
  glow: "shadow-[0_0_16px_hsl(var(--primary-light)/0.3)]",
  graph: {
    color: "hsl(var(--primary-light))",
    softFill: "hsl(var(--primary-light) / 0.16)",
    focusFill: "hsl(var(--primary-light) / 0.86)",
    stroke: "hsl(var(--primary-light))",
    glow: "hsl(var(--primary-light) / 0.16)",
  },
};

export function getEntityTypeVisual(entity: Entity): EntityTypeVisual {
  const key = entity.entityType.key ?? "";
  return VISUAL_BY_TYPE_KEY[key] ?? FALLBACK_VISUAL;
}

export function getEntityTypeGraphVisual(entity: Entity): EntityTypeGraphVisual {
  const key = entity.entityType.key ?? "";
  return (VISUAL_BY_TYPE_KEY[key] ?? FALLBACK_VISUAL).graph;
}

export function getEntityTypeGraphVisualByKey(key: string | null | undefined): EntityTypeGraphVisual {
  return (VISUAL_BY_TYPE_KEY[key ?? ""] ?? FALLBACK_VISUAL).graph;
}

export function getCenterEntityVisual(entity: Entity): EntityTypeVisual {
  const baseVisual = getEntityTypeVisual(entity);

  return {
    ...baseVisual,
    glow: "shadow-[0_0_42px_hsl(var(--primary-light)/0.45)]",
  };
}
