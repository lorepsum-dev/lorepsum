const SetSchema = require('../../../config/db')
const pool = SetSchema('owners')

const ownerRepository = {
    async findAll() {
        const { rows: ownerRows } = await pool.query(`
            SELECT id, name, bio, avatar_url FROM owners ORDER BY id
        `)

        const { rows: skillRows } = await pool.query(`
            SELECT owner_id, name, level FROM skills
        `)

        const { rows: socialRows } = await pool.query(`
            SELECT owner_id, label, value FROM owner_socials
        `)

        const { rows: preferenceRows } = await pool.query(`
            SELECT owner_id, label, value FROM owner_preferences
        `)

        return ownerRows.map(owner => ({
            ...owner,
            skills: skillRows
                .filter(s => s.owner_id === owner.id)
                .map(s => ({ name: s.name, level: s.level })),
            socials: socialRows
                .filter(s => s.owner_id === owner.id)
                .map(s => ({ label: s.label, value: s.value })),
            preferences: preferenceRows
                .filter(p => p.owner_id === owner.id)
                .map(p => ({ label: p.label, value: p.value }))
        }))
    }
}

module.exports = ownerRepository
