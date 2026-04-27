const SetSchema = require('../../../config/db');
const pool = SetSchema('public');
const { mapEntityRows } = require('../utils/entities');

const ALLOWED_FIELDS = {
    category: 'cat.name',
    entity_type: 'et.key',
    type: 'et.key'
};

const baseQuery = `
    SELECT
        e.id,
        e.name,
        e.description,
        e.image_url,
        et.id AS entity_type_id,
        et.key AS entity_type_key,
        et.label AS entity_type_label,
        ax.name AS axis_label,
        cat.name AS category_label,
        gr.name AS group_label,
        gr.description AS group_description
    FROM entities e
    INNER JOIN entity_types et
        ON et.id = e.entity_type_id
    LEFT JOIN entity_categories ec
        ON e.id = ec.entity_id
    LEFT JOIN categories cat
        ON ec.category_id = cat.id
    LEFT JOIN category_axes ax
        ON ax.id = cat.axis_id
    LEFT JOIN entity_groups eg
        ON e.id = eg.entity_id
    LEFT JOIN groups gr
        ON eg.group_id = gr.id
    WHERE e.lore_id = $1
`;

const entitiesRepository = {
    async findAllByLoreId(loreId) {
        const { rows } = await pool.query(`
            ${baseQuery}
            ORDER BY e.id
        `, [loreId]);

        return mapEntityRows(rows);
    },

    async findByIdAndLoreId(loreId, id) {
        const { rows } = await pool.query(`
            ${baseQuery}
            AND e.id = $2
            ORDER BY e.id
        `, [loreId, id]);

        return mapEntityRows(rows)[0] ?? null;
    },

    async findByFieldAndLoreId(loreId, field, value) {
        const column = ALLOWED_FIELDS[field];

        if (!column) {
            throw new Error('Invalid filter');
        }

        const { rows } = await pool.query(`
            ${baseQuery}
            AND ${column} = $2
            ORDER BY e.id
        `, [loreId, value]);

        return mapEntityRows(rows);
    }
};

module.exports = entitiesRepository;
