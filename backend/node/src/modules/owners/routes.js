const ownersController = require('../owners/controllers/owners')

const routes = [
    {
        pattern: /^\/owners$/,
        method: 'GET',
        handler: ownersController.listAll
    }
]

module.exports = routes;