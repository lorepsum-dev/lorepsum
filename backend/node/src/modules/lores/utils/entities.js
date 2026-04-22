function mapEntityRows(rows) {
    const entitiesMap = {};

    rows.forEach((row) => {
        if (!entitiesMap[row.id]) {
            entitiesMap[row.id] = {
                id: row.id,
                name: row.name,
                description: row.description,
                avatar_url: row.avatar_url || null,
                gender: row.gender,
                origin: row.origin,
                categories: {},
                groups: []
            };
        }

        if (row.category) {
            const axis = row.axis;

            if (!entitiesMap[row.id].categories[axis]) {
                entitiesMap[row.id].categories[axis] = [];
            }

            if (!entitiesMap[row.id].categories[axis].includes(row.category)) {
                entitiesMap[row.id].categories[axis].push(row.category);
            }
        }

        if (row.group) {
            const groupAlreadyExists = entitiesMap[row.id].groups.some(
                (group) => group.name === row.group
            );

            if (!groupAlreadyExists) {
                entitiesMap[row.id].groups.push({
                    name: row.group,
                    description: row.group_description
                });
            }
        }
    });

    return Object.values(entitiesMap);
}

module.exports = { mapEntityRows };
