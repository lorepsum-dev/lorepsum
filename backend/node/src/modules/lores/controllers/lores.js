const loresService = require('../services/lores');
const { sendJson } = require('../utils/responses');

const loresController = {
    async listAll(req, res) {
        try {
            const data = await loresService.listAll();

            sendJson(res, 200, {
                status: 'success',
                results: data.length,
                lores: data
            });
        } catch (error) {
            console.error(error);
            sendJson(res, 500, {
                status: 'error',
                message: 'Failed to load lores'
            });
        }
    },

    async bySlug(req, res) {
        try {
            const data = await loresService.findBySlug(req.params.slug);

            if (!data) {
                return sendJson(res, 404, {
                    status: 'error',
                    message: 'Lore not found'
                });
            }

            return sendJson(res, 200, {
                status: 'success',
                lore: data
            });
        } catch (error) {
            console.error(error);
            return sendJson(res, 500, {
                status: 'error',
                message: 'Failed to load lore'
            });
        }
    },

    async listFeatures(req, res) {
        try {
            const data = await loresService.listFeatures(req.params.slug);

            if (!data) {
                return sendJson(res, 404, {
                    status: 'error',
                    message: 'Lore not found'
                });
            }

            return sendJson(res, 200, {
                status: 'success',
                lore: data.lore,
                results: data.features.length,
                features: data.features
            });
        } catch (error) {
            console.error(error);
            return sendJson(res, 500, {
                status: 'error',
                message: 'Failed to load lore features'
            });
        }
    },

    async listSidebarGroups(req, res) {
        try {
            const data = await loresService.listSidebarGroups(req.params.slug);

            if (!data) {
                return sendJson(res, 404, {
                    status: 'error',
                    message: 'Lore not found'
                });
            }

            return sendJson(res, 200, {
                status: 'success',
                lore: data.lore,
                results: data.sidebar_groups.length,
                sidebar_groups: data.sidebar_groups
            });
        } catch (error) {
            console.error(error);
            return sendJson(res, 500, {
                status: 'error',
                message: 'Failed to load lore sidebar groups'
            });
        }
    }
};

module.exports = loresController;
