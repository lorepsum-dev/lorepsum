const SetSchema = require('../../../config/db');
const pool = SetSchema('public');

const relationshipsRepository = {
    async findAllByLoreSlug(slug) {
        const { rows } = await pool.query(`
            SELECT
                r.id,
                r.source_entity_id,
                r.target_entity_id,
                rt.id AS relationship_type_id,
                rt.key AS relationship_type_key,
                rt.family_key AS relationship_family_key,
                rt.forward_label AS relationship_forward_label,
                rt.reverse_label AS relationship_reverse_label,
                rt.is_symmetric AS relationship_is_symmetric,
                rt.is_hierarchical AS relationship_is_hierarchical
            FROM lores l
            INNER JOIN origins origin_entity
                ON origin_entity.lore_id = l.id
            INNER JOIN entities entity_owner
                ON entity_owner.origin_id = origin_entity.id
            INNER JOIN relationships r
                ON r.source_entity_id = entity_owner.id
            INNER JOIN entities related_entity
                ON related_entity.id = r.target_entity_id
            INNER JOIN origins origin_related
                ON origin_related.id = related_entity.origin_id
            INNER JOIN relationship_types rt
                ON rt.id = r.relationship_type_id
            WHERE l.slug = $1
              AND origin_related.lore_id = l.id
            ORDER BY r.id
        `, [slug]);

        return rows.map((row) => ({
            id: row.id,
            source_entity_id: row.source_entity_id,
            target_entity_id: row.target_entity_id,
            relationship_type: {
                id: row.relationship_type_id,
                key: row.relationship_type_key,
                family_key: row.relationship_family_key,
                forward_label: row.relationship_forward_label,
                reverse_label: row.relationship_reverse_label,
                is_symmetric: row.relationship_is_symmetric,
                is_hierarchical: row.relationship_is_hierarchical
            }
        }));
    }
};

module.exports = relationshipsRepository;
