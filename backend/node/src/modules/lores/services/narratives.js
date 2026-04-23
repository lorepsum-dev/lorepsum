const narrativesRepository = require('../repositories/narratives');
const { getLoreOrNull } = require('./context');

const narrativesService = {
    async listByLoreSlug(slug) {
        const lore = await getLoreOrNull(slug);

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
