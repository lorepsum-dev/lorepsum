const loresRepository = require('../repositories/lores');
const entitiesRepository = require('../repositories/entities');
const relationshipsRepository = require('../repositories/relationships');
const narrativesRepository = require('../repositories/narratives');
const entityModalPresentationRepository = require('../repositories/entityModalPresentation');
const { getLoreOrNull } = require('./context');

const lorePageService = {
    async findById(loreId) {
        const lore = await getLoreOrNull(loreId);

        if (!lore) {
            return null;
        }

        const [
            features,
            sidebarGroups,
            entityModalPresentation,
            entities,
            relationships,
            narratives
        ] = await Promise.all([
            loresRepository.findFeaturesByLoreId(lore.id),
            loresRepository.findSidebarGroupsByLoreId(lore.id),
            entityModalPresentationRepository.findByLoreId(lore.id),
            entitiesRepository.findAllByLoreId(lore.id),
            relationshipsRepository.findAllByLoreId(lore.id),
            narrativesRepository.findAllByLoreId(lore.id)
        ]);

        return {
            lore: {
                ...lore,
                features,
                sidebar_groups: sidebarGroups,
                entity_modal_presentation: entityModalPresentation
            },
            graph: {
                nodes: entities,
                edges: relationships
            },
            narratives
        };
    }
};

module.exports = lorePageService;
