const loresRepository = require('../repositories/lores');
const narrativesRepository = require('../repositories/narratives');

const narrativesService = {
    async listByLoreSlug(slug) {
        const lore = await loresRepository.findBySlug(slug);

        if (!lore) {
            return null;
        }

        return {
            lore,
            narratives: await narrativesRepository.findAllByLoreSlug(slug)
        };
    }
};

module.exports = narrativesService;
