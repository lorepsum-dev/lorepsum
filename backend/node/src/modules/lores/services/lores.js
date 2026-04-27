const loresRepository = require('../repositories/lores');
const entityModalPresentationRepository = require('../repositories/entityModalPresentation');
const { getLoreOrNull } = require('./context');

const loresService = {
    async listAll() {
        return loresRepository.findAll();
    },

    async findById(loreId) {
        const lore = await getLoreOrNull(loreId);

        if (!lore) {
            return null;
        }

        const [features, sidebarGroups, entityModalPresentation] = await Promise.all([
            loresRepository.findFeaturesByLoreId(lore.id),
            loresRepository.findSidebarGroupsByLoreId(lore.id),
            entityModalPresentationRepository.findByLoreId(lore.id)
        ]);

        return {
            ...lore,
            features,
            sidebar_groups: sidebarGroups,
            entity_modal_presentation: entityModalPresentation
        };
    },

    async listFeatures(loreId) {
        const lore = await getLoreOrNull(loreId);

        if (!lore) {
            return null;
        }

        return {
            lore,
            features: await loresRepository.findFeaturesByLoreId(lore.id)
        };
    },

    async listSidebarGroups(loreId) {
        const lore = await getLoreOrNull(loreId);

        if (!lore) {
            return null;
        }

        return {
            lore,
            sidebar_groups: await loresRepository.findSidebarGroupsByLoreId(lore.id)
        };
    }
};

module.exports = loresService;
