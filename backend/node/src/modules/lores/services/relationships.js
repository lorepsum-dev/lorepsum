const loresRepository = require('../repositories/lores');
const relationshipsRepository = require('../repositories/relationships');

const relationshipsService = {
    async listByLoreSlug(slug) {
        const lore = await loresRepository.findBySlug(slug);

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
