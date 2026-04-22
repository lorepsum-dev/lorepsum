const SetSchema = require('../../../config/db');
const pool = SetSchema('public');

const relationshipsRepository = {
    async findAllByLoreSlug(slug) {
        const { rows } = await pool.query(`
            SELECT DISTINCT
                r.entity_id,
                r.related_id,
                r.type
            FROM lores l
            INNER JOIN origins origin_entity
                ON origin_entity.lore_id = l.id
            INNER JOIN entities entity_owner
                ON entity_owner.origin_id = origin_entity.id
            INNER JOIN relationships r
                ON r.entity_id = entity_owner.id
            INNER JOIN entities related_entity
                ON related_entity.id = r.related_id
            INNER JOIN origins origin_related
                ON origin_related.id = related_entity.origin_id
            WHERE l.slug = $1
              AND origin_related.lore_id = l.id
            ORDER BY r.entity_id, r.related_id, r.type
        `, [slug]);

        return rows;
    }
};

module.exports = relationshipsRepository;
