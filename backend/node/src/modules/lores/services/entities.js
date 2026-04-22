const loresRepository = require('../repositories/lores');
const entitiesRepository = require('../repositories/entities');

const entitiesService = {
    async listByLoreSlug(slug) {
        const lore = await loresRepository.findBySlug(slug);

        if (!lore) {
            return null;
        }

        return {
            lore,
            entities: await entitiesRepository.findAllByLoreSlug(slug)
        };
    },

    async findById(slug, id) {
        const lore = await loresRepository.findBySlug(slug);

        if (!lore) {
            return null;
        }

        return {
            lore,
            entity: await entitiesRepository.findByIdAndLoreSlug(slug, id)
        };
    },

    async findByField(slug, field, value) {
        const lore = await loresRepository.findBySlug(slug);

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
