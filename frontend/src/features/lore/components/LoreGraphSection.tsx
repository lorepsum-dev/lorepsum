import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Entity, Relationship } from "../model/types";

interface LoreGraphSectionProps {
  entities: Entity[];
  relationships: Relationship[];
  isLoading: boolean;
  selectedId: number | null;
  onSelectEntity: (id: number) => void;
}

interface GraphNode {
  entity: Entity;
  x: number;
  y: number;
  level: number;
}

interface GraphEdge {
  relationship: Relationship;
  source: GraphNode;
  target: GraphNode;
  path: string;
  labelX: number;
  labelY: number;
  labelAngle: number;
}

const SVG_WIDTH = 1100;
const SVG_HEIGHT = 680;
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2;
const NODE_RADIUS = 8;
const GRAPH_PADDING = 72;
const GRAPH_FIT_PADDING = 96;
const MAX_AUTO_FIT_SCALE = 1.45;
const MAX_VISIBLE_NODES = 40;
const INITIAL_VISIBLE_NODES = 24;
const DEFAULT_ZOOM = 1.1;
const MAX_ENTITY_SEARCH_RESULTS = 12;
const EDGE_LABEL_NODE_CLEARANCE = 52;
const RELATIONSHIP_COLORS = [
  "hsl(43 92% 68%)",
  "hsl(174 58% 57%)",
  "hsl(12 86% 68%)",
  "hsl(214 76% 68%)",
  "hsl(322 65% 70%)",
  "hsl(92 52% 60%)",
  "hsl(265 68% 72%)",
  "hsl(190 78% 62%)",
];

function getPairKey(relationship: Relationship) {
  const [left, right] = [relationship.sourceEntityId, relationship.targetEntityId].sort((a, b) => a - b);
  return `${left}:${right}`;
}

function getEdgeLabel(relationship: Relationship, perspectiveEntityId: number | null) {
  if (relationship.type?.isSymmetric) {
    return relationship.type.forwardLabel || relationship.type.reverseLabel || relationship.type.key || "related";
  }

  if (perspectiveEntityId === relationship.targetEntityId) {
    return relationship.type?.reverseLabel || relationship.type?.forwardLabel || relationship.type?.key || "related";
  }

  return relationship.type?.forwardLabel || relationship.type?.key || "related";
}

function isReversePerspective(relationship: Relationship, perspectiveEntityId: number | null) {
  return Boolean(
    perspectiveEntityId
    && !relationship.type?.isSymmetric
    && relationship.type?.reverseLabel
    && perspectiveEntityId === relationship.targetEntityId,
  );
}

function getRelationshipColor(typeKey: string | undefined) {
  const key = typeKey || "relationship";
  const hash = Array.from(key).reduce((total, character) => total + character.charCodeAt(0), 0);
  return RELATIONSHIP_COLORS[hash % RELATIONSHIP_COLORS.length];
}

function getRelationshipLegendLabel(relationshipType: Relationship["type"]) {
  const forwardLabel = relationshipType.forwardLabel || relationshipType.key;
  const reverseLabel = relationshipType.reverseLabel;

  if (relationshipType.isSymmetric || !reverseLabel || reverseLabel === forwardLabel) {
    return forwardLabel;
  }

  return `${forwardLabel} / ${reverseLabel}`;
}

function getQuadraticPoint(
  source: GraphNode,
  controlX: number,
  controlY: number,
  target: GraphNode,
  t: number,
) {
  const inverseT = 1 - t;

  return {
    x: inverseT * inverseT * source.x + 2 * inverseT * t * controlX + t * t * target.x,
    y: inverseT * inverseT * source.y + 2 * inverseT * t * controlY + t * t * target.y,
  };
}

function getDistanceToClosestNode(x: number, y: number, nodes: GraphNode[]) {
  return Math.min(...nodes.map((node) => Math.hypot(node.x - x, node.y - y)));
}

