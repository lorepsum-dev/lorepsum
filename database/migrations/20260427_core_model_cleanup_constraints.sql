BEGIN;

-- Preserve existing presentation/narrative data by repairing stale lore references.
-- The live database currently has only lores.id = 1, while several metadata rows point to lore_id = 2.
UPDATE category_axes
SET lore_id = 1
WHERE lore_id = 2;

UPDATE symbol_axes
SET lore_id = 1
WHERE lore_id = 2;

UPDATE narratives
SET lore_id = 1
WHERE lore_id = 2;

UPDATE lore_features
SET lore_id = 1
WHERE lore_id = 2;

UPDATE lore_sidebar_groups
SET lore_id = 1
WHERE lore_id = 2;

UPDATE lore_entity_modal_badge_rules
SET lore_id = 1
WHERE lore_id = 2;

UPDATE lore_entity_modal_tag_axes
SET lore_id = 1
WHERE lore_id = 2;

-- Restore relationship graph integrity.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'relationships_source_entity_id_fkey'
          AND conrelid = 'relationships'::regclass
    ) THEN
        ALTER TABLE relationships
        ADD CONSTRAINT relationships_source_entity_id_fkey
        FOREIGN KEY (source_entity_id)
        REFERENCES entities(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'relationships_target_entity_id_fkey'
          AND conrelid = 'relationships'::regclass
    ) THEN
        ALTER TABLE relationships
        ADD CONSTRAINT relationships_target_entity_id_fkey
        FOREIGN KEY (target_entity_id)
        REFERENCES entities(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Restore safe lore_id foreign keys for metadata/presentation tables.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'category_axes_lore_id_fkey'
          AND conrelid = 'category_axes'::regclass
    ) THEN
        ALTER TABLE category_axes
        ADD CONSTRAINT category_axes_lore_id_fkey
        FOREIGN KEY (lore_id)
        REFERENCES lores(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'symbol_axes_lore_id_fkey'
          AND conrelid = 'symbol_axes'::regclass
    ) THEN
        ALTER TABLE symbol_axes
        ADD CONSTRAINT symbol_axes_lore_id_fkey
        FOREIGN KEY (lore_id)
        REFERENCES lores(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'narratives_lore_id_fkey'
          AND conrelid = 'narratives'::regclass
    ) THEN
        ALTER TABLE narratives
        ADD CONSTRAINT narratives_lore_id_fkey
        FOREIGN KEY (lore_id)
        REFERENCES lores(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'lore_features_lore_id_fkey'
          AND conrelid = 'lore_features'::regclass
    ) THEN
        ALTER TABLE lore_features
        ADD CONSTRAINT lore_features_lore_id_fkey
        FOREIGN KEY (lore_id)
        REFERENCES lores(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'lore_sidebar_groups_lore_id_fkey'
          AND conrelid = 'lore_sidebar_groups'::regclass
    ) THEN
        ALTER TABLE lore_sidebar_groups
        ADD CONSTRAINT lore_sidebar_groups_lore_id_fkey
        FOREIGN KEY (lore_id)
        REFERENCES lores(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'lore_entity_modal_badge_rules_lore_id_fkey'
          AND conrelid = 'lore_entity_modal_badge_rules'::regclass
    ) THEN
        ALTER TABLE lore_entity_modal_badge_rules
        ADD CONSTRAINT lore_entity_modal_badge_rules_lore_id_fkey
        FOREIGN KEY (lore_id)
        REFERENCES lores(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'lore_entity_modal_tag_axes_lore_id_fkey'
          AND conrelid = 'lore_entity_modal_tag_axes'::regclass
    ) THEN
        ALTER TABLE lore_entity_modal_tag_axes
        ADD CONSTRAINT lore_entity_modal_tag_axes_lore_id_fkey
        FOREIGN KEY (lore_id)
        REFERENCES lores(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Restore safe entity foreign keys on join/projection tables where existing data is clean.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'entity_categories_entity_id_fkey'
          AND conrelid = 'entity_categories'::regclass
    ) THEN
        ALTER TABLE entity_categories
        ADD CONSTRAINT entity_categories_entity_id_fkey
        FOREIGN KEY (entity_id)
        REFERENCES entities(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'entity_symbols_entity_id_fkey'
          AND conrelid = 'entity_symbols'::regclass
    ) THEN
        ALTER TABLE entity_symbols
        ADD CONSTRAINT entity_symbols_entity_id_fkey
        FOREIGN KEY (entity_id)
        REFERENCES entities(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'entity_groups_entity_id_fkey'
          AND conrelid = 'entity_groups'::regclass
    ) THEN
        ALTER TABLE entity_groups
        ADD CONSTRAINT entity_groups_entity_id_fkey
        FOREIGN KEY (entity_id)
        REFERENCES entities(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'narrative_entities_entity_id_fkey'
          AND conrelid = 'narrative_entities'::regclass
    ) THEN
        ALTER TABLE narrative_entities
        ADD CONSTRAINT narrative_entities_entity_id_fkey
        FOREIGN KEY (entity_id)
        REFERENCES entities(id)
        ON DELETE CASCADE;
    END IF;
END $$;

COMMIT;
