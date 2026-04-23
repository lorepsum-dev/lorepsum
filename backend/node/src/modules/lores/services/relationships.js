const relationshipsRepository = require('../repositories/relationships');
const { getLoreOrNull } = require('./context');

const relationshipsService = {
    async listByLoreSlug(slug) {
        const lore = await getLoreOrNull(slug);

        if (!lore) {
            return null;
        }

        return {
            lore,
            relationships: await relationshipsRepository.findAllByLoreSlug(slug)
        };
    }
};

module.exports = relationshipsService;
