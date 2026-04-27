const SetSchema = require('../../../config/db');
const { toMetadataKey } = require('../../../utils/keys');
const pool = SetSchema('public');

const narrativesRepository = {
    async findAllByLoreId(loreId) {
        const { rows } = await pool.query(`
            SELECT
                n.id,
                n.title,
                n.subtitle,
                n.slug,
                n.content,
                n.display_order,
                n.category
            FROM narratives n
            WHERE n.lore_id = $1
            ORDER BY n.display_order ASC, n.id ASC
        `, [loreId]);

        return rows.map((row) => ({
            ...row,
            category_key: row.category ? toMetadataKey(row.category) : null,
            category_label: row.category
        }));
    }
};

module.exports = narrativesRepository;