function getEntityLevels(focusEntityId: number | null, relationships: Relationship[]) {
  const levels = new Map<number, number>();

  if (focusEntityId === null) {
    return levels;
  }

  levels.set(focusEntityId, 0);

  relationships.forEach((relationship) => {
    const isSource = relationship.sourceEntityId === focusEntityId;
    const isTarget = relationship.targetEntityId === focusEntityId;

    if (isSource) {
      levels.set(relationship.targetEntityId, 1);
    }

    if (isTarget) {
      levels.set(relationship.sourceEntityId, 1);
    }
  });

  relationships.forEach((relationship) => {
    const sourceLevel = levels.get(relationship.sourceEntityId);
    const targetLevel = levels.get(relationship.targetEntityId);

    if (sourceLevel === 1 && targetLevel === undefined) {
      levels.set(relationship.targetEntityId, 2);
    }

    if (targetLevel === 1 && sourceLevel === undefined) {
      levels.set(relationship.sourceEntityId, 2);
    }
  });

  return levels;
}

function getConnectedEntityIds(entityId: number, relationships: Relationship[]) {
  const connectedIds = new Set<number>();

  relationships.forEach((relationship) => {
    if (relationship.sourceEntityId === entityId) {
      connectedIds.add(relationship.targetEntityId);
    }

    if (relationship.targetEntityId === entityId) {
      connectedIds.add(relationship.sourceEntityId);
    }
  });

  return connectedIds;
}

function getVisibleEntityIds(
  focusEntityId: number | null,
  expandedEntityIds: Set<number>,
  relationships: Relationship[],
) {
  const visibleIds = new Set<number>();

  if (focusEntityId !== null) {
    visibleIds.add(focusEntityId);
    getConnectedEntityIds(focusEntityId, relationships).forEach((entityId) => visibleIds.add(entityId));
  }

  expandedEntityIds.forEach((entityId) => {
    visibleIds.add(entityId);
    getConnectedEntityIds(entityId, relationships).forEach((connectedEntityId) => visibleIds.add(connectedEntityId));
  });

  return visibleIds;
}

function getInitialEntityIds(entities: Entity[], relationships: Relationship[]) {
  const degreeByEntityId = new Map<number, number>();

  relationships.forEach((relationship) => {
    degreeByEntityId.set(relationship.sourceEntityId, (degreeByEntityId.get(relationship.sourceEntityId) ?? 0) + 1);
    degreeByEntityId.set(relationship.targetEntityId, (degreeByEntityId.get(relationship.targetEntityId) ?? 0) + 1);
  });

  return new Set(
    entities
      .slice()
      .sort((left, right) => {
        const degreeDelta = (degreeByEntityId.get(right.id) ?? 0) - (degreeByEntityId.get(left.id) ?? 0);
        return degreeDelta || left.name.localeCompare(right.name);
      })
      .slice(0, INITIAL_VISIBLE_NODES)
      .map((entity) => entity.id),
  );
}

