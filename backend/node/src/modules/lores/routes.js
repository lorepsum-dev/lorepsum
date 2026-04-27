const loresController = require('./controllers/lores');
const entitiesController = require('./controllers/entities');
const relationshipsController = require('./controllers/relationships');
const narrativesController = require('./controllers/narratives');
const pageController = require('./controllers/page');

const routes = [
    {
        pattern: /^\/lores$/,
        method: 'GET',
        handler: loresController.listAll
    },
    {
        pattern: /^\/lores\/(\d+)\/page$/,
        method: 'GET',
        handler: pageController.byId,
        getParams: (match) => ({
            loreId: match[1]
        })
    },
    {
        pattern: /^\/lores\/(\d+)$/,
        method: 'GET',
        handler: loresController.byId,
        getParams: (match) => ({
            loreId: match[1]
        })
    },
    {
        pattern: /^\/lores\/(\d+)\/entities$/,
        method: 'GET',
        handler: entitiesController.listByLoreId,
        getParams: (match) => ({
            loreId: match[1]
        })
    },
    {
        pattern: /^\/lores\/(\d+)\/entities\/(\d+)$/,
        method: 'GET',
        handler: entitiesController.byId,
        getParams: (match) => ({
            loreId: match[1],
            id: match[2]
        })
    },
    {
        pattern: /^\/lores\/(\d+)\/entities\/([a-z_]+)\/([^/]+)$/,
        method: 'GET',
        handler: entitiesController.findBy,
        getParams: (match) => ({
            loreId: match[1],
            field: match[2],
            value: decodeURIComponent(match[3])
        })
    },
    {
        pattern: /^\/lores\/(\d+)\/relationships$/,
        method: 'GET',
        handler: relationshipsController.listByLoreId,
        getParams: (match) => ({
            loreId: match[1]
        })
    },
    {
        pattern: /^\/lores\/(\d+)\/narratives$/,
        method: 'GET',
        handler: narrativesController.listByLoreId,
        getParams: (match) => ({
            loreId: match[1]
        })
    },
    {
        pattern: /^\/lores\/(\d+)\/features$/,
        method: 'GET',
        handler: loresController.listFeatures,
        getParams: (match) => ({
            loreId: match[1]
        })
    },
    {
        pattern: /^\/lores\/(\d+)\/sidebar-groups$/,
        method: 'GET',
        handler: loresController.listSidebarGroups,
        getParams: (match) => ({
            loreId: match[1]
        })
    }
];

module.exports = routes;
