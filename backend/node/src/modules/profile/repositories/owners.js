const  SetSchema = require('../../../config/db')
const pool = SetSchema('profile')

const ownerRepository =  {
    async findAll(){
        const query = `SELECT id, name, bio FROM owners ORDER BY id`
        const {rows} = await pool.query(query)
        return rows
    }
}

module.exports = ownerRepository