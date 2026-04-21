const SetSchema = require('../../../config/db');
const pool = SetSchema('mythologies');

const NarrativeRepository = {
  async findAll() {
    const { rows } = await pool.query(`
      SELECT id, title, subtitle, slug, content, display_order, category
      FROM narratives
      ORDER BY display_order ASC
    `);
    return rows;
  }
};

module.exports = NarrativeRepository;
