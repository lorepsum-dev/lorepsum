const SetSchema = require('../../../config/db');
const pool = SetSchema('mythologies')

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
            JOIN character_types ct on c.character_type_id = ct.id
            WHERE ct.name = $1
        `
        const {rows} = await pool.query(query, [typeId])
        return rows
    }
}

module.exports = CharacterRepository