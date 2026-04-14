const SetSchema = require('../../../config/db');
const pool = SetSchema('mythologies')

const EntityRepository= {
    async findAll(){
        const query = 'SELECT id, name, description FROM entities ORDER BY id'
        const {rows} = await pool.query(query)
        return rows
    },
    async findById(id){
        const query = 'SELECT id, name, description from entities where id = $1'
        const {rows} = await pool.query(query,[id])
        return rows[0]
    },
  
    async findBy(field, value) {      
    const baseQuery = `
        SELECT 
            c.id,
            c.name,
            c.description,
            g.name as gender,
            o.name as origin
        FROM entities c
        JOIN genders g ON c.gender_id = g.id
        JOIN origins o on c.origin_id = o.id
    `
    const allowedFields = {
        gender: 'g.name',
        origin: 'o.name'
    }

    const column = allowedFields[field]

    if (!column) {
        throw new Error('Filtro inválido')
    }

    const query = `
        ${baseQuery}
        WHERE ${column} = $1
    `
    const { rows } = await pool.query(query, [value])
    return rows
}
}

module.exports = EntityRepository