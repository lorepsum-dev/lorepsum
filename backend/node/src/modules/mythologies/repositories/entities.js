const SetSchema = require('../../../config/db');
const pool = SetSchema('mythologies')
const {baseQuery} = require('../utils/queries')

function getCategories(rows) {
    const entitiesMap = {}

    rows.forEach(row => {
        if (!entitiesMap[row.id]) {
            entitiesMap[row.id] = {
                id: row.id,
                name: row.name,
                description: row.description,
                avatar_url: row.avatar_url || null,
                gender: row.gender,
                origin: row.origin,
                categories: {},
                groups: []
            }
        }

        if (row.category) {
            const axis = row.axis

            if (!entitiesMap[row.id].categories[axis]) {
                entitiesMap[row.id].categories[axis] = []
            }

            if (!entitiesMap[row.id].categories[axis].includes(row.category)) {
                entitiesMap[row.id].categories[axis].push(row.category)
            }
        }

        if (row.group) {
            const groupAlreadyExists = entitiesMap[row.id].groups.some(
                group => group.name === row.group
            )

            if (!groupAlreadyExists) {
                entitiesMap[row.id].groups.push({
                    name: row.group,
                    description: row.group_description
                })
            }
        }
    })

    return Object.values(entitiesMap)
}

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
