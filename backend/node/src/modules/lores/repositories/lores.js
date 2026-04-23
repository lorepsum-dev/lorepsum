const SetSchema = require('../../../config/db');
const { toFeatureKey, toMetadataKey } = require('../../../utils/keys');
const pool = SetSchema('public');

const loreCatalogConstraint = `
    EXISTS (
        SELECT 1
        FROM lore_features lf
        WHERE lf.lore_id = lores.id
    )
`;

const loresRepository = {
    async findAll() {
        const { rows } = await pool.query(`
            SELECT id, name, description, slug
            FROM lores
            WHERE ${loreCatalogConstraint}
            ORDER BY id
        `);

        return rows;
    },

    async findBySlug(slug) {
        const { rows } = await pool.query(`
            SELECT id, name, description, slug
            FROM lores
            WHERE slug = $1
              AND ${loreCatalogConstraint}
            LIMIT 1
        `, [slug]);

        return rows[0] ?? null;
    },

    async findFeaturesByLoreId(loreId) {
        const { rows } = await pool.query(`
            SELECT
                f.id,
                f.name,
                f.description,
                lf.display_order
            FROM lore_features lf
            INNER JOIN features f
                ON f.id = lf.feature_id
            WHERE lf.lore_id = $1
            ORDER BY lf.display_order, f.id
        `, [loreId]);

        return rows.map((row) => ({
            id: row.id,
            key: toFeatureKey(row.name),
            label: row.name,
            description: row.description,
            display_order: row.display_order
        }));
    },

    async findSidebarGroupsByLoreId(loreId) {
        const { rows } = await pool.query(`
            SELECT
                lsg.id,
                lsg.label,
                lsg.display_order,
                lsg.match_value,
                ca.id AS axis_id,
                ca.name AS axis_name
            FROM lore_sidebar_groups lsg
            INNER JOIN category_axes ca
                ON ca.id = lsg.axis_id
            WHERE lsg.lore_id = $1
            ORDER BY lsg.display_order, lsg.id
        `, [loreId]);

        return rows.map((row) => ({
            id: row.id,
            key: `sidebar-group-${row.id}`,
            label: row.label,
            display_order: row.display_order,
            match_key: toMetadataKey(row.match_value),
            match_value: row.match_value,
            axis: {
                id: row.axis_id,
                key: toMetadataKey(row.axis_name),
                label: row.axis_name
            }
        }));
    }
};

module.exports = loresRepository;
