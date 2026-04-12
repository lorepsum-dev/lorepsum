const ownersController = require('../profile/controllers/owners')

const routes = [
    {
        pattern: /^\/owners$/,
        method: 'GET',
        handler: ownersController.listAll
    }
]

module.exports = routes;