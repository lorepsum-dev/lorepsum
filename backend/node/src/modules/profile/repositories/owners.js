const  SetSchema = require('../../../config/db')
const pool = SetSchema('profile')

const ownerRepository =  {
    async findAll(){
        const query = `
        SELECT 
            o.id, 
            o.name, 
            o.bio,
		    s.name as skill,
            s.level
        FROM owners o
        LEFT JOIN skills s on o.id = s.owner_id
        ORDER BY id
        `
        const {rows} = await pool.query(query)
        //return rows
        const ownersMap = {}
        rows.forEach(row => {
            if (!ownersMap[row.id]) {
            ownersMap[row.id] = {
                id: row.id,
                name: row.name,
                bio:  row.bio,
                skills: []
            }
        }
        if(row.skill){
            ownersMap[row.id].skills.push({
                name: row.skill,
                level: row.level
            })
        }
        });

        return Object.values(ownersMap)
    }
}

module.exports = ownerRepository