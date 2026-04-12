require('dotenv').config()
const { Pool } = require('pg')

function SetSchema(schema = 'public') {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 2,
        idleTimeoutMillis: 30000
    })

    pool.on('connect', (client) => {
        client.query(`SET search_path TO ${schema}, public`)
    })
    return pool
}

module.exports = SetSchema