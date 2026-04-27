BEGIN;

INSERT INTO features (name, description)
VALUES ('Graph', 'Explore all entity relationships as a network.')
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description;

WITH graph_candidates AS (
    SELECT id
    FROM features
    WHERE lower(name) = 'graph'
       OR name = 'relationship-graph'
),
canonical_graph AS (
    SELECT MIN(id) AS id
    FROM graph_candidates
),
duplicate_graphs AS (
    SELECT graph_candidates.id
    FROM graph_candidates
    CROSS JOIN canonical_graph
    WHERE graph_candidates.id <> canonical_graph.id
)
UPDATE lore_features lf
SET feature_id = (SELECT id FROM canonical_graph)
WHERE lf.feature_id IN (SELECT id FROM duplicate_graphs)
  AND NOT EXISTS (
      SELECT 1
      FROM lore_features existing_feature
      WHERE existing_feature.lore_id = lf.lore_id
        AND existing_feature.feature_id = (SELECT id FROM canonical_graph)
  );

WITH graph_candidates AS (
    SELECT id
    FROM features
    WHERE lower(name) = 'graph'
       OR name = 'relationship-graph'
),
canonical_graph AS (
    SELECT MIN(id) AS id
    FROM graph_candidates
),
duplicate_graphs AS (
    SELECT graph_candidates.id
    FROM graph_candidates
    CROSS JOIN canonical_graph
    WHERE graph_candidates.id <> canonical_graph.id
)
DELETE FROM lore_features lf
WHERE lf.feature_id IN (SELECT id FROM duplicate_graphs)
  AND EXISTS (
      SELECT 1
      FROM lore_features existing_feature
      WHERE existing_feature.lore_id = lf.lore_id
        AND existing_feature.feature_id = (SELECT id FROM canonical_graph)
  );

WITH graph_candidates AS (
    SELECT id
    FROM features
    WHERE lower(name) = 'graph'
       OR name = 'relationship-graph'
),
canonical_graph AS (
    SELECT MIN(id) AS id
    FROM graph_candidates
),
duplicate_graphs AS (
    SELECT graph_candidates.id
    FROM graph_candidates
    CROSS JOIN canonical_graph
    WHERE graph_candidates.id <> canonical_graph.id
)
DELETE FROM features
WHERE id IN (SELECT id FROM duplicate_graphs);

WITH graph_candidates AS (
    SELECT id
    FROM features
    WHERE lower(name) = 'graph'
       OR name = 'relationship-graph'
),
canonical_graph AS (
    SELECT MIN(id) AS id
    FROM graph_candidates
)
UPDATE features
SET
    name = 'Graph',
    description = 'Explore all entity relationships as a network.'
WHERE id = (SELECT id FROM canonical_graph);

WITH graph_feature AS (
    SELECT id
    FROM features
    WHERE name = 'Graph'
),
target_lores AS (
    SELECT DISTINCT lore_id
    FROM lore_features
)
INSERT INTO lore_features (lore_id, feature_id, display_order)
SELECT
    target_lores.lore_id,
    graph_feature.id,
    2
FROM target_lores
CROSS JOIN graph_feature
ON CONFLICT (lore_id, feature_id) DO UPDATE
SET display_order = EXCLUDED.display_order;

WITH ordered_features AS (
    SELECT
        lf.lore_id,
        lf.feature_id,
        CASE lower(f.name)
            WHEN 'cards' THEN 1
            WHEN 'graph' THEN 2
            WHEN 'narratives' THEN 3
            WHEN 'tree' THEN 4
            ELSE lf.display_order
        END AS next_display_order
    FROM lore_features lf
    INNER JOIN features f
        ON f.id = lf.feature_id
    WHERE lower(f.name) IN ('cards', 'graph', 'narratives', 'tree')
)
UPDATE lore_features lf
SET display_order = ordered_features.next_display_order
FROM ordered_features
WHERE lf.lore_id = ordered_features.lore_id
  AND lf.feature_id = ordered_features.feature_id
  AND lf.display_order <> ordered_features.next_display_order;

COMMIT;
