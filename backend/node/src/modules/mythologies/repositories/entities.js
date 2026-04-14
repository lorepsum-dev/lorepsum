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
            e.id,
            e.name,
            e.description,
			ax.name as axis,
			cat.name as category,
            g.name as gender,
            o.name as origin
        FROM entities e
		JOIN entity_categories ec on e.id = ec.entity_id
		JOIN categories cat on ec.category_id = cat.id
		JOIN category_axes ax on ax.id = cat.axis_id
        JOIN genders g ON e.gender_id = g.id
        JOIN origins o on e.origin_id = o.id
    `
    const allowedFields = {
        gender: 'g.name',
        origin: 'o.name',
        category:'cat.name'
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
    const entitiesMap = {}
    rows.forEach(row=> {

    })
    return rows
}
}

module.exports = EntityRepository