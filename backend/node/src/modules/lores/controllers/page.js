const lorePageService = require('../services/page');
const { sendJson } = require('../../../utils/responses');

const lorePageController = {
    async bySlug(req, res) {
        try {
            const data = await lorePageService.findBySlug(req.params.slug);

            if (!data) {
                return sendJson(res, 404, {
                    status: 'error',
                    message: 'Lore not found'
                });
            }

            return sendJson(res, 200, {
                status: 'success',
                lore: data.lore,
                entities: data.entities,
                relationships: data.relationships,
                narratives: data.narratives
            });
        } catch (error) {
            console.error(error);

            return sendJson(res, 500, {
                status: 'error',
                message: 'Failed to load lore page'
            });
        }
    }
};

module.exports = lorePageController;
