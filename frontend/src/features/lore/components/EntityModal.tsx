import { getRelationLabel, mapEntityModal } from "../model/mapEntityModal";
import type { Entity, LorePresentation, Relationship } from "../model/types";

interface EntityModalProps {
  entity: Entity;
  entities: Entity[];
  relationships: Relationship[];
  presentation: LorePresentation;
  onClose: () => void;
}

function EntityModal({
  entity,
  entities,
  relationships,
  presentation,
  onClose,
}: EntityModalProps) {
  const modalData = mapEntityModal(entity, relationships, entities, presentation);

  return (
    <>
      <div
        className="fixed inset-0 z-40 animate-in fade-in bg-background/60 backdrop-blur-sm duration-200"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[min(24rem,92vw)] -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 px-4 duration-300">
        <button
          onClick={onClose}
          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-primary-light/15 bg-secondary/80 text-3xl leading-none text-muted-foreground/60 transition hover:border-primary-light/40 hover:text-primary-light"
        >
          ×
        </button>

        <div
          className="card-glow relative flex max-h-[88vh] flex-col rounded-[1.25rem] border border-primary-light/10 p-4 sm:p-5"
          style={{ background: "var(--gradient-card)" }}
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

          <div className="relative mx-auto mb-4 aspect-square max-h-[28vh] w-full overflow-hidden rounded-xl border border-primary-light/12 bg-secondary/60 sm:max-h-[32vh]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-glow/20 via-transparent to-accent/20" />
            {entity.avatarUrl ? (
              <img src={entity.avatarUrl} alt={entity.name} className="h-full w-full object-cover object-top" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-6xl text-gradient-purple">{modalData.initials}</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary-glow)/0.12),transparent_60%)]" />
          </div>

          <div className="mb-4 text-center">
            <h3 className="font-display text-2xl font-semibold text-foreground">{entity.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entity.description}</p>
          </div>

          {modalData.parents.length > 0 && (
            <div className="mb-3 text-center font-mono text-xs text-primary-light/40">
              born of {modalData.parents.map((parent) => parent.name).join(" · ")}
            </div>
          )}

          {modalData.relatedEntities.length > 0 && (
            <div className="mb-3 flex flex-wrap justify-center gap-1.5">
              {modalData.relatedEntities.map((relationship) => (
                <span
                  key={`${relationship.kind}-${relationship.entity.id}`}
                  className="rounded-full border border-primary-light/15 px-2.5 py-0.5 text-[10px] font-mono text-primary-light/50"
                >
                  {getRelationLabel(relationship.kind)}: {relationship.entity.name}
                </span>
              ))}
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
    </>
  );
}

export default EntityModal;
