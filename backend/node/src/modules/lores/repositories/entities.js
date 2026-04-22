const SetSchema = require('../../../config/db');
const pool = SetSchema('public');
const { mapEntityRows } = require('../utils/entities');

const ALLOWED_FIELDS = {
    gender: 'g.name',
    origin: 'o.name',
    category: 'cat.name'
};

const baseQuery = `
    SELECT
        e.id,
        e.name,
        e.description,
        e.avatar_url,
        ax.name AS axis,
        cat.name AS category,
        g.name AS gender,
        o.name AS origin,
        gr.name AS group,
        gr.description AS group_description
    FROM lores l
    INNER JOIN origins o
        ON o.lore_id = l.id
    INNER JOIN entities e
        ON e.origin_id = o.id
    LEFT JOIN entity_categories ec
        ON e.id = ec.entity_id
    LEFT JOIN categories cat
        ON ec.category_id = cat.id
    LEFT JOIN category_axes ax
        ON ax.id = cat.axis_id
    LEFT JOIN genders g
        ON e.gender_id = g.id
    LEFT JOIN entity_groups eg
        ON e.id = eg.entity_id
    LEFT JOIN groups gr
        ON eg.group_id = gr.id
    WHERE l.slug = $1
`;

const entitiesRepository = {
    async findAllByLoreSlug(slug) {
        const { rows } = await pool.query(`
            ${baseQuery}
            ORDER BY e.id
        `, [slug]);

        return mapEntityRows(rows);
    },

    async findByIdAndLoreSlug(slug, id) {
        const { rows } = await pool.query(`
            ${baseQuery}
            AND e.id = $2
            ORDER BY e.id
        `, [slug, id]);

        return mapEntityRows(rows)[0] ?? null;
    },

    async findByFieldAndLoreSlug(slug, field, value) {
        const column = ALLOWED_FIELDS[field];

        if (!column) {
            throw new Error('Invalid filter');
        }

        const { rows } = await pool.query(`
            ${baseQuery}
            AND ${column} = $2
            ORDER BY e.id
        `, [slug, value]);

        return mapEntityRows(rows);
    }
};

module.exports = entitiesRepository;
