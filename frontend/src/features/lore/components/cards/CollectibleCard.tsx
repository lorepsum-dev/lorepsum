import { cn } from "@/lib/utils";
import { useEntityImage } from "../../hooks/useEntityImage";
import { mapCollectibleCard } from "../../model/mapCollectibleCard";
import type { Entity, LoreEntityModalPresentation } from "../../model/types";

type CollectibleCardSize = "sm" | "lg";

interface CollectibleCardProps {
  entity: Entity;
  presentation: LoreEntityModalPresentation;
  size?: CollectibleCardSize;
  className?: string;
}

interface SizeTokens {
  card: string;
  padding: string;
  headerHeight: string;
  headerText: string;
  nameHeight: string;
  nameText: string;
  descriptionHeight: string;
  descriptionText: string;
  axesHeight: string;
  axesText: string;
  axesLabelWidth: string;
}

const SIZE_TOKENS: Record<CollectibleCardSize, SizeTokens> = {
  sm: {
    card: "h-[20rem] w-52",
    padding: "p-3",
    headerHeight: "h-5",
    headerText: "text-[8px]",
    nameHeight: "h-7",
    nameText: "text-base",
    descriptionHeight: "h-10",
    descriptionText: "text-[10px] leading-snug",
    axesHeight: "h-12",
    axesText: "text-[9px]",
    axesLabelWidth: "w-14",
  },
  lg: {
    card: "h-[38rem] w-[20rem]",
    padding: "p-4",
    headerHeight: "h-5",
    headerText: "text-[10px]",
    nameHeight: "h-8",
    nameText: "text-xl",
    descriptionHeight: "h-[4.5rem]",
    descriptionText: "text-xs leading-relaxed",
    axesHeight: "h-[6.25rem]",
    axesText: "text-[9px]",
    axesLabelWidth: "w-auto",
  },
};

function CollectibleCard({
  entity,
  presentation,
  size = "lg",
  className,
}: CollectibleCardProps) {
  const tokens = SIZE_TOKENS[size];
  const { imageSrc, onImageError } = useEntityImage(entity.imageUrl);
  const cardData = mapCollectibleCard(entity, presentation);

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[1.5rem] border border-primary-light/15",
        "shadow-[0_30px_60px_-30px_hsl(var(--primary-light)/0.45),0_0_30px_-10px_hsl(var(--primary-glow)/0.25),inset_0_1px_0_hsl(var(--primary-light)/0.08)]",
        tokens.card,
        tokens.padding,
        className,
      )}
      style={{ background: "var(--gradient-card)" }}
    >
      <div className={cn("flex items-center justify-between gap-3", tokens.headerHeight)}>
        <span
          className={cn(
            "min-w-0 truncate font-display uppercase tracking-[0.32em] text-primary-light/80",
            tokens.headerText,
          )}
        >
          {entity.entityType.label}
        </span>

        <span
          className={cn(
            "max-w-[48%] truncate rounded-full border border-primary-light/30 bg-primary/25 px-2.5 py-[3px] text-right font-semibold uppercase tracking-[0.2em] text-primary-light",
            tokens.headerText,
            !cardData.badgeLabel && "invisible",
          )}
        >
          {cardData.badgeLabel || "badge"}
        </span>
      </div>

      <h3
        className={cn(
          "mt-1.5 truncate text-center font-display font-semibold leading-tight text-foreground",
          tokens.nameHeight,
          tokens.nameText,
        )}
      >
        {entity.name}
      </h3>

      <div
        className={cn(
          "relative mx-auto mt-2.5 flex w-[15rem] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary-light/10 bg-background/20",
        )}
        style={{ aspectRatio: "3 / 4" }}
      >
        <img
          src={imageSrc}
          alt={entity.name}
          onError={onImageError}
          loading="lazy"
          className="h-full w-full object-contain p-2"
        />
      </div>

      <p
        className={cn(
          "mt-2.5 line-clamp-6 text-center text-muted-foreground",
          "shrink-0",
          tokens.descriptionHeight,
          tokens.descriptionText,
        )}
      >
        {cardData.description}
      </p>

      <div className={cn("mt-auto flex shrink-0 flex-col justify-end gap-1.5", tokens.axesHeight)}>
        {cardData.axes.length > 0 ? (
          cardData.axes.map((axis, index) => (
            <div
              key={axis.key}
              className="flex min-h-0 items-center rounded-lg border border-primary-light/12 bg-secondary/25 px-2.5 py-1.5 shadow-[inset_0_1px_0_hsl(var(--primary-light)/0.06)]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  aria-hidden="true"
                  className="shrink-0 font-display text-xs leading-none text-primary-light/60 drop-shadow-[0_0_6px_hsl(var(--primary-light)/0.35)]"
                >
                  ✦
                </span>

                <span
                  className={cn(
                    "w-16 shrink-0 truncate font-mono uppercase tracking-[0.18em] text-primary-light/60",
                    tokens.axesText,
                  )}
                >
                  {axis.label}
                </span>

                <span className="min-w-0 truncate text-right text-xs font-medium leading-tight text-foreground/85">
                  {axis.values.join(", ")}
                </span>
              </div>
            </div>
          ))
        ) : (
          <span aria-hidden="true" className={cn("invisible", tokens.axesText)}>
            -
          </span>
        )}
      </div>
    </div>
  );
}

export type { CollectibleCardSize };
export default CollectibleCard;
