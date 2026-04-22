const EntityController = require('./controllers/entities')
const RelationshipController = require('./controllers/relationships')
const NarrativeController = require('./controllers/narratives')

const routes = [
  {
    pattern: /^\/narratives$/,
    method: 'GET',
    handler: NarrativeController.listAll,
    getParams: () => ({})
  },
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
      value: decodeURIComponent(match[2])
    })
  }
]

module.exports = routes
