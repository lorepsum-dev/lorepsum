import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useEntityAvatar } from "../hooks/useEntityAvatar";
import { mapEntityModal } from "../model/mapEntityModal";
import type { Entity, LoreEntityModalPresentation, Relationship } from "../model/types";

const RELATIONSHIP_PREVIEW_LIMIT = 3;
const RELATIONSHIP_COLLAPSE_THRESHOLD = 4;

interface EntityModalProps {
  entity: Entity;
  entities: Entity[];
  relationships: Relationship[];
  entityModalPresentation: LoreEntityModalPresentation;
  onClose: () => void;
}

function getDefaultExpandedGroupKeys(
  relationshipGroups: ReturnType<typeof mapEntityModal>["relationshipGroups"],
) {
  return relationshipGroups
    .filter((relationshipGroup) => relationshipGroup.relationships.length < RELATIONSHIP_COLLAPSE_THRESHOLD)
    .map((relationshipGroup) => relationshipGroup.key);
}

function getRelationshipPreview(names: string[]) {
  const previewNames = names.slice(0, RELATIONSHIP_PREVIEW_LIMIT);
  const remainingCount = names.length - previewNames.length;
  return `${previewNames.join(", ")}${remainingCount > 0 ? ` +${remainingCount} more` : ""}`;
}

