const loresRoutes = require('./modules/lores/routes');
const ownersRoutes = require('./modules/owners/routes');

const routes = [
    ...loresRoutes,
    ...ownersRoutes
];

module.exports = routes;
