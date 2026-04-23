import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Entity, Narrative } from "../model/types";

interface LoreNarrativesSectionProps {
  narratives: Narrative[];
  entities: Entity[];
  onSelectEntity: (id: number) => void;
}

function NarrativeAccordion({
  narratives,
  entities,
  onSelectEntity,
}: LoreNarrativesSectionProps) {
  const [openId, setOpenId] = useState<number | null>(narratives[0]?.id ?? null);
  const entitiesByName = useMemo(() => new Map(
    entities.map((entity) => [entity.name.toLowerCase(), entity]),
  ), [entities]);

  const renderContent = (text: string) =>
    text.split(/\*\*(.+?)\*\*/g).map((part, index) => {
      if (index % 2 !== 1) {
        return <span key={index}>{part}</span>;
      }

      const entity = entitiesByName.get(part.toLowerCase());

      if (entity) {
        return (
          <button
            key={index}
            onClick={() => onSelectEntity(entity.id)}
            className="inline font-semibold text-primary-light transition-colors decoration-primary-light/40 underline-offset-2 hover:underline"
          >
            {part}
          </button>
        );
      }

      return (
        <strong key={index} className="font-semibold text-primary-light/80">
          {part}
        </strong>
      );
    });

  return (
    <div className="flex w-full max-w-3xl flex-col divide-y divide-primary-light/10">
      {narratives.map((narrative) => {
        const isOpen = openId === narrative.id;

        return (
          <div key={narrative.id} className="overflow-hidden">
            <button
              onClick={() => setOpenId((current) => (current === narrative.id ? null : narrative.id))}
              className="group flex w-full items-start justify-between gap-4 py-5 text-left focus:outline-none"
            >
              <div className="flex flex-col gap-1">
                {narrative.categoryLabel && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary-light/30">
                    {narrative.categoryLabel}
                  </span>
                )}
                <span
                  className={cn(
                    "font-display text-lg font-semibold transition-colors duration-200",
                    isOpen ? "text-gradient-purple" : "text-foreground/70 group-hover:text-foreground",
                  )}
                >
                  {narrative.title}
                </span>
                {narrative.subtitle && (
                  <span className="font-mono text-xs italic text-muted-foreground/60">
                    {narrative.subtitle}
                  </span>
                )}
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "mt-1.5 shrink-0 text-primary-light/40 transition-transform duration-300",
                  isOpen ? "rotate-180 text-primary-light/70" : "group-hover:text-primary-light/60",
                )}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              style={{ maxHeight: isOpen ? "800px" : "0px" }}
              className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
            >
              <p className="pb-6 font-mono text-sm leading-relaxed text-muted-foreground">
                {renderContent(narrative.content)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LoreNarrativesSection({
  narratives,
  entities,
  onSelectEntity,
}: LoreNarrativesSectionProps) {
  return (
    <>
      <div className="narrative-scroll w-full max-w-3xl flex-1 overflow-y-auto pr-2">
        {narratives.length > 0 ? (
          <NarrativeAccordion
            narratives={narratives}
            entities={entities}
            onSelectEntity={onSelectEntity}
          />
        ) : (
          <p className="text-center font-mono text-xs italic uppercase tracking-[0.3em] text-primary-light/20">
            to be written.
          </p>
        )}
      </div>
    </>
  );
}

export default LoreNarrativesSection;
