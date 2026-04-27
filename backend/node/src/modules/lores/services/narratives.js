const narrativesRepository = require('../repositories/narratives');
const { getLoreOrNull } = require('./context');

const narrativesService = {
    async listByLoreId(loreId) {
        const lore = await getLoreOrNull(loreId);

        if (!lore) {
            return null;
        }

        return {
            lore,
            narratives: await narrativesRepository.findAllByLoreId(lore.id)
        };
    }
};

module.exports = narrativesService;
