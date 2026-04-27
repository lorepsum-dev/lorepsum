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
            SELECT
                id,
                name,
                description,
                id::text AS slug,
                owner_id,
                category_id,
                visibility_id
            FROM lores
            WHERE ${loreCatalogConstraint}
            ORDER BY id
        `);

        return rows;
    },

    async findById(id) {
        const { rows } = await pool.query(`
            SELECT
                id,
                name,
                description,
                id::text AS slug,
                owner_id,
                category_id,
                visibility_id
            FROM lores
            WHERE id = $1
              AND ${loreCatalogConstraint}
            LIMIT 1
        `, [id]);

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
                category_value.id AS category_id,
                category_value.name AS category_name,
                ca.id AS axis_id,
                ca.name AS axis_name
            FROM lore_sidebar_groups lsg
            INNER JOIN categories category_value
                ON category_value.id = lsg.category_id
            INNER JOIN category_axes ca
                ON ca.id = category_value.axis_id
            WHERE lsg.lore_id = $1
            ORDER BY lsg.display_order, lsg.id
        `, [loreId]);

        return rows.map((row) => ({
            id: row.id,
            key: `sidebar-group-${row.id}`,
            label: row.label,
            display_order: row.display_order,
            match: {
                id: row.category_id,
                key: toMetadataKey(row.category_name),
                label: row.category_name
            },
            axis: {
                id: row.axis_id,
                key: toMetadataKey(row.axis_name),
                label: row.axis_name
            }
        }));
    }
};

module.exports = loresRepository;
