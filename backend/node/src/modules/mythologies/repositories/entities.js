const SetSchema = require('../../../config/db');
const pool = SetSchema('mythologies')

function getCategories(rows) {
    const entitiesMap = {}
    rows.forEach(row=> {
       if(!entitiesMap[row.id]){
            entitiesMap[row.id] ={
                id: row.id,
                name: row.name,
                description: row.description,
                categories: {}
            }
       }
       if(row.category){
            const axis = row.axis
        if(!entitiesMap[row.id].categories[axis]){
            entitiesMap[row.id].categories[axis] = []
        }
        entitiesMap[row.id].categories[axis].push(row.category)
       }     
    })
    
        return Object.values(entitiesMap)
}

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
		LEFT JOIN entity_categories ec on e.id = ec.entity_id
		LEFT JOIN categories cat on ec.category_id = cat.id
		LEFT JOIN category_axes ax on ax.id = cat.axis_id
        LEFT JOIN genders g ON e.gender_id = g.id
        LEFT JOIN origins o on e.origin_id = o.id
    `

const EntityRepository= {
    async findAll(){
        const query = baseQuery
        const {rows} = await pool.query(query)
        return getCategories(rows)
    },
    async findById(id){
        const query = `${baseQuery} where e.id = $1`
        const {rows} = await pool.query(query,[id])
        return getCategories(rows)
    },
  
    async findBy(field, value) {      
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
    return getCategories(rows)
    }
}

module.exports = EntityRepository