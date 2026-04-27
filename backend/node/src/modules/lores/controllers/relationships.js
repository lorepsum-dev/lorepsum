const relationshipsService = require('../services/relationships');
const { sendJson } = require('../../../utils/responses');

const relationshipsController = {
    async listByLoreId(req, res) {
        try {
            const data = await relationshipsService.listByLoreId(req.params.loreId);

            if (!data) {
                return sendJson(res, 404, {
                    status: 'error',
                    message: 'Lore not found'
                });
            }

            return sendJson(res, 200, {
                status: 'success',
                lore: data.lore,
                results: data.edges.length,
                nodes: data.nodes,
                edges: data.edges
            });
        } catch (error) {
            console.error(error);

            return sendJson(res, 500, {
                status: 'error',
                message: 'Failed to load lore relationships'
            });
        }
    }
};

module.exports = relationshipsController;
