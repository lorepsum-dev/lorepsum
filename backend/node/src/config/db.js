require('dotenv').config()

const {Pool} = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2,
    idleTimeoutMillis: 30000
})


async function init() {
    const client = await pool.connect()
    await client.query('SET search_path TO mythologies, public')
    return client
}

module.exports = pool, init;