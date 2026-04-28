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

const VISUAL_BY_TYPE_KEY: Record<string, EntityTypeVisual> = {
  character: {
    icon: User,
    accent: "hsl(214 76% 68%)",
    shape: "circle",
    ring: "ring-[hsl(214_76%_68%/0.45)]",
    glow: "shadow-[0_0_18px_hsl(214_76%_68%/0.35)]",
  },
  place: {
    icon: Castle,
    accent: "hsl(174 58% 57%)",
    shape: "rounded",
    ring: "ring-[hsl(174_58%_57%/0.45)]",
    glow: "shadow-[0_0_18px_hsl(174_58%_57%/0.35)]",
  },
  object: {
    icon: Gem,
    accent: "hsl(43 92% 68%)",
    shape: "diamond",
    ring: "ring-[hsl(43_92%_68%/0.5)]",
    glow: "shadow-[0_0_18px_hsl(43_92%_68%/0.4)]",
  },
  event: {
    icon: CalendarDays,
    accent: "hsl(12 86% 68%)",
    shape: "rounded",
    ring: "ring-[hsl(12_86%_68%/0.45)]",
    glow: "shadow-[0_0_18px_hsl(12_86%_68%/0.35)]",
  },
  concept: {
    icon: Sparkles,
    accent: "hsl(265 68% 72%)",
    shape: "diamond",
    ring: "ring-[hsl(265_68%_72%/0.5)]",
    glow: "shadow-[0_0_18px_hsl(265_68%_72%/0.4)]",
  },
  organization: {
    icon: Building2,
    accent: "hsl(190 78% 62%)",
    shape: "rounded",
    ring: "ring-[hsl(190_78%_62%/0.45)]",
    glow: "shadow-[0_0_18px_hsl(190_78%_62%/0.35)]",
  },
  symbol: {
    icon: Drama,
    accent: "hsl(322 65% 70%)",
    shape: "circle",
    ring: "ring-[hsl(322_65%_70%/0.45)]",
    glow: "shadow-[0_0_18px_hsl(322_65%_70%/0.35)]",
  },
};

const FALLBACK_VISUAL: EntityTypeVisual = {
  icon: Circle,
  accent: "hsl(var(--primary-light))",
  shape: "circle",
  ring: "ring-[hsl(var(--primary-light)/0.4)]",
  glow: "shadow-[0_0_16px_hsl(var(--primary-light)/0.3)]",
};

export function getEntityTypeVisual(entity: Entity): EntityTypeVisual {
  const key = entity.entityType.key ?? "";
  return VISUAL_BY_TYPE_KEY[key] ?? FALLBACK_VISUAL;
}

export function getCenterEntityVisual(entity: Entity): EntityTypeVisual {
  const baseVisual = getEntityTypeVisual(entity);

  return {
    ...baseVisual,
    glow: "shadow-[0_0_42px_hsl(var(--primary-light)/0.45)]",
  };
}
