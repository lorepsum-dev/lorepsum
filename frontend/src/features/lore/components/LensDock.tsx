import { BookOpen, GitBranch, LayoutGrid, Network, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { LoreFeature } from "../model/types";

interface LensDockProps {
  features: LoreFeature[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const LENS_ICONS: Record<number, LucideIcon> = {
  1: GitBranch,
  2: BookOpen,
  3: LayoutGrid,
  4: Network,
};

function LensDock({ features, activeIndex, onSelect }: LensDockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (features.length === 0) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        aria-label="Lenses"
        className="fixed left-3 top-3 z-[60] hidden flex-row items-center gap-1.5 rounded-xl border border-primary-light/10 bg-background/60 px-2 py-1.5 backdrop-blur-sm sm:flex"
      >
        <button
          type="button"
          onClick={() => setIsCollapsed((value) => !value)}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand lenses" : "Collapse lenses"}
          className={cn(
            "rounded px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.3em] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light/40",
            isCollapsed
              ? "text-primary-light/60 hover:text-primary-light/90"
              : "text-primary-light/30 hover:text-primary-light/70",
          )}
        >
          lens
        </button>

        {!isCollapsed &&
          features.map((feature, index) => {
            const Icon = LENS_ICONS[feature.id] ?? Sparkles;
            const isActive = index === activeIndex;
            const shortcut = index + 1;

            return (
              <Tooltip key={feature.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onSelect(index)}
                    aria-label={feature.label}
                    aria-current={isActive}
                    className={cn(
                      "group relative flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light/40",
                      isActive
                        ? "border-primary-light/40 bg-primary/15 text-primary-light shadow-[0_0_14px_hsl(var(--primary-light)/0.25),inset_0_1px_0_hsl(var(--primary-light)/0.1)]"
                        : "border-primary-light/10 bg-background/40 text-primary-light/40 hover:border-primary-light/25 hover:text-primary-light/70",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    {shortcut <= 9 && (
                      <span
                        className={cn(
                          "absolute -bottom-1 -right-1 rounded-full border border-primary-light/15 bg-background px-1 font-mono text-[8px] leading-tight transition-colors",
                          isActive ? "text-primary-light/70" : "text-primary-light/25",
                        )}
                      >
                        {shortcut}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={10}
                  className="border-primary-light/20 bg-background/95 font-display text-xs uppercase tracking-[0.25em] text-primary-light"
                >
                  {feature.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
      </aside>
    </TooltipProvider>
  );
}

export default LensDock;
