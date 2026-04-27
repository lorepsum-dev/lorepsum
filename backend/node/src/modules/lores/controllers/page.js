const lorePageService = require('../services/page');
const { sendJson } = require('../../../utils/responses');

const lorePageController = {
    async byId(req, res) {
        try {
            const data = await lorePageService.findById(req.params.loreId);

            if (!data) {
                return sendJson(res, 404, {
                    status: 'error',
                    message: 'Lore not found'
                });
            }

            return sendJson(res, 200, {
                status: 'success',
                lore: data.lore,
                graph: data.graph,
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
