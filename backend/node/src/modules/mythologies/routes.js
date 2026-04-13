const EntityController = require('./controllers/entities')

const routes = [
    {
        pattern: /^\/entities$/,
        method: 'GET',
        handler: EntityController.listAll
    },
    {
        pattern: /^\/entities\/(\d+)$/,
        method: 'GET',
        handler: EntityController.byId
    },
    {
        pattern: /^\/entities\/(\w+)\/(\w+)$/,
        method: 'GET',
        handler: EntityController.findBy
    }

]

module.exports = routes