function buildGraph(
  entities: Entity[],
  relationships: Relationship[],
  entityLevels: Map<number, number>,
) {
  const entitiesByLevel = entities
    .slice()
    .sort((left, right) => {
      const levelDelta = (entityLevels.get(left.id) ?? 2) - (entityLevels.get(right.id) ?? 2);
      return levelDelta || left.name.localeCompare(right.name);
    })
    .reduce((groups, entity) => {
      const level = entityLevels.get(entity.id) ?? 2;
      const current = groups.get(level) ?? [];
      current.push(entity);
      groups.set(level, current);
      return groups;
    }, new Map<number, Entity[]>());

  const maxRadius = Math.min(SVG_WIDTH, SVG_HEIGHT) / 2 - GRAPH_PADDING;
  const levelRadii = new Map([
    [0, 0],
    [1, maxRadius * 0.55],
    [2, maxRadius * 0.95],
  ]);
  const nodes = Array.from(entitiesByLevel.entries()).flatMap(([level, levelEntities]) => {
    const radius = levelRadii.get(level) ?? maxRadius;

    if (level === 0) {
      return levelEntities.map((entity): GraphNode => ({
        entity,
        level,
        x: CENTER_X,
        y: CENTER_Y,
      }));
    }

    return levelEntities.map((entity, index): GraphNode => {
      const nodeCount = Math.max(levelEntities.length, 1);
      const angleOffset = level === 1 ? -Math.PI / 2 : -Math.PI / 2 + Math.PI / Math.max(nodeCount, 2);
      const angle = (index / nodeCount) * Math.PI * 2 + angleOffset;
      const stagger = level === 1 ? (index % 2) * 18 : (index % 3) * 14;

      return {
        entity,
        level,
        x: CENTER_X + Math.cos(angle) * (radius + stagger),
        y: CENTER_Y + Math.sin(angle) * (radius + stagger),
      };
    });
  });

  const nodesById = new Map(nodes.map((node) => [node.entity.id, node]));
  const pairCounts = new Map<string, number>();

  relationships.forEach((relationship) => {
    const pairKey = getPairKey(relationship);
    pairCounts.set(pairKey, (pairCounts.get(pairKey) ?? 0) + 1);
  });

  const pairIndexes = new Map<string, number>();
  const edges = relationships
    .map((relationship): GraphEdge | null => {
      const source = nodesById.get(relationship.sourceEntityId);
      const target = nodesById.get(relationship.targetEntityId);

      if (!source || !target) {
        return null;
      }

      const pairKey = getPairKey(relationship);
      const pairCount = pairCounts.get(pairKey) ?? 1;
      const pairIndex = pairIndexes.get(pairKey) ?? 0;
      pairIndexes.set(pairKey, pairIndex + 1);

      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.hypot(dx, dy) || 1;
      const normalX = -dy / distance;
      const normalY = dx / distance;
      const offset = (pairIndex - (pairCount - 1) / 2) * 34;
      const controlX = midX + normalX * offset;
      const controlY = midY + normalY * offset;
      const rawAngle = Math.atan2(dy, dx) * 180 / Math.PI;
      const labelAngle = rawAngle > 90 || rawAngle < -90 ? rawAngle + 180 : rawAngle;
      const labelOffset = offset >= 0 ? 12 : -12;
      const labelCandidates = [0.32, 0.68].map((position) => {
        const point = getQuadraticPoint(source, controlX, controlY, target, position);
        const x = point.x + normalX * labelOffset;
        const y = point.y + normalY * labelOffset;

        return {
          x,
          y,
          distanceToClosestNode: getDistanceToClosestNode(x, y, nodes),
        };
      });
      const bestCandidate = labelCandidates.sort((left, right) => right.distanceToClosestNode - left.distanceToClosestNode)[0];
      const needsExtraOffset = bestCandidate.distanceToClosestNode < EDGE_LABEL_NODE_CLEARANCE;
      const extraOffset = needsExtraOffset ? EDGE_LABEL_NODE_CLEARANCE - bestCandidate.distanceToClosestNode + 10 : 0;

      return {
        relationship,
        source,
        target,
        path: `M ${source.x} ${source.y} Q ${controlX} ${controlY} ${target.x} ${target.y}`,
        labelX: bestCandidate.x + normalX * extraOffset,
        labelY: bestCandidate.y + normalY * extraOffset,
        labelAngle,
      };
    })
    .filter((edge): edge is GraphEdge => edge !== null);

  return { nodes, edges };
}

