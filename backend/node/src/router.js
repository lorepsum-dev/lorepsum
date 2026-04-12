const mythologiesRoutes = require('./modules/mythologies/routes')
const profileRoutes = require('./modules/profile/routes')

const routes = [
    ...mythologiesRoutes,
    ...profileRoutes,
]

module.exports = routes
