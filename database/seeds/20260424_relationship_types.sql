INSERT INTO relationship_types (
    key,
    family_key,
    forward_label,
    reverse_label,
    is_symmetric,
    is_hierarchical
)
VALUES
    ('parent_of', 'kinship', 'Parent of', 'Child of', FALSE, TRUE),
    ('spouse_of', 'kinship', 'Spouse of', 'Spouse of', TRUE, FALSE)
ON CONFLICT (key) DO UPDATE
SET
    family_key = EXCLUDED.family_key,
    forward_label = EXCLUDED.forward_label,
    reverse_label = EXCLUDED.reverse_label,
    is_symmetric = EXCLUDED.is_symmetric,
    is_hierarchical = EXCLUDED.is_hierarchical,
    updated_at = NOW();
