const SetSchema = require('../../../config/db');
const pool = SetSchema('public');

const relationshipsRepository = {
    async findAllByLoreId(loreId) {
        const { rows } = await pool.query(`
            SELECT
                r.id,
                r.source_entity_id,
                r.target_entity_id,
                rt.id AS relationship_type_id,
                rt.key AS relationship_type_key,
                rt.forward_label AS relationship_forward_label,
                rt.reverse_label AS relationship_reverse_label,
                rt.is_symmetric AS relationship_is_symmetric
            FROM entities source_entity
            INNER JOIN relationships r
                ON r.source_entity_id = source_entity.id
            INNER JOIN entities target_entity
                ON target_entity.id = r.target_entity_id
            INNER JOIN relationship_types rt
                ON rt.id = r.relationship_type_id
            WHERE source_entity.lore_id = $1
              AND target_entity.lore_id = $1
            ORDER BY r.id
        `, [loreId]);

        return rows.map((row) => ({
            id: row.id,
            source_entity_id: row.source_entity_id,
            target_entity_id: row.target_entity_id,
            relationship_type: {
                id: row.relationship_type_id,
                key: row.relationship_type_key,
                family_key: null,
                forward_label: row.relationship_forward_label,
                reverse_label: row.relationship_reverse_label,
                is_symmetric: row.relationship_is_symmetric,
                is_hierarchical: false
            }
        }));
    }
};

module.exports = relationshipsRepository;
