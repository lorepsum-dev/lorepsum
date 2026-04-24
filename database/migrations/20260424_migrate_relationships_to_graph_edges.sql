DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'relationships'
          AND column_name = 'entity_id'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'relationships'
          AND column_name = 'source_entity_id'
    ) THEN
        ALTER TABLE relationships
        RENAME COLUMN entity_id TO source_entity_id;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'relationships'
          AND column_name = 'related_id'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'relationships'
          AND column_name = 'target_entity_id'
    ) THEN
        ALTER TABLE relationships
        RENAME COLUMN related_id TO target_entity_id;
    END IF;
END $$;

ALTER TABLE relationships
ADD COLUMN IF NOT EXISTS relationship_type_id INTEGER;

ALTER TABLE relationships
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE relationships
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE relationships
SET created_at = NOW()
WHERE created_at IS NULL;

UPDATE relationships
SET updated_at = NOW()
WHERE updated_at IS NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'relationships'
          AND column_name = 'type'
    ) THEN
        UPDATE relationships AS relationship
        SET relationship_type_id = relationship_type.id
        FROM relationship_types AS relationship_type
        WHERE relationship_type_id IS NULL
          AND relationship_type.key = CASE relationship.type
              WHEN 'parent' THEN 'parent_of'
              WHEN 'spouse' THEN 'spouse_of'
              ELSE relationship.type
          END;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM relationships
        WHERE relationship_type_id IS NULL
    ) THEN
        RAISE EXCEPTION 'Unable to backfill relationship_type_id for all relationships';
    END IF;
END $$;

WITH spouse_relationship_type AS (
    SELECT id
    FROM relationship_types
    WHERE key = 'spouse_of'
)
UPDATE relationships
SET
    source_entity_id = LEAST(source_entity_id, target_entity_id),
    target_entity_id = GREATEST(source_entity_id, target_entity_id)
WHERE relationship_type_id = (SELECT id FROM spouse_relationship_type)
  AND source_entity_id > target_entity_id;

ALTER TABLE relationships
DROP CONSTRAINT IF EXISTS relationships_unique;

ALTER TABLE relationships
DROP CONSTRAINT IF EXISTS relationships_entity_id_fkey;

ALTER TABLE relationships
DROP CONSTRAINT IF EXISTS relationships_related_id_fkey;

ALTER TABLE relationships
DROP CONSTRAINT IF EXISTS relationships_source_entity_id_fkey;

ALTER TABLE relationships
DROP CONSTRAINT IF EXISTS relationships_target_entity_id_fkey;

ALTER TABLE relationships
DROP CONSTRAINT IF EXISTS relationships_relationship_type_id_fkey;

ALTER TABLE relationships
DROP CONSTRAINT IF EXISTS relationships_source_target_not_same;

ALTER TABLE relationships
ALTER COLUMN source_entity_id SET NOT NULL;

ALTER TABLE relationships
ALTER COLUMN target_entity_id SET NOT NULL;

ALTER TABLE relationships
ALTER COLUMN relationship_type_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
          AND table_name = 'relationships'
          AND constraint_name = 'relationships_source_entity_id_fkey'
    ) THEN
        ALTER TABLE relationships
        ADD CONSTRAINT relationships_source_entity_id_fkey
        FOREIGN KEY (source_entity_id)
        REFERENCES entities(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
          AND table_name = 'relationships'
          AND constraint_name = 'relationships_target_entity_id_fkey'
    ) THEN
        ALTER TABLE relationships
        ADD CONSTRAINT relationships_target_entity_id_fkey
        FOREIGN KEY (target_entity_id)
        REFERENCES entities(id)
        ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
          AND table_name = 'relationships'
          AND constraint_name = 'relationships_relationship_type_id_fkey'
    ) THEN
        ALTER TABLE relationships
        ADD CONSTRAINT relationships_relationship_type_id_fkey
        FOREIGN KEY (relationship_type_id)
        REFERENCES relationship_types(id)
        ON DELETE RESTRICT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
          AND table_name = 'relationships'
          AND constraint_name = 'relationships_source_target_not_same'
    ) THEN
        ALTER TABLE relationships
        ADD CONSTRAINT relationships_source_target_not_same
        CHECK (source_entity_id <> target_entity_id);
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS relationships_source_target_type_key
ON relationships (source_entity_id, target_entity_id, relationship_type_id);

CREATE INDEX IF NOT EXISTS relationships_source_entity_id_idx
ON relationships (source_entity_id);

CREATE INDEX IF NOT EXISTS relationships_target_entity_id_idx
ON relationships (target_entity_id);

CREATE INDEX IF NOT EXISTS relationships_relationship_type_id_idx
ON relationships (relationship_type_id);

ALTER TABLE relationships
DROP COLUMN IF EXISTS type;
