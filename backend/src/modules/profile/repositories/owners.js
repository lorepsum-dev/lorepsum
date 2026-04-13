const createPool = require('../../../config/db');
const pool = createPool('profile')


const ownerRepositoriy = {
    async get(){
        const query = `SELECT name, bio FROM owners`
        const result = await pool.query(query)
        return result.rows[0]
    }
}

module.exports = ownerRepositoriy