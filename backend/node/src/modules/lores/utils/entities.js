const { toMetadataKey } = require('../../../utils/keys');

function compareByLabel(a, b) {
    return a.label.localeCompare(b.label);
}

function mapEntityRows(rows) {
    const entitiesById = new Map();
    const categoriesByEntityId = new Map();
    const groupKeysByEntityId = new Map();

    rows.forEach((row) => {
        if (!entitiesById.has(row.id)) {
            entitiesById.set(row.id, {
                id: row.id,
                name: row.name,
                description: row.description,
                avatar_url: row.avatar_url || null,
                gender: row.gender,
                origin: row.origin,
                categories: [],
                groups: []
            });
            categoriesByEntityId.set(row.id, new Map());
            groupKeysByEntityId.set(row.id, new Set());
        }

        const entity = entitiesById.get(row.id);
        const categoriesByKey = categoriesByEntityId.get(row.id);
        const groupKeys = groupKeysByEntityId.get(row.id);

        if (row.axis_label && row.category_label) {
            const axisKey = toMetadataKey(row.axis_label);
            const valueKey = toMetadataKey(row.category_label);
            let categoryAxis = categoriesByKey.get(axisKey);

            if (!categoryAxis) {
                categoryAxis = {
                    key: axisKey,
                    label: row.axis_label,
                    values: []
                };
                categoriesByKey.set(axisKey, categoryAxis);
            }

            if (!categoryAxis.values.some((value) => value.key === valueKey)) {
                categoryAxis.values.push({
                    key: valueKey,
                    label: row.category_label
                });
            }
        }

        if (row.group_label) {
            const groupKey = toMetadataKey(row.group_label);

            if (!groupKeys.has(groupKey)) {
                groupKeys.add(groupKey);
                entity.groups.push({
                    key: groupKey,
                    label: row.group_label,
                    description: row.group_description
                });
            }
        }
    });

    return Array.from(entitiesById.values()).map((entity) => {
        const categoriesByKey = categoriesByEntityId.get(entity.id) ?? new Map();
        const categories = Array.from(categoriesByKey.values())
            .map((categoryAxis) => ({
                ...categoryAxis,
                values: categoryAxis.values.slice().sort(compareByLabel)
            }))
            .sort(compareByLabel);

        return {
            ...entity,
            categories,
            groups: entity.groups.slice().sort(compareByLabel)
        };
    });
}

module.exports = { mapEntityRows };
