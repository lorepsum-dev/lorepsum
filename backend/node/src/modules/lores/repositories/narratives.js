const SetSchema = require('../../../config/db');
const pool = SetSchema('public');

const narrativesRepository = {
    async findAllByLoreSlug(slug) {
        const { rows } = await pool.query(`
            SELECT
                n.id,
                n.title,
                n.subtitle,
                n.slug,
                n.content,
                n.display_order,
                n.category
            FROM lores l
            INNER JOIN narratives n
                ON n.lore_id = l.id
            WHERE l.slug = $1
            ORDER BY n.display_order ASC, n.id ASC
        `, [slug]);

        return rows;
    }
};

module.exports = narrativesRepository;
