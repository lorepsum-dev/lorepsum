const pool = require('../config/db');

const CharacterRepository= {
    async findAll(){
        const query = 'SELECT id, name, description FROM characters ORDER BY id'
        const {rows} = await pool.query(query)
        return rows
    },
    async findById(id){
        const query = 'SELECT id, name, description from characters where id = $1'
        const {rows} = await pool.query(query,[id])
        return rows[0]
    },
    async findByType(typeId){
        const query = `
            SELECT 
            c.name,
            c.description,
            ct.name as type
            FROM characters c
            JOIN character_types ct on c.id = ct.character_type_id
            WHERE character_type_id = $1
        `
        const {rows} = await pool.query(query, [typeId])
        return rows
    }
}

module.exports = CharacterRepository