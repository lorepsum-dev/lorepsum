const narrativesService = require('../services/narratives');
const { sendJson } = require('../../../utils/responses');

const narrativesController = {
    async listByLoreId(req, res) {
        try {
            const data = await narrativesService.listByLoreId(req.params.loreId);

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
