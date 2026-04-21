const SetSchema = require('../../../config/db')
const pool = SetSchema('mythologies')

const RelationshipRepository = {
    async findAll() {
        const { rows } = await pool.query(`
            SELECT DISTINCT entity_id, related_id, type FROM relationships
        `)
        return rows
    }
}

module.exports = RelationshipRepository
