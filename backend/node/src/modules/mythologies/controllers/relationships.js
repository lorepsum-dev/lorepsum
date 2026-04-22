const loreRelationshipsController = require('../../lores/controllers/relationships');

const relationshipController = {
    async listAll(req, res) {
        req.params = {
            ...req.params,
            slug: 'mythologies'
        };

        return loreRelationshipsController.listByLoreSlug(req, res);
    }
};

module.exports = relationshipController;
