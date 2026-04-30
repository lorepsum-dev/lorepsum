import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getEntityTypeVisual } from "../model/entityTypeVisuals";
import type { Entity, LoreEntityModalPresentation } from "../model/types";
import CollectibleCard from "./cards/CollectibleCard";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entities: Entity[];
  presentation: LoreEntityModalPresentation | undefined;
  onSelectEntity: (id: number) => void;
}

function CommandPalette({
  open,
  onOpenChange,
  entities,
  presentation,
  onSelectEntity,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [activeValue, setActiveValue] = useState<string>("");

  const sortedEntities = useMemo(
    () => entities.slice().sort((left, right) => left.name.localeCompare(right.name)),
    [entities],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setSearch("");
    setActiveValue(sortedEntities[0] ? String(sortedEntities[0].id) : "");
  }, [open, sortedEntities]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  const activeEntity = sortedEntities.find((entity) => String(entity.id) === activeValue) ?? null;

  return (
    <div className="fixed inset-0 z-[60] animate-in fade-in duration-150">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative mx-auto flex w-full max-w-[58rem] items-start justify-center gap-6 px-4 pt-[12vh]">
        <Command
          label="Search entities"
          value={activeValue}
          onValueChange={setActiveValue}
          loop
          className={cn(
            "flex w-full max-w-[26rem] flex-col overflow-hidden rounded-2xl border border-primary-light/20 bg-background/95",
            "shadow-[0_30px_80px_-30px_hsl(var(--primary-light)/0.45),0_0_40px_-10px_hsl(var(--primary-glow)/0.3),inset_0_1px_0_hsl(var(--primary-light)/0.08)]",
            "animate-in fade-in zoom-in-95 duration-200",
          )}
        >
          <div className="flex items-center gap-3 border-b border-primary-light/15 px-4 py-3">
            <Search className="h-4 w-4 text-primary-light/50" strokeWidth={1.5} />
            <Command.Input
              autoFocus
              value={search}
              onValueChange={setSearch}
              placeholder="Search entities..."
              className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
            <span className="rounded border border-primary-light/15 px-1.5 py-0.5 font-mono text-[10px] text-primary-light/40">
              esc
            </span>
          </div>

          <Command.List className="max-h-[50vh] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center font-mono text-xs text-muted-foreground/50">
              No entities found.
            </Command.Empty>

            {sortedEntities.map((entity) => {
              const visual = getEntityTypeVisual(entity);
              const Icon = visual.icon;

              return (
                <Command.Item
                  key={entity.id}
                  value={String(entity.id)}
                  keywords={[entity.name, entity.entityType.label]}
                  onSelect={() => {
                    onSelectEntity(entity.id);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                    "data-[selected=true]:bg-primary/15 data-[selected=true]:text-primary-light",
                    "text-muted-foreground",
                  )}
                >
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: visual.accent }}
                    strokeWidth={1.5}
                  />
                  <span className="flex-1 truncate font-mono text-sm text-foreground/85">
                    {entity.name}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-light/40">
                    {entity.entityType.label}
                  </span>
                </Command.Item>
              );
            })}
          </Command.List>

          <div className="flex items-center justify-between border-t border-primary-light/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-light/40">
            <div className="flex items-center gap-3">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
            </div>
            <span>{sortedEntities.length} entities</span>
          </div>
        </Command>

        <div className="hidden md:block">
          {activeEntity && presentation ? (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <CollectibleCard entity={activeEntity} presentation={presentation} size="lg" />
            </div>
          ) : (
            <div
              className={cn(
                "h-[38rem] w-[20rem] rounded-[1.5rem] border border-dashed border-primary-light/15",
                "flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-primary-light/20",
              )}
            >
              preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
