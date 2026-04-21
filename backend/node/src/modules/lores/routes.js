const loresController = require('./controllers/lores');

const routes = [
    {
        pattern: /^\/lores$/,
        method: 'GET',
        handler: loresController.listAll
    }
];

module.exports = routes;