function EntityModal({
  entity,
  entities,
  relationships,
  entityModalPresentation,
  onClose,
}: EntityModalProps) {
  const modalData = useMemo(
    () => mapEntityModal(entity, relationships, entities, entityModalPresentation),
    [entity, relationships, entities, entityModalPresentation],
  );
  const { avatarSrc, onAvatarError } = useEntityAvatar(entity.avatarUrl);
  const [isShowingBack, setIsShowingBack] = useState(false);
  const [expandedGroupKeys, setExpandedGroupKeys] = useState<string[]>(() =>
    getDefaultExpandedGroupKeys(modalData.relationshipGroups),
  );

  useEffect(() => {
    setIsShowingBack(false);
    setExpandedGroupKeys(getDefaultExpandedGroupKeys(modalData.relationshipGroups));
  }, [entity.id, modalData.relationshipGroups]);

  const toggleRelationshipGroup = (groupKey: string) => {
    setExpandedGroupKeys((current) =>
      current.includes(groupKey)
        ? current.filter((key) => key !== groupKey)
        : [...current, groupKey],
    );
  };

  const handleCardToggle = () => setIsShowingBack((current) => !current);

  return (
    <>
      <div
        className="fixed inset-0 z-40 animate-in fade-in bg-background/60 backdrop-blur-sm duration-200"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[min(26rem,98vw)] -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 px-2 duration-300">
        <button
          onClick={onClose}
          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-primary-light/15 bg-secondary/80 text-3xl leading-none text-muted-foreground/60 transition hover:border-primary-light/40 hover:text-primary-light"
        >
          x
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Left arrow — flip back (active when showing back) */}
          <button
            onClick={handleCardToggle}
            aria-label="Virar card"
            className={cn(
              "shrink-0 transition-all duration-300 focus:outline-none",
              isShowingBack
                ? "text-primary-light/70 drop-shadow-[0_0_10px_hsl(var(--primary-light)/0.5)] hover:text-primary-light"
                : "text-primary-light/15 hover:text-primary-light/35",
            )}
          >
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
              <path
                d="M30 10 C 20 10, 10 15, 10 30 C 10 45, 20 50, 30 50 M 30 50 L 22 42 M 30 50 L 22 58"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Perspective wrapper for 3D flip */}
          <div className="min-w-0 flex-1" style={{ perspective: "1200px" }}>
            {/* Rotating card shell */}
            <div
              className="card-glow relative rounded-[1.25rem] border border-primary-light/10"
              style={{
                background: "var(--gradient-card)",
                transformStyle: "preserve-3d",
                transition: "transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)",
                transform: isShowingBack ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front face — drives card height */}
              <div
                className="flex max-h-[88vh] flex-col p-4 sm:p-5"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  pointerEvents: isShowingBack ? "none" : "auto",
                }}
              >
                <div className="mb-4 flex min-h-[24px] items-center">
                  {entity.origin && (
                    <span className="font-display text-xs uppercase tracking-[0.25em] text-primary-light/80">
                      {entity.origin}
                    </span>
                  )}
                  {modalData.badgeLabel && (
                    <span className="ml-auto rounded-full border border-primary-light/30 bg-primary/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-light">
                      {modalData.badgeLabel}
                    </span>
                  )}
                </div>

                <div className="mb-4 text-center">
                  <h3 className="font-display text-2xl font-semibold text-foreground">{entity.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entity.description}</p>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                  {modalData.relationshipGroups.length > 0 && (
                    <div className="mb-4 flex flex-col gap-3">
                      {modalData.relationshipGroups.map((relationshipGroup) => {
                        const names = relationshipGroup.relationships.map((r) => r.entity.name);
                        const isLargeGroup = relationshipGroup.relationships.length >= RELATIONSHIP_COLLAPSE_THRESHOLD;
                        const isExpanded = isLargeGroup ? expandedGroupKeys.includes(relationshipGroup.key) : true;

                        return (
                          <div key={relationshipGroup.key} className="rounded-lg border border-primary-light/10 bg-secondary/20 px-3 py-2">
                            {isLargeGroup ? (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleRelationshipGroup(relationshipGroup.key); }}
                                  className="group flex w-full items-start gap-3 text-left focus:outline-none"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="font-mono text-xs text-primary-light/70">
                                      {relationshipGroup.label} ({relationshipGroup.relationships.length})
                                    </div>
                                    {!isExpanded && (
                                      <div className="mt-1 font-mono text-xs leading-relaxed text-muted-foreground/80">
                                        {getRelationshipPreview(names)}
                                      </div>
                                    )}
                                  </div>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={cn(
                                      "mt-1 shrink-0 text-primary-light/40 transition-transform duration-200",
                                      isExpanded ? "rotate-90 text-primary-light/70" : "group-hover:text-primary-light/60",
                                    )}
                                  >
                                    <path d="m9 18 6-6-6-6" />
                                  </svg>
                                </button>
                                <div
                                  style={{ maxHeight: isExpanded ? "320px" : "0px" }}
                                  className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                                >
                                  <div className="pt-2 font-mono text-xs leading-relaxed text-muted-foreground/80">
                                    {names.join(", ")}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="font-mono text-xs text-primary-light/70">
                                  {relationshipGroup.label} ({relationshipGroup.relationships.length})
                                </div>
                                <div className="mt-1 font-mono text-xs leading-relaxed text-muted-foreground/80">
                                  {names.join(", ")}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {(modalData.tagCategories.length > 0 || modalData.labeledCategories.length > 0) && (
                    <>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-light/30 to-transparent" />
                        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-primary-light/60">
                          Traits
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-light/30 to-transparent" />
                      </div>

                      {modalData.tagCategories.length > 0 && (
                        <div className="mb-3 flex flex-wrap justify-center gap-1.5">
                          {modalData.tagCategories.map((category) => (
                            <span
                              key={category}
                              className="rounded-md border border-primary-light/18 bg-primary/14 px-2.5 py-1 text-xs font-medium text-primary-light"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}

                      {(modalData.labeledCategories.length > 0 || entity.gender) && (
                        <div className="flex flex-col gap-1 font-mono text-xs">
                          {entity.gender && (
                            <div className="flex gap-2">
                              <span className="shrink-0 text-primary-light/40">gender:</span>
                              <span className="text-muted-foreground">{entity.gender}</span>
                            </div>
                          )}
                          {modalData.labeledCategories.map(([axis, values]) => (
                            <div key={axis} className="flex gap-2">
                              <span className="shrink-0 text-primary-light/40">{axis}:</span>
                              <span className="text-muted-foreground">{values.join(", ")}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Back face — absolute, mirrors front dimensions */}
              <div
                className="absolute inset-0 flex flex-col rounded-[1.25rem] p-4 sm:p-5"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  pointerEvents: isShowingBack ? "auto" : "none",
                }}
              >
                <div className="mb-4 flex min-h-[24px] items-center">
                  {entity.origin && (
                    <span className="font-display text-xs uppercase tracking-[0.25em] text-primary-light/80">
                      {entity.origin}
                    </span>
                  )}
                  {modalData.badgeLabel && (
                    <span className="ml-auto rounded-full border border-primary-light/30 bg-primary/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-light">
                      {modalData.badgeLabel}
                    </span>
                  )}
                </div>

                <div className="mb-4 text-center">
                  <h3 className="font-display text-2xl font-semibold text-foreground">{entity.name}</h3>
                </div>

                <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border border-primary-light/12 bg-secondary/60">
                  <img
                    src={avatarSrc}
                    alt={entity.name}
                    onError={onAvatarError}
                    loading="lazy"
                    className="h-full w-full object-contain object-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right arrow — flip forward (active when showing front) */}
          <button
            onClick={handleCardToggle}
            aria-label="Virar card"
            className={cn(
              "shrink-0 transition-all duration-300 focus:outline-none",
              !isShowingBack
                ? "text-primary-light/70 drop-shadow-[0_0_10px_hsl(var(--primary-light)/0.5)] hover:text-primary-light"
                : "text-primary-light/15 hover:text-primary-light/35",
            )}
          >
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
              <path
                d="M30 10 C 40 10, 50 15, 50 30 C 50 45, 40 50, 30 50 M 30 50 L 38 42 M 30 50 L 38 58"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default EntityModal;
