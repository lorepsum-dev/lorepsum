const entitiesRepository = require('../repositories/entities');
const relationshipsRepository = require('../repositories/relationships');
const { getLoreOrNull } = require('./context');

const relationshipsService = {
    async listByLoreId(loreId) {
        const lore = await getLoreOrNull(loreId);

        if (!lore) {
            return null;
        }

        const [nodes, edges] = await Promise.all([
            entitiesRepository.findAllByLoreId(lore.id),
            relationshipsRepository.findAllByLoreId(lore.id)
        ]);

        return {
            lore,
            nodes,
            edges
        };
    }
};

module.exports = relationshipsService;
