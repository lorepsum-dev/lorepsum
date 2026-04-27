const entitiesRepository = require('../repositories/entities');
const { getLoreOrNull } = require('./context');

const entitiesService = {
    async listByLoreId(loreId) {
        const lore = await getLoreOrNull(loreId);

        if (!lore) {
            return null;
        }

        return {
            lore,
            entities: await entitiesRepository.findAllByLoreId(lore.id)
        };
    },

    async findById(loreId, id) {
        const lore = await getLoreOrNull(loreId);

        if (!lore) {
            return null;
        }

        return {
            lore,
            entity: await entitiesRepository.findByIdAndLoreId(lore.id, id)
        };
    },

    async findByField(loreId, field, value) {
        const lore = await getLoreOrNull(loreId);

        if (!lore) {
            return null;
        }

        return {
            lore,
            entities: await entitiesRepository.findByFieldAndLoreId(lore.id, field, value)
        };
    }
};

module.exports = entitiesService;
