BEGIN;

SELECT setval(
    pg_get_serial_sequence('features', 'id'),
    COALESCE((SELECT MAX(id) FROM features), 1),
    true
);

INSERT INTO features (name, description)
VALUES ('relationship-graph', 'Explore all entity relationships as a network.')
ON CONFLICT (name) DO NOTHING;

WITH graph_feature AS (
    SELECT id
    FROM features
    WHERE name = 'relationship-graph'
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
        CASE f.name
            WHEN 'cards' THEN 1
            WHEN 'relationship-graph' THEN 2
            WHEN 'narratives' THEN 3
            WHEN 'tree' THEN 4
            ELSE lf.display_order
        END AS next_display_order
    FROM lore_features lf
    INNER JOIN features f
        ON f.id = lf.feature_id
    WHERE f.name IN ('cards', 'relationship-graph', 'narratives', 'tree')
)
UPDATE lore_features lf
SET display_order = ordered_features.next_display_order
FROM ordered_features
WHERE lf.lore_id = ordered_features.lore_id
  AND lf.feature_id = ordered_features.feature_id
  AND lf.display_order <> ordered_features.next_display_order;

COMMIT;
