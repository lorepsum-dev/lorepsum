const entitiesService = require('../services/entities');
const { sendJson } = require('../../../utils/responses');

const entitiesController = {
    async listByLoreSlug(req, res) {
        try {
            const data = await entitiesService.listByLoreSlug(req.params.slug);

            if (!data) {
                return sendJson(res, 404, {
                    status: 'error',
                    message: 'Lore not found'
                });
            }

            return sendJson(res, 200, {
                status: 'success',
                lore: data.lore,
                results: data.entities.length,
                entities: data.entities
            });
        } catch (error) {
            console.error(error);

            return sendJson(res, 500, {
                status: 'error',
                message: 'Failed to load lore entities'
            });
        }
    },

    async byId(req, res) {
        try {
            const data = await entitiesService.findById(req.params.slug, req.params.id);

            if (!data) {
                return sendJson(res, 404, {
                    status: 'error',
                    message: 'Lore not found'
                });
            }

            if (!data.entity) {
                return sendJson(res, 404, {
                    status: 'error',
                    message: 'Entity not found'
                });
            }

            return sendJson(res, 200, {
                status: 'success',
                lore: data.lore,
                entity: data.entity
            });
        } catch (error) {
            console.error(error);

            return sendJson(res, 500, {
                status: 'error',
                message: 'Failed to load lore entity'
            });
        }
    },

    async findBy(req, res) {
        try {
            const data = await entitiesService.findByField(
                req.params.slug,
                req.params.field,
                req.params.value
            );

            if (!data) {
                return sendJson(res, 404, {
                    status: 'error',
                    message: 'Lore not found'
                });
            }

            return sendJson(res, 200, {
                status: 'success',
                lore: data.lore,
                results: data.entities.length,
                entities: data.entities
            });
        } catch (error) {
            const isInvalidFilter = error.message === 'Invalid filter';

            if (!isInvalidFilter) {
                console.error(error);
            }

            return sendJson(res, isInvalidFilter ? 400 : 500, {
                status: 'error',
                message: isInvalidFilter
                    ? 'Invalid entity filter'
                    : 'Failed to load lore entities'
            });
        }
    }
};

module.exports = entitiesController;
