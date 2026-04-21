const SetSchema = require('../../../config/db');
const pool = SetSchema('public');

const loresRepository = {
    async findAll() {
        const { rows } = await pool.query(`
            SELECT id, name, description
            FROM lores
            ORDER BY id
        `);
        return rows;
    }
};

module.exports = loresRepository;
