const EntityController = require('./controllers/entities')
const RelationshipController = require('./controllers/relationships')

const routes = [
  {
    pattern: /^\/relationships$/,
    method: 'GET',
    handler: RelationshipController.listAll,
    getParams: () => ({})
  },
  {
    pattern: /^\/entities$/,
    method: 'GET',
    handler: EntityController.listAll,
    getParams: () => ({})
  },
  {
    pattern: /^\/entities\/(\d+)$/,
    method: 'GET',
    handler: EntityController.byId,
    getParams: (match) => ({
      id: match[1]
    })
  },
  {
    pattern: /^\/entities\/(\w+)\/(\w+)$/,
    method: 'GET',
    handler: EntityController.findBy,
    getParams: (match) => ({
      field: match[1],
      value: match[2]
    })
  }
]

module.exports = routes