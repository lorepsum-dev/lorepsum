require('dotenv').config()
const { Pool } = require('pg')

function SetSchema(schema = 'public') {
    return new Pool({
        connectionString: process.env.DATABASE_URL,
        options: `-c search_path=${schema},public`,
        max: 2,
        idleTimeoutMillis: 30000
    })
}

module.exports = SetSchema
