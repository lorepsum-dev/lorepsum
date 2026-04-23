const SetSchema = require('../../../config/db');
const pool = SetSchema('owners');

function groupRowsByOwnerId(rows, mapRow) {
    const groupedRows = new Map();

    rows.forEach((row) => {
        const currentRows = groupedRows.get(row.owner_id) ?? [];
        currentRows.push(mapRow(row));
        groupedRows.set(row.owner_id, currentRows);
    });

    return groupedRows;
}

const ownerRepository = {
    async findAll() {
        const { rows: ownerRows } = await pool.query(`
            SELECT id, name, bio, avatar_url FROM owners ORDER BY id
        `);

        const { rows: skillRows } = await pool.query(`
            SELECT owner_id, name, level FROM skills
        `);

        const { rows: socialRows } = await pool.query(`
            SELECT owner_id, label, value FROM owner_socials
        `);

        const { rows: preferenceRows } = await pool.query(`
            SELECT owner_id, label, value FROM owner_preferences
        `);

        const skillsByOwnerId = groupRowsByOwnerId(skillRows, (row) => ({
            name: row.name,
            level: row.level
        }));

        const socialsByOwnerId = groupRowsByOwnerId(socialRows, (row) => ({
            label: row.label,
            value: row.value
        }));

        const preferencesByOwnerId = groupRowsByOwnerId(preferenceRows, (row) => ({
            label: row.label,
            value: row.value
        }));

        return ownerRows.map((owner) => ({
            ...owner,
            skills: skillsByOwnerId.get(owner.id) ?? [],
            socials: socialsByOwnerId.get(owner.id) ?? [],
            preferences: preferencesByOwnerId.get(owner.id) ?? []
        }));
    }
};

module.exports = ownerRepository;