function getGraphFitTransform(nodes: GraphNode[]) {
  if (nodes.length === 0) {
    return "";
  }

  const minX = Math.min(...nodes.map((node) => node.x));
  const maxX = Math.max(...nodes.map((node) => node.x));
  const minY = Math.min(...nodes.map((node) => node.y));
  const maxY = Math.max(...nodes.map((node) => node.y));
  const width = Math.max(maxX - minX, NODE_RADIUS * 8);
  const height = Math.max(maxY - minY, NODE_RADIUS * 8);
  const availableWidth = SVG_WIDTH - GRAPH_FIT_PADDING * 2;
  const availableHeight = SVG_HEIGHT - GRAPH_FIT_PADDING * 2;
  const scale = Math.min(MAX_AUTO_FIT_SCALE, availableWidth / width, availableHeight / height);
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;

  return `translate(${CENTER_X} ${CENTER_Y}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function LoreGraphSection({
  entities,
  relationships,
  isLoading,
  selectedId,
  onSelectEntity,
}: LoreGraphSectionProps) {
  const [relationshipTypeFilter, setRelationshipTypeFilter] = useState("all");
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [focusEntityId, setFocusEntityId] = useState<number | null>(null);
  const [expandedEntityIds, setExpandedEntityIds] = useState<Set<number>>(() => new Set());
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<number | null>(null);
  const [entitySearch, setEntitySearch] = useState("");
  const [isEntitySearchOpen, setIsEntitySearchOpen] = useState(false);
  const graphScrollRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const didPanRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const relationshipTypes = useMemo(() => (
    Array.from(
      new Map(relationships.map((relationship) => [relationship.type.key, relationship.type])).values(),
    ).sort((left, right) => left.forwardLabel.localeCompare(right.forwardLabel))
  ), [relationships]);
  const visibleRelationships = useMemo(() => (
    relationshipTypeFilter === "all"
      ? relationships
      : relationships.filter((relationship) => relationship.type.key === relationshipTypeFilter)
  ), [relationshipTypeFilter, relationships]);
  const activeFocusEntityId = focusEntityId ?? selectedId ?? null;
  const entityLevels = useMemo(
    () => getEntityLevels(activeFocusEntityId, visibleRelationships),
    [activeFocusEntityId, visibleRelationships],
  );
  const visibleEntityIds = useMemo(
    () => {
      const exploredEntityIds = getVisibleEntityIds(activeFocusEntityId, expandedEntityIds, visibleRelationships);

      if (exploredEntityIds.size > 0) {
        return exploredEntityIds;
      }

      return getInitialEntityIds(entities, visibleRelationships);
    },
    [activeFocusEntityId, entities, expandedEntityIds, visibleRelationships],
  );
  const visibleEntities = useMemo(() => (
    entities
      .filter((entity) => visibleEntityIds.has(entity.id))
      .slice(0, MAX_VISIBLE_NODES)
  ), [entities, visibleEntityIds]);
  const cappedVisibleEntityIds = useMemo(() => new Set(visibleEntities.map((entity) => entity.id)), [visibleEntities]);
  const graphRelationships = useMemo(() => (
    visibleRelationships.filter((relationship) => (
      cappedVisibleEntityIds.has(relationship.sourceEntityId)
      && cappedVisibleEntityIds.has(relationship.targetEntityId)
    ))
  ), [cappedVisibleEntityIds, visibleRelationships]);
  const graph = useMemo(
    () => buildGraph(visibleEntities, graphRelationships, entityLevels),
    [entityLevels, graphRelationships, visibleEntities],
  );
  const graphFitTransform = useMemo(() => getGraphFitTransform(graph.nodes), [graph.nodes]);
  const selectedNode = selectedId ? graph.nodes.find((node) => node.entity.id === selectedId) : null;
  const visibleNodeCount = graph.nodes.length;
  const hiddenNodeCount = Math.max(0, visibleEntityIds.size - visibleNodeCount);
  const sortedEntities = useMemo(
    () => entities.slice().sort((left, right) => left.name.localeCompare(right.name)),
    [entities],
  );
  const filteredEntityOptions = useMemo(() => {
    const normalizedSearch = entitySearch.trim().toLowerCase();
    const options = normalizedSearch
      ? sortedEntities.filter((entity) => entity.name.toLowerCase().includes(normalizedSearch))
      : sortedEntities;

    return options.slice(0, MAX_ENTITY_SEARCH_RESULTS);
  }, [entitySearch, sortedEntities]);

  useEffect(() => {
    if (selectedId) {
      setFocusEntityId(selectedId);
      setEntitySearch(entities.find((entity) => entity.id === selectedId)?.name ?? "");
    }
  }, [entities, selectedId]);

  useEffect(() => {
    const element = graphScrollRef.current;

    if (!element) {
      return;
    }

    window.requestAnimationFrame(() => {
      element.scrollLeft = Math.max(0, (element.scrollWidth - element.clientWidth) / 2);
      element.scrollTop = Math.max(0, (element.scrollHeight - element.clientHeight) / 2);
    });
  }, [activeFocusEntityId, relationshipTypeFilter, visibleNodeCount, zoom]);

  const handleNodeSelect = (entityId: number) => {
    if (didPanRef.current) {
      return;
    }

    setFocusEntityId(entityId);
    setExpandedEntityIds((current) => {
      const next = new Set(current);

      if (next.has(entityId)) {
        next.delete(entityId);
      } else {
        next.add(entityId);
      }

      return next;
    });
  };

  const handleNodeDetails = (entityId: number) => {
    if (didPanRef.current) {
      return;
    }

    onSelectEntity(entityId);
  };

  const focusEntity = (entityId: number) => {
    setFocusEntityId(entityId);
    setExpandedEntityIds(new Set([entityId]));
    setEntitySearch(entities.find((entity) => entity.id === entityId)?.name ?? "");
    setIsEntitySearchOpen(false);
  };

  const focusSearchResult = () => {
    const normalizedSearch = entitySearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return;
    }

    const matchingEntity = sortedEntities.find((entity) => entity.name.toLowerCase() === normalizedSearch)
      ?? sortedEntities.find((entity) => entity.name.toLowerCase().includes(normalizedSearch));

    if (matchingEntity) {
      focusEntity(matchingEntity.id);
    }
  };

  const handleGraphMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !graphScrollRef.current) {
      return;
    }

    isPanningRef.current = true;
    didPanRef.current = false;
    panStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: graphScrollRef.current.scrollLeft,
      scrollTop: graphScrollRef.current.scrollTop,
    };
  };

  const handleGraphMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isPanningRef.current || !graphScrollRef.current) {
      return;
    }

    const deltaX = event.clientX - panStartRef.current.x;
    const deltaY = event.clientY - panStartRef.current.y;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      didPanRef.current = true;
    }

    graphScrollRef.current.scrollLeft = panStartRef.current.scrollLeft - deltaX;
    graphScrollRef.current.scrollTop = panStartRef.current.scrollTop - deltaY;
  };

  const stopGraphPan = () => {
    isPanningRef.current = false;
    window.setTimeout(() => {
      didPanRef.current = false;
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full max-w-5xl flex-col gap-4">
        <Skeleton className="h-10 w-52 rounded-lg" />
        <Skeleton className="min-h-0 flex-1 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full max-w-6xl min-h-0 flex-col gap-3 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-light/10 bg-secondary/30 px-3 py-2">
        <div className="flex flex-col gap-0.5">
          <div className="font-mono text-xs text-muted-foreground">
            Click to explore. Double-click to view details.
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-light/30">
            {visibleNodeCount} visible nodes / {graphRelationships.length} edges
            {hiddenNodeCount > 0 ? ` / ${hiddenNodeCount} hidden` : ""}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <input
                value={entitySearch}
                onChange={(event) => {
                  setEntitySearch(event.target.value);
                  setIsEntitySearchOpen(true);
                }}
                onFocus={() => setIsEntitySearchOpen(true)}
                onBlur={() => window.setTimeout(() => setIsEntitySearchOpen(false), 120)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    focusSearchResult();
                  }
                }}
                placeholder="Search entity"
                className="w-44 rounded-lg border border-primary-light/15 bg-background/70 py-1.5 pl-3 pr-8 font-mono text-xs text-muted-foreground outline-none transition placeholder:text-muted-foreground/35 focus:border-primary-light/50"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>

              {isEntitySearchOpen && filteredEntityOptions.length > 0 && (
                <div className="tree-scroll absolute left-0 top-[calc(100%+0.35rem)] z-30 max-h-52 w-64 overflow-y-auto rounded-lg border border-primary-light/15 bg-background/95 py-1 shadow-xl shadow-background/40 backdrop-blur">
                  {filteredEntityOptions.map((entity) => (
                    <button
                      key={entity.id}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        focusEntity(entity.id);
                      }}
                      className="block w-full px-3 py-2 text-left font-mono text-xs text-muted-foreground transition hover:bg-primary-light/10 hover:text-primary-light"
                    >
                      {entity.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={focusSearchResult}
              className="rounded-lg border border-primary-light/15 px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-primary-light/40 hover:text-primary-light"
            >
              Focus
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setFocusEntityId(null);
              setExpandedEntityIds(new Set());
              setEntitySearch("");
            }}
            className="rounded-lg border border-primary-light/15 px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-primary-light/40 hover:text-primary-light"
          >
            Reset
          </button>
          <div className="relative">
            <select
              value={relationshipTypeFilter}
              onChange={(event) => setRelationshipTypeFilter(event.target.value)}
              className="appearance-none rounded-lg border border-primary-light/15 bg-background/70 py-1.5 pl-3 pr-8 font-mono text-xs text-muted-foreground outline-none transition focus:border-primary-light/50"
              aria-label="Filter relationship type"
            >
              <option value="all">All relationships</option>
              {relationshipTypes.map((relationshipType) => (
                <option key={relationshipType.key} value={relationshipType.key}>
                  {getRelationshipLegendLabel(relationshipType)}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          <button
            type="button"
            onClick={() => setZoom((current) => Math.max(0.6, Number((current - 0.15).toFixed(2))))}
            className="rounded-lg border border-primary-light/15 px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-primary-light/40 hover:text-primary-light"
          >
            -
          </button>
          <button
            type="button"
            onClick={() => setZoom(DEFAULT_ZOOM)}
            className="rounded-lg border border-primary-light/15 px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-primary-light/40 hover:text-primary-light"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => setZoom((current) => Math.min(1.8, Number((current + 0.15).toFixed(2))))}
            className="rounded-lg border border-primary-light/15 px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-primary-light/40 hover:text-primary-light"
          >
            +
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-primary-light/10 bg-[radial-gradient(circle_at_center,hsl(var(--primary-light)/0.08),transparent_58%)]">
        <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div
            ref={graphScrollRef}
            className={cn(
              "tree-scroll min-h-0 overflow-auto select-none",
              isPanningRef.current ? "cursor-grabbing" : "cursor-grab",
            )}
            onMouseDown={handleGraphMouseDown}
            onMouseMove={handleGraphMouseMove}
            onMouseUp={stopGraphPan}
            onMouseLeave={stopGraphPan}
          >
            <svg
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="block"
              style={{
                width: `${SVG_WIDTH * zoom}px`,
                height: `${SVG_HEIGHT * zoom}px`,
                minWidth: "100%",
                minHeight: "100%",
              }}
              role="img"
              aria-label="Lore relationship graph"
            >
              <g transform={graphFitTransform}>
                {graph.edges.map((edge) => (
                  <g
                    key={edge.relationship.id}
                    onMouseEnter={() => setHoveredEdgeId(edge.relationship.id)}
                    onMouseLeave={() => setHoveredEdgeId((current) => (current === edge.relationship.id ? null : current))}
                  >
                    <path
                      d={edge.path}
                      fill="none"
                      stroke={getRelationshipColor(edge.relationship.type?.key)}
                      strokeOpacity={
                        edge.relationship.sourceEntityId === activeFocusEntityId
                        || edge.relationship.targetEntityId === activeFocusEntityId
                        || hoveredEdgeId === edge.relationship.id
                          ? 0.72
                          : 0.26
                      }
                      strokeWidth={hoveredEdgeId === edge.relationship.id ? 2.4 : 1.5}
                      strokeLinecap="round"
                      strokeDasharray={isReversePerspective(edge.relationship, activeFocusEntityId) ? "6 5" : undefined}
                    />
                    <text
                      x={edge.labelX}
                      y={edge.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${edge.labelAngle} ${edge.labelX} ${edge.labelY})`}
                      className={cn(
                        "pointer-events-none fill-muted-foreground/75 font-mono text-[9px] opacity-0 transition-opacity",
                        hoveredEdgeId === edge.relationship.id && "opacity-65",
                      )}
                    >
                      {getEdgeLabel(edge.relationship, activeFocusEntityId)}
                    </text>
                  </g>
                ))}

                {graph.nodes.map((node) => {
                  const isSelected = selectedId === node.entity.id;
                  const isFocused = activeFocusEntityId === node.entity.id;
                  const isHovered = hoveredNodeId === node.entity.id;
                  const isConnectedToSelected = selectedNode
                    ? visibleRelationships.some((relationship) => (
                      (relationship.sourceEntityId === selectedNode.entity.id && relationship.targetEntityId === node.entity.id)
                      || (relationship.targetEntityId === selectedNode.entity.id && relationship.sourceEntityId === node.entity.id)
                    ))
                    : false;

                  const isLevelOne = node.level === 1;
                  const isMuted = node.level >= 2 && !isSelected && !isFocused && !isHovered;
                  const nodeRadius = isFocused ? NODE_RADIUS + 8 : isSelected ? NODE_RADIUS + 5 : isLevelOne ? NODE_RADIUS + 2 : NODE_RADIUS;
                  const nodeColor = isFocused
                    ? "hsl(var(--primary-light))"
                    : isLevelOne
                      ? "hsl(var(--primary-light) / 0.68)"
                      : "hsl(var(--background))";
                  const nodeOpacity = isMuted ? 0.46 : 1;

                  return (
                    <g
                      key={node.entity.id}
                      transform={`translate(${node.x} ${node.y})`}
                      role="button"
                      tabIndex={0}
                      data-graph-node="true"
                      onClick={() => handleNodeSelect(node.entity.id)}
                      onDoubleClick={(event) => {
                        event.stopPropagation();
                        handleNodeDetails(node.entity.id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleNodeSelect(node.entity.id);
                        }
                      }}
                      onMouseEnter={() => setHoveredNodeId(node.entity.id)}
                      onMouseLeave={() => setHoveredNodeId((current) => (current === node.entity.id ? null : current))}
                      className="cursor-pointer focus:outline-none"
                    >
                      {isFocused && (
                        <circle
                          r={nodeRadius + 10}
                          fill="hsl(var(--primary-light) / 0.12)"
                          className="pointer-events-none"
                        />
                      )}
                      <circle
                        r={nodeRadius}
                        fill={nodeColor}
                        opacity={nodeOpacity}
                        className={cn(
                          "transition-all",
                          isSelected
                            ? "stroke-primary-light"
                            : isConnectedToSelected
                              ? "stroke-primary-light/80"
                              : "stroke-primary-light/45 hover:stroke-primary-light/80",
                        )}
                        strokeWidth={isFocused ? 3 : 2}
                      />
                      <text
                        x="0"
                        y={nodeRadius + 16}
                        textAnchor="middle"
                        className={cn(
                          "pointer-events-none fill-muted-foreground font-mono text-[10px] opacity-0 transition-all",
                          (isFocused || isHovered || isLevelOne || isSelected) && "opacity-100",
                          (isFocused || isSelected) && "fill-primary-light",
                          isMuted && "fill-muted-foreground/45",
                        )}
                      >
                        {node.entity.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          <aside className="tree-scroll min-h-0 overflow-y-auto border-t border-primary-light/10 bg-background/35 p-4 lg:border-l lg:border-t-0">
            <div className="mb-5">
              <h3 className="font-display text-xs uppercase tracking-[0.35em] text-primary-light/60">
                Legend
              </h3>
              <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted-foreground/55">
                Colors identify relationship types. Node strength shows exploration state.
              </p>
            </div>

            <div className="mb-5">
              <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
                Entities
              </h4>
              <div className="flex flex-col gap-2 font-mono text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-primary-light bg-primary-light shadow-[0_0_14px_hsl(var(--primary-light)/0.4)]" />
                  Focused entity
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-light bg-primary-light/80" />
                  Expanded entity
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-primary-light/70 bg-primary-light/60" />
                  Related entity
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-primary-light/80 bg-primary-light/30" />
                  Hovered entity
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
                Relationships
              </h4>
              <div className="flex flex-col gap-2">
                {relationshipTypes.map((relationshipType) => {
                  const color = getRelationshipColor(relationshipType.key);
                  const forwardLabel = relationshipType.forwardLabel || relationshipType.key;
                  const reverseLabel = relationshipType.reverseLabel;
                  const showReverse = !relationshipType.isSymmetric && reverseLabel && reverseLabel !== forwardLabel;

                  return (
                    <div key={relationshipType.key} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                        <span
                          className="h-px w-8 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span>{forwardLabel}</span>
                      </div>
                      {showReverse && (
                        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground/75">
                          <svg width="32" height="2" viewBox="0 0 32 2" aria-hidden="true">
                            <line
                              x1="0"
                              y1="1"
                              x2="32"
                              y2="1"
                              stroke={color}
                              strokeWidth="1.5"
                              strokeDasharray="6 5"
                            />
                          </svg>
                          <span>{reverseLabel}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default LoreGraphSection;
