const CharacterController = require('./controllers/characters')

const routes = [
    {
        pattern: /^\/characters$/,
        method: 'GET',
        handler: CharacterController.listAll
    },
    {
        pattern: /^\/characters\/(\d+)$/,
        method: 'GET',
        handler: CharacterController.byId
    },
    {
        pattern: /^\/characters\/type\/(\w+)$/,
        method: 'GET',
        handler: CharacterController.findBy
    }

]

module.exports = routes