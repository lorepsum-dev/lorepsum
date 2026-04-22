const loreNarrativesController = require('../../lores/controllers/narratives');

const narrativeController = {
    async listAll(req, res) {
        req.params = {
            ...req.params,
            slug: 'mythologies'
        };

        return loreNarrativesController.listByLoreSlug(req, res);
    }
};

module.exports = narrativeController;
