const loresRepository = require('../repositories/lores');
const entitiesRepository = require('../repositories/entities');
const relationshipsRepository = require('../repositories/relationships');
const narrativesRepository = require('../repositories/narratives');
const { getLorePresentation } = require('../config/presentation');
const { getLoreOrNull } = require('./context');

const lorePageService = {
    async findBySlug(slug) {
        const lore = await getLoreOrNull(slug);

        if (!lore) {
            return null;
        }

        const [
            features,
            sidebarGroups,
            entities,
            relationships,
            narratives
        ] = await Promise.all([
            loresRepository.findFeaturesByLoreId(lore.id),
            loresRepository.findSidebarGroupsByLoreId(lore.id),
            entitiesRepository.findAllByLoreSlug(slug),
            relationshipsRepository.findAllByLoreSlug(slug),
            narrativesRepository.findAllByLoreSlug(slug)
        ]);

        return {
            lore: {
                ...lore,
                features,
                sidebar_groups: sidebarGroups,
                presentation: getLorePresentation(slug)
            },
            entities,
            relationships,
            narratives
        };
    }
};

module.exports = lorePageService;
