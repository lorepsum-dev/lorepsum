const narrativesService = require('../services/narratives');
const { sendJson } = require('../../../utils/responses');

const narrativesController = {
    async listByLoreSlug(req, res) {
        try {
            const data = await narrativesService.listByLoreSlug(req.params.slug);

            if (!data) {
                return sendJson(res, 404, {
                    status: 'error',
                    message: 'Lore not found'
                });
            }

            return sendJson(res, 200, {
                status: 'success',
                lore: data.lore,
                results: data.narratives.length,
                narratives: data.narratives
            });
        } catch (error) {
            console.error(error);

            return sendJson(res, 500, {
                status: 'error',
                message: 'Failed to load lore narratives'
            });
        }
    }
};

module.exports = narrativesController;
