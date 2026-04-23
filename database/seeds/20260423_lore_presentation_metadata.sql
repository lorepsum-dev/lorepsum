INSERT INTO lore_sidebar_groups (lore_id, label, category_id, display_order)
SELECT lore.id, 'Primordiais', category_value.id, 1
FROM lores AS lore
INNER JOIN category_axes AS axis
    ON axis.lore_id = lore.id
   AND axis.name = 'lineage'
INNER JOIN categories AS category_value
    ON category_value.axis_id = axis.id
   AND category_value.name = 'primordial'
WHERE lore.slug = 'mythologies'
  AND NOT EXISTS (
      SELECT 1
      FROM lore_sidebar_groups AS existing_group
      WHERE existing_group.lore_id = lore.id
        AND existing_group.category_id = category_value.id
  );

INSERT INTO lore_sidebar_groups (lore_id, label, category_id, display_order)
SELECT lore.id, 'Titans', category_value.id, 2
FROM lores AS lore
INNER JOIN category_axes AS axis
    ON axis.lore_id = lore.id
   AND axis.name = 'lineage'
INNER JOIN categories AS category_value
    ON category_value.axis_id = axis.id
   AND category_value.name = 'titan'
WHERE lore.slug = 'mythologies'
  AND NOT EXISTS (
      SELECT 1
      FROM lore_sidebar_groups AS existing_group
      WHERE existing_group.lore_id = lore.id
        AND existing_group.category_id = category_value.id
  );

INSERT INTO lore_sidebar_groups (lore_id, label, category_id, display_order)
SELECT lore.id, 'Olympians', category_value.id, 3
FROM lores AS lore
INNER JOIN category_axes AS axis
    ON axis.lore_id = lore.id
   AND axis.name = 'habitat'
INNER JOIN categories AS category_value
    ON category_value.axis_id = axis.id
   AND category_value.name = 'olympus'
WHERE lore.slug = 'mythologies'
  AND NOT EXISTS (
      SELECT 1
      FROM lore_sidebar_groups AS existing_group
      WHERE existing_group.lore_id = lore.id
        AND existing_group.category_id = category_value.id
  );

INSERT INTO lore_entity_modal_badge_rules (lore_id, category_id, label, display_order)
SELECT lore.id, category_value.id, 'Olympian', 1
FROM lores AS lore
INNER JOIN category_axes AS axis
    ON axis.lore_id = lore.id
   AND axis.name = 'habitat'
INNER JOIN categories AS category_value
    ON category_value.axis_id = axis.id
   AND category_value.name = 'olympus'
WHERE lore.slug = 'mythologies'
  AND NOT EXISTS (
      SELECT 1
      FROM lore_entity_modal_badge_rules AS existing_rule
      WHERE existing_rule.lore_id = lore.id
        AND existing_rule.category_id = category_value.id
        AND existing_rule.label = 'Olympian'
  );

INSERT INTO lore_entity_modal_badge_rules (lore_id, category_id, label, display_order)
SELECT lore.id, category_value.id, 'Titan', 2
FROM lores AS lore
INNER JOIN category_axes AS axis
    ON axis.lore_id = lore.id
   AND axis.name = 'lineage'
INNER JOIN categories AS category_value
    ON category_value.axis_id = axis.id
   AND category_value.name = 'titan'
WHERE lore.slug = 'mythologies'
  AND NOT EXISTS (
      SELECT 1
      FROM lore_entity_modal_badge_rules AS existing_rule
      WHERE existing_rule.lore_id = lore.id
        AND existing_rule.category_id = category_value.id
        AND existing_rule.label = 'Titan'
  );

INSERT INTO lore_entity_modal_badge_rules (lore_id, category_id, label, display_order)
SELECT lore.id, category_value.id, 'Primordial', 3
FROM lores AS lore
INNER JOIN category_axes AS axis
    ON axis.lore_id = lore.id
   AND axis.name = 'lineage'
INNER JOIN categories AS category_value
    ON category_value.axis_id = axis.id
   AND category_value.name = 'primordial'
WHERE lore.slug = 'mythologies'
  AND NOT EXISTS (
      SELECT 1
      FROM lore_entity_modal_badge_rules AS existing_rule
      WHERE existing_rule.lore_id = lore.id
        AND existing_rule.category_id = category_value.id
        AND existing_rule.label = 'Primordial'
  );

INSERT INTO lore_entity_modal_tag_axes (lore_id, axis_id, display_order)
SELECT lore.id, axis.id, 1
FROM lores AS lore
INNER JOIN category_axes AS axis
    ON axis.lore_id = lore.id
   AND axis.name = 'domain'
WHERE lore.slug = 'mythologies'
  AND NOT EXISTS (
      SELECT 1
      FROM lore_entity_modal_tag_axes AS existing_axis
      WHERE existing_axis.lore_id = lore.id
        AND existing_axis.axis_id = axis.id
  );

INSERT INTO lore_entity_modal_tag_axes (lore_id, axis_id, display_order)
SELECT lore.id, axis.id, 2
FROM lores AS lore
INNER JOIN category_axes AS axis
    ON axis.lore_id = lore.id
   AND axis.name = 'role'
WHERE lore.slug = 'mythologies'
  AND NOT EXISTS (
      SELECT 1
      FROM lore_entity_modal_tag_axes AS existing_axis
      WHERE existing_axis.lore_id = lore.id
        AND existing_axis.axis_id = axis.id
  );
