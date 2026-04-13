const ownersController = require('./controllers/owners')

const routes = [
    {
        parttern: /^\profile\/owners$/,
        method: 'GET',
        handler: ownersController.get
    }
]


module.exports = routes;