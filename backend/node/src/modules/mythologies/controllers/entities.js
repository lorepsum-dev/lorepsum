const loreEntitiesController = require('../../lores/controllers/entities');

function withMythologiesSlug(req) {
    req.params = {
        ...req.params,
        slug: 'mythologies'
    };
}

const entityController = {
    async listAll(req, res) {
        withMythologiesSlug(req);
        return loreEntitiesController.listByLoreSlug(req, res);
    },

    async findBy(req, res) {
        withMythologiesSlug(req);
        return loreEntitiesController.findBy(req, res);
    },

    async byId(req, res) {
        withMythologiesSlug(req);
        return loreEntitiesController.byId(req, res);
    }
};

module.exports = entityController;
