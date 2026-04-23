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
        pattern: /^\/lores\/([a-z0-9-]+)\/page$/,
        method: 'GET',
        handler: pageController.bySlug,
        getParams: (match) => ({
            slug: match[1]
        })
    },
    {
        pattern: /^\/lores\/([a-z0-9-]+)$/,
        method: 'GET',
        handler: loresController.bySlug,
        getParams: (match) => ({
            slug: match[1]
        })
    },
    {
        pattern: /^\/lores\/([a-z0-9-]+)\/entities$/,
        method: 'GET',
        handler: entitiesController.listByLoreSlug,
        getParams: (match) => ({
            slug: match[1]
        })
    },
    {
        pattern: /^\/lores\/([a-z0-9-]+)\/entities\/(\d+)$/,
        method: 'GET',
        handler: entitiesController.byId,
        getParams: (match) => ({
            slug: match[1],
            id: match[2]
        })
    },
    {
        pattern: /^\/lores\/([a-z0-9-]+)\/entities\/([a-z_]+)\/([^/]+)$/,
        method: 'GET',
        handler: entitiesController.findBy,
        getParams: (match) => ({
            slug: match[1],
            field: match[2],
            value: decodeURIComponent(match[3])
        })
    },
    {
        pattern: /^\/lores\/([a-z0-9-]+)\/relationships$/,
        method: 'GET',
        handler: relationshipsController.listByLoreSlug,
        getParams: (match) => ({
            slug: match[1]
        })
    },
    {
        pattern: /^\/lores\/([a-z0-9-]+)\/narratives$/,
        method: 'GET',
        handler: narrativesController.listByLoreSlug,
        getParams: (match) => ({
            slug: match[1]
        })
    },
    {
        pattern: /^\/lores\/([a-z0-9-]+)\/features$/,
        method: 'GET',
        handler: loresController.listFeatures,
        getParams: (match) => ({
            slug: match[1]
        })
    },
    {
        pattern: /^\/lores\/([a-z0-9-]+)\/sidebar-groups$/,
        method: 'GET',
        handler: loresController.listSidebarGroups,
        getParams: (match) => ({
            slug: match[1]
        })
    }
];

module.exports = routes;
