const SetSchema = require('../../../config/db');
const { toMetadataKey } = require('../../../utils/keys');

const pool = SetSchema('public');

function mapAxis(row) {
    return {
        id: row.axis_id,
        key: toMetadataKey(row.axis_name),
        label: row.axis_name
    };
}

const entityModalPresentationRepository = {
    async findByLoreId(loreId) {
        const [badgeRows, tagAxisRows] = await Promise.all([
            pool.query(`
                SELECT
                    rule.id,
                    rule.label,
                    rule.display_order,
                    category_value.id AS category_id,
                    category_value.name AS category_name,
                    axis.id AS axis_id,
                    axis.name AS axis_name
                FROM lore_entity_modal_badge_rules rule
                INNER JOIN categories category_value
                    ON category_value.id = rule.category_id
                INNER JOIN category_axes axis
                    ON axis.id = category_value.axis_id
                WHERE rule.lore_id = $1
                ORDER BY rule.display_order, rule.id
            `, [loreId]),
            pool.query(`
                SELECT
                    rule.id,
                    rule.display_order,
                    axis.id AS axis_id,
                    axis.name AS axis_name
                FROM lore_entity_modal_tag_axes rule
                INNER JOIN category_axes axis
                    ON axis.id = rule.axis_id
                WHERE rule.lore_id = $1
                ORDER BY rule.display_order, rule.id
            `, [loreId])
        ]);

        return {
            badge_rules: badgeRows.rows.map((row) => ({
                id: row.id,
                label: row.label,
                display_order: row.display_order,
                axis: mapAxis(row),
                match: {
                    id: row.category_id,
                    key: toMetadataKey(row.category_name),
                    label: row.category_name
                }
            })),
            tag_axes: tagAxisRows.rows.map((row) => ({
                id: row.id,
                display_order: row.display_order,
                axis: mapAxis(row)
            }))
        };
    }
};

module.exports = entityModalPresentationRepository;
