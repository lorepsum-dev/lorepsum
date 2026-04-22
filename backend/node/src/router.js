const mythologiesRoutes = require('./modules/mythologies/routes')
const ownersRoutes = require('./modules/owners/routes')
const loresRoutes = require('./modules/lores/routes')

const routes = [
    ...loresRoutes,
    ...ownersRoutes,
    ...mythologiesRoutes,
]

module.exports = routes
