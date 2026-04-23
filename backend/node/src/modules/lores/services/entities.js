const entitiesRepository = require('../repositories/entities');
const { getLoreOrNull } = require('./context');

const entitiesService = {
    async listByLoreSlug(slug) {
        const lore = await getLoreOrNull(slug);

        if (!lore) {
            return null;
        }

        return {
            lore,
            entities: await entitiesRepository.findAllByLoreSlug(slug)
        };
    },

    async findById(slug, id) {
        const lore = await getLoreOrNull(slug);

        if (!lore) {
            return null;
        }

        return {
            lore,
            entity: await entitiesRepository.findByIdAndLoreSlug(slug, id)
        };
    },

    async findByField(slug, field, value) {
        const lore = await getLoreOrNull(slug);

        if (!lore) {
            return null;
        }

        return {
            lore,
            entities: await entitiesRepository.findByFieldAndLoreSlug(slug, field, value)
        };
    }
};

module.exports = entitiesService;
