const entitiesRepository = require('../repositories/entities');
const relationshipsRepository = require('../repositories/relationships');
const { getLoreOrNull } = require('./context');

const relationshipsService = {
    async listByLoreSlug(slug) {
        const lore = await getLoreOrNull(slug);

        if (!lore) {
            return null;
        }

        const [nodes, edges] = await Promise.all([
            entitiesRepository.findAllByLoreSlug(slug),
            relationshipsRepository.findAllByLoreSlug(slug)
        ]);

        return {
            lore,
            nodes,
            edges
        };
    }
};

module.exports = relationshipsService;
